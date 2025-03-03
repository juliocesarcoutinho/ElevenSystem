package br.com.topone.elevenapi.resources;

import br.com.topone.elevenapi.records.UserWithProfileRecord;
import br.com.topone.elevenapi.service.usuario.UserWithProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/users-with-profiles")
public class UserWithProfileResource {
    
    private final UserWithProfileService userWithProfileService;
    
    public UserWithProfileResource(UserWithProfileService userWithProfileService) {
        this.userWithProfileService = userWithProfileService;
    }

    @GetMapping
    public ResponseEntity<List<UserWithProfileRecord>> getAllUsersWithProfiles() {
        List<UserWithProfileRecord> usersWithProfiles = userWithProfileService.getAllUsersWithProfiles();
        return ResponseEntity.ok(usersWithProfiles);
    }

    /**
     * Endpoint to pursue a specific user with your profile by ID.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserWithProfileRecord> getUserWithProfileById(@PathVariable Long userId) {
        UserWithProfileRecord userWithProfile = userWithProfileService.getUserWithProfileById(userId);
        return ResponseEntity.ok(userWithProfile);
    }
}
