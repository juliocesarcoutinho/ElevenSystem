package br.com.topone.elevenapi.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.Set;

@Data
@Entity
@Table(name = "tb_user_profile")
@EqualsAndHashCode(of = "id")
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 14, nullable = false, unique = true)
    private String cpf;
    
    @Column
    @Temporal(TemporalType.DATE)
    private LocalDate birthDate;
    
    @Column(length = 15) // (14) 99999-9999
    private String phone;
    
    @Column(length = 160)
    private String motherName;
    
    @Column(length = 160)
    private String fatherName;
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToMany(mappedBy = "userProfile")
    private Set<Adress> adress;
    
    
    
}
