package br.com.topone.elevenapi.repositories;

import br.com.topone.elevenapi.entities.Adress;
import br.com.topone.elevenapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdressRepository extends JpaRepository<Adress, Long> {
}
