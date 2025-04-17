package br.com.topone.elevenapi.util;

import org.springframework.stereotype.Component;

@Component
public class CapitalizeUtil {

    /**
     * Formata o texto para Title Case, onde a primeira letra de cada palavra é maiúscula.
     * @param text O texto a ser formatado
     * @return O texto formatado em Title Case
     */
    public String capitalize(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        
        StringBuilder formatted = new StringBuilder();
        boolean capitalizeNext = true;
        
        for (char c : text.toCharArray()) {
            if (Character.isSpaceChar(c) || c == '-' || c == '_' || c == '.') {
                capitalizeNext = true;
                formatted.append(c);
            } else if (capitalizeNext) {
                formatted.append(Character.toUpperCase(c));
                capitalizeNext = false;
            } else {
                formatted.append(Character.toLowerCase(c));
            }
        }
        
        return formatted.toString();
    }
}