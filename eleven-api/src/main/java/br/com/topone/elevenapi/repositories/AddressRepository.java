package br.com.topone.elevenapi.repositories;

import br.com.topone.elevenapi.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
