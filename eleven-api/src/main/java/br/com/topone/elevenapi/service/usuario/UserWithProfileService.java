package br.com.topone.elevenapi.service.usuario;

import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.records.UserWithProfileRecord;
import br.com.topone.elevenapi.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserWithProfileService {

    private final UserRepository userRepository;

    public UserWithProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<UserWithProfileRecord> getAllUsersWithProfiles(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(UserWithProfileRecord::new);
    }

    @Transactional(readOnly = true)
    public UserWithProfileRecord getUserWithProfileById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new UserWithProfileRecord(user);
    }
}