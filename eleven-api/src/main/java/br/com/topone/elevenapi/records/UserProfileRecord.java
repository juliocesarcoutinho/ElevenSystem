package br.com.topone.elevenapi.records;

import br.com.topone.elevenapi.dtos.user.UserDTO;
import br.com.topone.elevenapi.entities.UserProfile;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.UniqueElements;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public record UserProfileRecord(
        Long id,
        String cpf,
        LocalDate birthDate,
        String phone,
        String motherName,
        String fatherName,
        UserDTO user,
        Set<AddressRecord> address
        
) {
    
    public UserProfileRecord(UserProfile userProfile) {
        this(
                userProfile.getId(),
                userProfile.getCpf(),
                userProfile.getBirthDate(),
                userProfile.getPhone(),
                userProfile.getMotherName(),
                userProfile.getFatherName(),
                new UserDTO(userProfile.getUser()),
                userProfile.getAddresses().stream().map(address -> new AddressRecord(
                        address.getId(),
                        address.getZipCode(),
                        address.getStreet(),
                        address.getNumber(),
                        address.getComplement(),
                        address.getDistrict(),
                        address.getCity(),
                        address.getUf()
                )).collect(Collectors.toSet())
        );
    }
}
