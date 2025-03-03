package br.com.topone.elevenapi.records;

import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.entities.UserProfile;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record UserWithProfileRecord(
        Long id,
        String name,
        String email,
        boolean active,
        Instant createdAt,
        Instant updatedAt,
        Long userProfileId, // ID do perfil (pode ser null)
        String cpf, // CPF do perfil (pode ser null)
        LocalDate birthDate, // Data de nascimento do perfil (pode ser null)
        String phone, // Telefone do perfil (pode ser null)
        String motherName, // Nome da mãe do perfil (pode ser null)
        String fatherName, // Nome do pai do perfil (pode ser null)
        List<AddressRecord> addresses // Lista de endereços (pode ser null)
) {

    public UserWithProfileRecord(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.isActive(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                (user.getProfile() != null) ? user.getProfile().getId() : null,
                (user.getProfile() != null) ? user.getProfile().getCpf() : null,
                (user.getProfile() != null) ? user.getProfile().getBirthDate() : null,
                (user.getProfile() != null) ? user.getProfile().getPhone() : null,
                (user.getProfile() != null) ? user.getProfile().getMotherName() : null,
                (user.getProfile() != null) ? user.getProfile().getFatherName() : null,
                (user.getProfile() != null && user.getProfile().getAddresses() != null)
                        ? user.getProfile().getAddresses().stream()
                        .map(AddressRecord::new)
                        .collect(Collectors.toList())
                        : null
        );
    }
}