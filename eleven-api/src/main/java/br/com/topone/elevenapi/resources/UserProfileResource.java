package br.com.topone.elevenapi.resources;

import br.com.topone.elevenapi.dtos.user.UserDTO;
import br.com.topone.elevenapi.dtos.user.UserInsertDTO;
import br.com.topone.elevenapi.records.UserProfileRecord;
import br.com.topone.elevenapi.service.usuario.UserProfileService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping(value = "/profiles")
public class UserProfileResource {
    
    private final UserProfileService service;
    
    public UserProfileResource(UserProfileService service) {
        this.service = service;
    }
    
    // find all paged
    @GetMapping
    public ResponseEntity<Page<UserProfileRecord>> findAll(Pageable pageable) {
        Page<UserProfileRecord> profiles = service.findAllPaged(pageable);
        return ResponseEntity.ok().body(profiles);
    }
    
    // find by id
    @GetMapping(value = "/{id}")
    public ResponseEntity<UserProfileRecord> findById(@PathVariable Long id) {
        var dto = service.findById(id);
        return ResponseEntity.ok().body(dto);
    }
    
    // insert user
    @PostMapping
    public ResponseEntity<UserProfileRecord> insertAdm(@RequestBody @Valid UserProfileRecord dto) throws MessagingException {
        var newDto = service.insert(dto);
        var uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(newDto.id()).toUri();

        return ResponseEntity.created(uri).body(newDto);
    }
    
    // Update user
    @PutMapping(value = "/{id}")
    public ResponseEntity<UserProfileRecord> update(@PathVariable("id") Long id, @RequestBody @Valid UserProfileRecord dto) {
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