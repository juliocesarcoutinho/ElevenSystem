package br.com.topone.elevenapi.records;

import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.entities.UserProfile;

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
        User user,
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
                userProfile.getUser(),
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
