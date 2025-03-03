package br.com.topone.elevenapi.service.usuario;

import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.records.UserWithProfileRecord;
import br.com.topone.elevenapi.repositories.UserRepository;
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
    public List<UserWithProfileRecord> getAllUsersWithProfiles() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserWithProfileRecord::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserWithProfileRecord getUserWithProfileById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new UserWithProfileRecord(user);
    }
}