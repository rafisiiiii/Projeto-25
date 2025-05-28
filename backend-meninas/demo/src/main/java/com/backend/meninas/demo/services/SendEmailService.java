package com.backend.meninas.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.backend.meninas.demo.domain.entities.Client;

import jakarta.mail.internet.MimeMessage;

@Service
public class SendEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendConfirmationEmail(Client dto, String destinationEmail) {
        try {
            Context context = new Context();
            context.setVariable("code", dto.getCode());
            context.setVariable("name", dto.getName());
            context.setVariable("type", dto.getType());
            
         
            String formattedTaxId = "";
            if ("J".equals(dto.getType())) {
                formattedTaxId = formatCNPJ(dto.getTaxId());
            } else if ("F".equals(dto.getType())) {
                formattedTaxId = formatCPF(dto.getTaxId());
            }
            context.setVariable("formattedTaxId", formattedTaxId);

            String formattedOpeningDate = formatDate(dto.getOpeningDate());
            context.setVariable("openingDate", formattedOpeningDate);
            context.setVariable("address", dto.getAddress());
            context.setVariable("state", dto.getState());
            context.setVariable("neighborhood", dto.getNeighborhood());
            context.setVariable("city", dto.getCity());
            if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
                context.setVariable("email", dto.getEmail());
            }
    
            if (dto.getPhone() != null && !dto.getPhone().isEmpty()) {
                context.setVariable("phone", dto.getPhone());
                context.setVariable("areaCode", dto.getAreaCode());
            }
            context.setVariable("homepage", dto.getHomepage() != null ? dto.getHomepage() : "");
            context.setVariable("tradeName", dto.getTradeName() != null ? dto.getTradeName() : "");
            context.setVariable("country", dto.getCountry() != null ? dto.getCountry() : "Brasil");
            context.setVariable("cityCode", dto.getCityCode() != null ? dto.getCityCode() : "");
            context.setVariable("zipCode", dto.getZipCode() != null ? dto.getZipCode() : "");
            context.setVariable("storeCode", dto.getStoreCode());

            String htmlContent = templateEngine.process("confirmation_email", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(destinationEmail);
            helper.setFrom("no-reply@maiconsoft.com", "Maiconsoft");
            helper.setSubject("Confirmação de Cadastro de Cliente");
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String formatCNPJ(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) return cnpj != null ? cnpj : "";
        return String.format("%s.%s.%s/%s-%s",
                cnpj.substring(0, 2),
                cnpj.substring(2, 5),
                cnpj.substring(5, 8),
                cnpj.substring(8, 12),
                cnpj.substring(12));
    }

    private String formatCPF(String cpf) {
        if (cpf == null || cpf.length() != 11) return cpf != null ? cpf : "";
        return String.format("%s.%s.%s-%s",
                cpf.substring(0, 3),
                cpf.substring(3, 6),
                cpf.substring(6, 9),
                cpf.substring(9));
    }

    private String formatDate(String rawDate) {
        if (rawDate == null || rawDate.length() != 8) return rawDate != null ? rawDate : "";
        return String.format("%s/%s/%s",
            rawDate.substring(0, 2),
            rawDate.substring(2, 4),
            rawDate.substring(4, 8));
    }
}
