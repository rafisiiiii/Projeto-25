package com.backend.meninas.demo.helpers.exceptions.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorMessageDTO {
    private String field;
    private String message;
}