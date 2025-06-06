package br.com.topone.elevenapi.repositories;

import br.com.topone.elevenapi.entities.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    boolean existsByUserId(Long userId);
}
