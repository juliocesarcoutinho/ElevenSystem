package br.com.topone.elevenapi.service.usuario;

import br.com.topone.elevenapi.dtos.RoleDTO;
import br.com.topone.elevenapi.dtos.user.UserDTO;
import br.com.topone.elevenapi.entities.Role;
import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.repositories.RoleRepository;
import br.com.topone.elevenapi.service.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoleService {
    
    private final RoleRepository roleRepository;
    
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }
    
    // find all
    public List<RoleDTO> findAll() {
        return roleRepository.findAll().stream().map(RoleDTO::new).collect(Collectors.toList());
    }
    
    // find by id
    @Transactional(readOnly = true)
    public RoleDTO findById(Long id) {
        Optional<Role> obj = roleRepository.findById(id);
        var entity = obj.orElseThrow(() -> new ResourceNotFoundException(STR."Entidade não encontrada com ID: \{id}"));
        return new RoleDTO(entity);
    }
    
}
