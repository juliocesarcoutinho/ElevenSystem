package br.com.topone.elevenapi.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "tb_address")
@EqualsAndHashCode(of = "id")
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 9, nullable = false)
    private String zipCode;
    
    @Column(length = 100, nullable = false)
    private String street;
    
    @Column(length = 100, nullable = false)
    private String city;
    
    @Column(length = 10)
    private String number;
    
    @Column(length = 100)
    private String complement;
    
    @Column(length = 100)
    private String district;
    
    @Column(length = 2)
    private String uf;
    
    @ManyToOne
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;
    
    public Address() {
    }
    
    public Address(Long id, String zipCode, String street, String city, String number, String complement, 
                   String district, String uf) {
        this.id = id;
        this.zipCode = zipCode;
        this.street = street;
        this.city = city;
        this.number = number;
        this.complement = complement;
        this.district = district;
        this.uf = uf;
    }
}
