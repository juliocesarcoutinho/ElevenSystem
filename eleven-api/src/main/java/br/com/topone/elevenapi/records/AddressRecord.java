package br.com.topone.elevenapi.records;

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
}
