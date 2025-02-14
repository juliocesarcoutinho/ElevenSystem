package br.com.topone.elevenapi.service.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import javax.naming.NamingException;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;

public class EmailDomainValidator implements ConstraintValidator<ValidEmailDomain, String> {

    @Override
    public void initialize(ValidEmailDomain constraintAnnotation) {
        // Inicialização se necessário
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.isEmpty()) {
            return true; // Validação para campo não nulo ou vazio deve ser feita em outra anotação
        }

        String domain = email.substring(email.indexOf('@') + 1);
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            InitialDirContext ctx = new InitialDirContext(env);
            ctx.getAttributes(domain, new String[]{"MX"});
            return true;
        } catch (NamingException e) {
            return false;
        }
    }
}
