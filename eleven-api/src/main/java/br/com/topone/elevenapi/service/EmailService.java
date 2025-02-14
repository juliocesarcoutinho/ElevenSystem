package br.com.topone.elevenapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Autowired
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendWelcomeEmail(String to, String nome, String email, String senha) throws MessagingException {
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
            System.err.println(STR."Erro ao enviar e-mail: \{e.getMessage()}");
            if (e.getNextException() instanceof jakarta.mail.internet.AddressException) {
                System.err.println(STR."Endereço de e-mail inválido: \{e.getNextException().getMessage()}");
            }
            throw e;
        } catch (MessagingException e) {
            System.err.println(STR."Erro de mensagem: \{e.getMessage()}");
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
            System.err.println(STR."Erro de mensagem: \{e.getMessage()}");
            throw e;
        }
    }
}