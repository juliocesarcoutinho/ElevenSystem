package br.com.topone.elevenapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final String activeProfile;

    @Autowired
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine, @Value("${spring.profiles.active}") String activeProfile) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.activeProfile = activeProfile;
    }

    public void sendWelcomeEmail(String to, String nome, String email, String senha) throws MessagingException {

        if ("test".equals(activeProfile)) {
            System.out.println("Perfil de desenvolvimento ativo. E-mail não será enviado.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

            Context context = new Context();
            context.setVariable("nome", nome);
            context.setVariable("email", email);
            context.setVariable("senha", senha);

            String htmlContent = templateEngine.process("email_acesso", context);

            helper.setTo(to);
            helper.setFrom("contato@toponesystem.com.br");
            helper.setSubject("Bem-vindo ao Sistema Eleven");
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (SendFailedException e) {
            System.err.printf("Erro ao enviar e-mail: %s%n", e.getMessage());
            if (e.getNextException() instanceof jakarta.mail.internet.AddressException) {
                System.err.printf("Endereço de e-mail inválido: %s%n", e.getNextException().getMessage());
            }
            throw e;
        } catch (MessagingException e) {
            System.err.printf("Erro de mensagem: %s%n", e.getMessage());
            throw e;
        }
    }

    public void sendRecoveryEmail(String to, String nome, String token, String recoverUri, Long tokenMinutes) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

            Context context = new Context();
            context.setVariable("nome", nome);
            context.setVariable("token", token);
            context.setVariable("recoverUri", recoverUri);
            context.setVariable("tokenMinutes", tokenMinutes);

            String htmlContent = templateEngine.process("recuperacao_email_acesso", context);

            helper.setTo(to);
            helper.setFrom("contato@toponesystem.com.br");
            helper.setSubject("Recuperação de Senha - Eleven Juventude");
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.printf("Erro de mensagem: %s%n", e.getMessage());
            throw e;
        }
    }
}