package br.com.topone.elevenapi.service.usuario;

import br.com.topone.elevenapi.dtos.RoleDTO;
import br.com.topone.elevenapi.dtos.user.UserDTO;
import br.com.topone.elevenapi.dtos.user.UserInsertDTO;
import br.com.topone.elevenapi.dtos.user.UserUpdateDTO;
import br.com.topone.elevenapi.entities.Role;
import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.projections.UserDetailsProjection;
import br.com.topone.elevenapi.repositories.RoleRepository;
import br.com.topone.elevenapi.repositories.UserRepository;
import br.com.topone.elevenapi.service.AuthService;
import br.com.topone.elevenapi.service.EmailService;
import br.com.topone.elevenapi.service.exceptions.DatabaseException;
import br.com.topone.elevenapi.service.exceptions.EmailException;
import br.com.topone.elevenapi.service.exceptions.ResourceNotFoundException;
import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.MailSendException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private EmailService emailService;
    private AuthService authService;

    public UserService(
            UserRepository repository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            AuthService authService) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.authService = authService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<UserDetailsProjection> result = repository.searchUserAndRolesByEmail(username);
        if (result.isEmpty()) {
            throw new UsernameNotFoundException("Usuário não encontrado");
        }

        var user = new User();
        user.setEmail(username);
        user.setPassword(result.getFirst().getPassword());
        for (UserDetailsProjection projection : result) {
            user.addRole(new Role(projection.getRoleId(), projection.getAuthority()));
        }

        return user;

    }

    // find all paged
    @Transactional(readOnly = true)
    public Page<UserDTO> findAllPaged(Pageable pageable) {
        Page<User> list = repository.findAll(pageable);
        return list.map(UserDTO::new);
    }

    // find by id
    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        Optional<User> obj = repository.findById(id);
        var entity = obj.orElseThrow(() -> new ResourceNotFoundException(STR."Entidade não encontrada com ID: \{id}"));
        return new UserDTO(entity);
    }
    
    // find me logged user
    @Transactional(readOnly = true)
    public UserDTO findMe() {
        var entity = authService.authenticated();
        return new UserDTO(entity);
    }

    // Insert new user
    @Transactional
    public UserDTO insert(UserInsertDTO dto) throws MessagingException {
        var entity = new User();
        copyDtoToEntity(dto, entity);
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        entity = repository.save(entity);

        try {
            emailService.sendWelcomeEmail(entity.getEmail(), entity.getName(), entity.getEmail(), dto.getPassword());
        } catch (MailSendException e) {
            Throwable cause = e.getCause();
            if (cause instanceof SendFailedException) {
                logger.error("Falha ao enviar e-mail de acesso", e);
                throw new EmailException("Falha ao enviar e-mail. O endereço de e-mail é inválido ou a caixa de correio não existe.", e);
            } else {
                logger.error("Erro de mensagem ao enviar e-mail de acesso", e);
                throw new EmailException("Falha ao enviar e-mail. Verifique as configurações de e-mail e tente novamente.", e);
            }
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        return new UserDTO(entity);
    }

    // Update user
    @Transactional
    public UserDTO update(Long id, UserUpdateDTO dto) {
        try {
            var entity = repository.getReferenceById(id);
            copyDtoToEntity(dto, entity);
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
            entity = repository.save(entity);
            return new UserDTO(entity);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException(STR."Id não encontrado \{id}");
        }
    }

    // Delete user
    public void delete(Long id) {
        try {
            var entity = repository.findById(id).orElseThrow(() ->
                    new ResourceNotFoundException(STR."Id não encontrado \{id}"));
            repository.delete(entity);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Violacão de integridade");
        }
    }

    // Copy DTO to entity
    private void copyDtoToEntity(UserDTO dto, User entity) {
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setActive(dto.isActive());
        entity.getRoles().clear();
        for (RoleDTO roleDTO : dto.getRoles()) {
            var role = roleRepository.getReferenceById(roleDTO.getId());
            entity.getRoles().add(role);
        }
    }

}

