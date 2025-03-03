package br.com.topone.elevenapi.service.validation;

import br.com.topone.elevenapi.dtos.user.UserInsertDTO;
import br.com.topone.elevenapi.repositories.UserRepository;
import br.com.topone.elevenapi.resources.exceptions.FieldMessage;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.ArrayList;
import java.util.List;


public class UserInsertValidator implements ConstraintValidator<UserInsertValid, UserInsertDTO> {

    private final UserRepository userRepository;

    public UserInsertValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void initialize(UserInsertValid ann) {}

    @Override
    public boolean isValid(UserInsertDTO dto, ConstraintValidatorContext context) {

        List<FieldMessage> list = new ArrayList<>();
        // Coloque aqui seus testes de validação, acrescentando objetos FieldMessage à lista

        var user = userRepository.findByEmail(dto.getEmail());
        if (user != null) {
            list.add(new FieldMessage("email", "Já existe um usuário com este email"));
        }

        for (FieldMessage e : list) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(e.getMessage()).addPropertyNode(e.getFieldName())
                    .addConstraintViolation();
        }
        return list.isEmpty();
    }
}