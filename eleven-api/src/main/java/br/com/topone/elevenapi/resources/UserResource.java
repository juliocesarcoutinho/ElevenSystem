package br.com.topone.elevenapi.resources;

import br.com.topone.elevenapi.dtos.user.UserDTO;
import br.com.topone.elevenapi.dtos.user.UserInsertDTO;
import br.com.topone.elevenapi.dtos.user.UserUpdateDTO;
import br.com.topone.elevenapi.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping(value = "/users")
public class UserResource {
    
    private final UserService service;
    
    public UserResource(UserService service) {
        this.service = service;
    }
    
    // find all paged
    @GetMapping
    public ResponseEntity<Page<UserDTO>> findAll(Pageable pageable) {
        Page<UserDTO> users = service.findAllPaged(pageable);
        return ResponseEntity.ok().body(users);
    }
    
    // find by id
    @GetMapping(value = "/{id}")
    public ResponseEntity<UserDTO> findById(@PathVariable("id") Long id) {
        var dto = service.findById(id);
        return ResponseEntity.ok().body(dto);
    }
    
    // insert user
    @PostMapping
    public ResponseEntity<UserDTO> insertAdm(@RequestBody @Valid UserInsertDTO dto) throws MessagingException {
        var newDto = service.insert(dto);
        var uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(newDto.getId()).toUri();

        return ResponseEntity.created(uri).body(newDto);
    }
    
    // Update user
    @PutMapping(value = "/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable("id") Long id, @RequestBody @Valid UserUpdateDTO dto) {
        var newDto = service.update(id, dto);
        return ResponseEntity.ok().body(newDto);
    }
    
    // Delete user
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
