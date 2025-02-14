package br.com.topone.elevenapi.dtos.user;

import br.com.topone.elevenapi.service.validation.UserInsertValid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@UserInsertValid
public class UserInsertDTO extends UserDTO {
    
    @NotBlank(message = "O campo senha é obrigatório")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    private String password;
    
    public UserInsertDTO() {
        super();
    }
    
}
