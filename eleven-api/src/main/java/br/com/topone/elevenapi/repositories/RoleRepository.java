package br.com.topone.elevenapi.repositories;

import br.com.topone.elevenapi.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Role findByAuthority(String authority);
    
}
