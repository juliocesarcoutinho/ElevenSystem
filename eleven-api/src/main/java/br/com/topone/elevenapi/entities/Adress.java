package br.com.topone.elevenapi.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "tb_adress")
@EqualsAndHashCode(of = "id")
public class Adress {
    
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
    
}
