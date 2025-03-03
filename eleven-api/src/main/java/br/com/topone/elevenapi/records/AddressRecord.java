package br.com.topone.elevenapi.records;

import br.com.topone.elevenapi.entities.Address;
import jakarta.validation.constraints.NotBlank;

public record AddressRecord(
        Long id,
        @NotBlank(message = "O CEP é obrigatório")
        String zipCode,
        String street,
        String number,
        String complement,
        String district,
        String city,
        String uf
) {
        
    public AddressRecord(Address address) {
        this(
                address.getId(),
                address.getZipCode(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getDistrict(),
                address.getCity(),
                address.getUf()
        );
    }
}
