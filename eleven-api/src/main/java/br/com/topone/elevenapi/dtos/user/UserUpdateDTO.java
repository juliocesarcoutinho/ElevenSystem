package br.com.topone.elevenapi.dtos.user;

import br.com.topone.elevenapi.service.validation.UserUpdateValid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@UserUpdateValid
@Getter
@Setter
public class UserUpdateDTO extends UserDTO {
    
    @NotBlank(message = "O campo senha é obrigatório")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    private String password;
}
