package br.com.topone.elevenapi.resources;

import br.com.topone.elevenapi.dtos.RoleDTO;
import br.com.topone.elevenapi.service.usuario.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/roles")
public class RoleResource {
    
    private final RoleService roleService;
    
    public RoleResource(RoleService roleService) {
        this.roleService = roleService;
    }
    
    // find all
    @GetMapping
    public ResponseEntity<List<RoleDTO>> findAll() {
        List<RoleDTO> roles = roleService.findAll();
        return ResponseEntity.ok().body(roles);
    }
    
    // find by id
    @GetMapping(value = "/{id}")
    public ResponseEntity<RoleDTO> findById(@PathVariable Long id) {
        var dto = roleService.findById(id);
        return ResponseEntity.ok().body(dto);
    }
    
}
