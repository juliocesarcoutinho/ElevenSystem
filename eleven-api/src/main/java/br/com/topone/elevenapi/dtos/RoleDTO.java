package br.com.topone.elevenapi.dtos;

import br.com.topone.elevenapi.entities.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleDTO {

    private Long id;
    private String authority;

    public RoleDTO() {}

    public RoleDTO(Long id, String authority) {
        this.id = id;
        this.authority = authority;
    }

    public RoleDTO(Role role) {
        id = role.getId();
        authority = mapAuthority(role.getAuthority());
    }

    private String mapAuthority(String authority) {
        authority = authority.replaceFirst("^ROLE_", "");
        return switch (authority) {
            case "OPERATOR" -> "OPERADOR";
            case "ADMIN" -> "ADMINISTRADOR";
            default -> authority;
        };
    }
    
}
