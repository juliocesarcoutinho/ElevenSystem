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
    private String password;
    
}
