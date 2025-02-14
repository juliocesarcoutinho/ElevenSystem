package br.com.topone.elevenapi.records;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewPasswordRecord(

        @NotBlank(message = "O campo token é obrigatório")
        String token,

        @NotBlank(message = "O campo senha é obrigatório")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        String password
) {
}
