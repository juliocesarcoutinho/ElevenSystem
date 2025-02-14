package br.com.topone.elevenapi.records;

import br.com.topone.elevenapi.service.validation.ValidEmailDomain;
import jakarta.validation.constraints.NotBlank;

public record EmailRecord(@NotBlank @ValidEmailDomain String email) {
}
