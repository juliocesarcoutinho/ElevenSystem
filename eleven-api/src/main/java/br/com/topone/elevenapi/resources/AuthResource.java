package br.com.topone.elevenapi.resources;

import br.com.topone.elevenapi.records.EmailRecord;
import br.com.topone.elevenapi.records.NewPasswordRecord;
import br.com.topone.elevenapi.service.AuthService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/auth")
public class AuthResource {

    private final AuthService service;

    public AuthResource(AuthService service) {
        this.service = service;
    }

    @PostMapping(value = "/recover-token")
    public ResponseEntity<Void> createRecoveryToken(@Valid @RequestBody EmailRecord body) throws MessagingException {
        service.createRecoveryToken(body);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/new-password")
    public ResponseEntity<Void> saveNewPassword(@Valid @RequestBody NewPasswordRecord body) {
        service.saveNewPassword(body);
        return ResponseEntity.noContent().build();
    }
}