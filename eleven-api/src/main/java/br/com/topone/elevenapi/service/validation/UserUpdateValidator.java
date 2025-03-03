package br.com.topone.elevenapi.service.validation;

import br.com.topone.elevenapi.dtos.user.UserUpdateDTO;
import br.com.topone.elevenapi.repositories.UserRepository;
import br.com.topone.elevenapi.resources.exceptions.FieldMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.servlet.HandlerMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class UserUpdateValidator implements ConstraintValidator<UserUpdateValid, UserUpdateDTO> {
    
    private final UserRepository userRepository;
    
    private final HttpServletRequest request;
    
    public UserUpdateValidator(UserRepository userRepository, HttpServletRequest request) {
        this.userRepository = userRepository;
        this.request = request;
    }

    @Override
    public void initialize(UserUpdateValid ann) {}

    @Override
    public boolean isValid(UserUpdateDTO dto, ConstraintValidatorContext context) {
        
        @SuppressWarnings("unchecked")
        var uriVars = (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        long userId = Long.parseLong(uriVars.get("id"));

        List<FieldMessage> list = new ArrayList<>();
        // Coloque aqui seus testes de validação, acrescentando objetos FieldMessage à lista
        
        var user = userRepository.findByEmail(dto.getEmail());
        if (user != null && userId != user.getId()) {
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