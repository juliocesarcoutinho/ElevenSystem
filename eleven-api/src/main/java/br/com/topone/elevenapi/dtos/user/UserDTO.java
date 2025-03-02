package br.com.topone.elevenapi.dtos.user;

import br.com.topone.elevenapi.dtos.RoleDTO;
import br.com.topone.elevenapi.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class UserDTO {

    private Long id;

    @NotBlank(message = "O campo nome é obrigatório")
    private String name;

    @Email(message = "O email inserido é invalido")
    @NotBlank(message = "O campo email é obrigatório")
    private String email;

    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;
    @Setter(AccessLevel.NONE)
    Set<RoleDTO> roles = new HashSet<>();

    public UserDTO() {
    }

    public UserDTO(Long id, String name, String email, boolean active, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UserDTO(User entity) {
        id = entity.getId();
        name = entity.getName();
        email = entity.getEmail();
        active = entity.isActive();
        createdAt = entity.getCreatedAt();
        updatedAt = entity.getUpdatedAt();
        entity.getRoles().forEach(role -> roles.add(new RoleDTO(role)));
    }
}
