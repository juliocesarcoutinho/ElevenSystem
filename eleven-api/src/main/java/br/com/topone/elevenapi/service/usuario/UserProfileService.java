package br.com.topone.elevenapi.service.usuario;

import br.com.topone.elevenapi.entities.Address;
import br.com.topone.elevenapi.entities.UserProfile;
import br.com.topone.elevenapi.records.UserProfileRecord;
import br.com.topone.elevenapi.repositories.UserProfileRepository;
import br.com.topone.elevenapi.service.AuthService;
import br.com.topone.elevenapi.service.exceptions.DatabaseException;
import br.com.topone.elevenapi.service.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileService {
    
    private final UserProfileRepository repository;
    private final AuthService authService;
    
    public UserProfileService(UserProfileRepository repository, AuthService authService) {
        this.repository = repository;
        this.authService = authService;
    }
    
    // Find all users paginated
    @Transactional(readOnly = true)
    public Page<UserProfileRecord> findAllPaged(Pageable pageable) {
        Page<UserProfile> list = repository.findAll(pageable);
        return list.map(UserProfileRecord::new);
    }
    
    // Find user by id
    @Transactional(readOnly = true)
    public UserProfileRecord findById(Long id) {
        authService.validateSelfOrAdmin(id);
        Optional<UserProfile> obj = repository.findById(id);
        var entity = obj.orElseThrow(() -> new ResourceNotFoundException(STR."Entidade não encontrada com ID: \{id}"));
        return new UserProfileRecord(entity);
    }
    
    // Insert User Profile
    @Transactional
    public UserProfileRecord insert(UserProfileRecord dto) {
        var entity = new UserProfile();
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new UserProfileRecord(entity);
    }
    
    // Update User Profile
    @Transactional
    public UserProfileRecord update(Long id, UserProfileRecord dto) {
        try {
            var entity = repository.getReferenceById(id);
            copyDtoToEntity(dto, entity);
            entity = repository.save(entity);
            return new UserProfileRecord(entity);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException(STR."Entidade não encontrada com ID: \{id}");
        }
    }
    
    // Delete User Profile
    public void delete(Long id) {
        try {
            var entity = repository.findById(id).orElseThrow(() ->
                    new ResourceNotFoundException("Id não encontrado " + id));
            repository.delete(entity);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Violação de integridade");
        }
    }    
    
    // Copy DTO to Entity
    private void copyDtoToEntity(UserProfileRecord dto, UserProfile entity) {
        entity.setCpf(dto.cpf());
        entity.setBirthDate(dto.birthDate());
        entity.setPhone(dto.phone());
        entity.setMotherName(dto.motherName());
        entity.setFatherName(dto.fatherName());
        entity.setUser(dto.user());
        entity.setAddresses(dto.address().stream()
                .map(addressRecord -> new Address(
                        addressRecord.id(),
                        addressRecord.zipCode(),
                        addressRecord.street(),
                        addressRecord.number(),
                        addressRecord.complement(),
                        addressRecord.district(),
                        addressRecord.city(),
                        addressRecord.uf()
                ))
                .collect(Collectors.toSet()));
    }
    
}
