package br.com.topone.elevenapi.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_role")
@EqualsAndHashCode(of = "id")
public class Role implements GrantedAuthority {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 30, nullable = false, unique = true)
    private String authority;

    @Override
    public String getAuthority() {
        return authority;
    }
}
