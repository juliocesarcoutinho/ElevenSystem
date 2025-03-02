package br.com.topone.elevenapi.service.usuario;

import br.com.topone.elevenapi.entities.Address;
import br.com.topone.elevenapi.entities.User;
import br.com.topone.elevenapi.entities.UserProfile;
import br.com.topone.elevenapi.records.UserProfileRecord;
import br.com.topone.elevenapi.repositories.AddressRepository;
import br.com.topone.elevenapi.repositories.RoleRepository;
import br.com.topone.elevenapi.repositories.UserProfileRepository;
import br.com.topone.elevenapi.service.AuthService;
import br.com.topone.elevenapi.service.exceptions.DatabaseException;
import br.com.topone.elevenapi.service.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserProfileService {
    
    private final UserProfileRepository repository;
    private final AuthService authService;
    private final RoleRepository roleRepository;
    private final AddressRepository addressRepository;
    
    public UserProfileService(UserProfileRepository repository, 
                              AuthService authService, 
                              RoleRepository roleRepository, 
                              AddressRepository addressRepository) {
        this.repository = repository;
        this.authService = authService;
        this.roleRepository = roleRepository;
        this.addressRepository = addressRepository;
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
        if (repository.existsByUserId(dto.user().getId())) {
            throw new DatabaseException("Usuário já possui um perfil");
        }
        var entity = new UserProfile();
        copyDtoToEntity(dto, entity);
    
        // Salvar o UserProfile primeiro
        entity = repository.save(entity);
    
        // Salvar endereços e associá-los ao UserProfile
        UserProfile finalEntity = entity;
        Set<Address> savedAddresses = dto.address().stream()
            .map(addressDto -> {
                Address address = new Address();
                BeanUtils.copyProperties(addressDto, address);
                address.setUserProfile(finalEntity);
                return addressRepository.save(address);
            }).collect(Collectors.toSet());
    
        entity.setAddresses(savedAddresses);
        entity = repository.save(entity); // Salvar novamente para atualizar a relação
    
        return new UserProfileRecord(entity);
    }

    // Update User Profile
    @Transactional
    public UserProfileRecord update(Long id, UserProfileRecord dto) {
        try {
            
            var entity = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(STR."Id não encontrado \{id}"));            
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
                    new ResourceNotFoundException(STR."Id não encontrado \{id}"));
            repository.delete(entity);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Violação de integridade");
        }
    }    
    
    // Copy DTO to Entity    
    private void copyDtoToEntity(UserProfileRecord dto, UserProfile entity) {
        BeanUtils.copyProperties(dto, entity, "id", "user", "address");
    
        User userEntity = new User();
        BeanUtils.copyProperties(dto.user(), userEntity);
        userEntity.getRoles().clear();
        dto.user().getRoles().forEach(roleDTO -> {
            var role = roleRepository.getReferenceById(roleDTO.getId());
            userEntity.getRoles().add(role);
        });
        entity.setUser(userEntity);
    
        entity.setAddresses(dto.address().stream()
                .map(addressRecord -> {
                    Address address = new Address();
                    BeanUtils.copyProperties(addressRecord, address);
                    return address;
                })
                .collect(Collectors.toSet()));
    }
    
}
