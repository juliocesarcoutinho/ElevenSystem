package br.com.topone.elevenapi.service;

import br.com.topone.elevenapi.entities.PasswordRecover;
import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.records.EmailRecord;
import br.com.topone.elevenapi.records.NewPasswordRecord;
import br.com.topone.elevenapi.repositories.PasswordRecoverRepository;
import br.com.topone.elevenapi.repositories.UserRepository;
import br.com.topone.elevenapi.service.exceptions.ForbiddenException;
import br.com.topone.elevenapi.service.exceptions.ResourceNotFoundException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    @Value("${email.password-recover.token.minutes}")
    private Long tokenMinutes;

    @Value("${email.password-recover.uri}")
    private String recoverUri;

    private final UserRepository userRepository;
    private final PasswordRecoverRepository passwordRecoverRepository;
    private final EmailService emailService;
    private PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordRecoverRepository passwordRecoverRepository,
                       EmailService emailService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordRecoverRepository = passwordRecoverRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createRecoveryToken(EmailRecord body) throws MessagingException {
        var user = userRepository.findByEmail(body.email());
        if (user == null) {
            throw new ResourceNotFoundException("Email não encontrado");
        }

        String token = UUID.randomUUID().toString();

        var entity = new PasswordRecover();
        entity.setEmail(body.email());
        entity.setToken(token);
        entity.setExpiration(Instant.now().plusSeconds(tokenMinutes * 60L));
        entity = passwordRecoverRepository.save(entity);

        emailService.sendRecoveryEmail(body.email(), user.getName(), token, recoverUri, tokenMinutes);
    }

    @Transactional
    public void saveNewPassword(NewPasswordRecord body) {
        List<PasswordRecover> result = passwordRecoverRepository.searchValidTokens(body.token(), Instant.now());
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("Token inválido");
        }

        var user = userRepository.findByEmail(result.get(0).getEmail());
        user.setPassword(passwordEncoder.encode(body.password()));
        user = userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public void validateSelfOrAdmin(Long userId) {
        var user = authenticated();
        if (!user.getId().equals(userId) && !user.hasRole("ROLE_ADMIN")) {
            throw new ForbiddenException("Acesso negado");
        }
    }

    public User authenticated() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Jwt jwtPrincipal = (Jwt) authentication.getPrincipal();
            String username = jwtPrincipal.getClaim("username");
            return userRepository.findByEmail(username);
        } catch (Exception e) {
            throw new UsernameNotFoundException("Invalid user");
        }
    }

    
}