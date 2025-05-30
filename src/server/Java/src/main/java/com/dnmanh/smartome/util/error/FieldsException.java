package com.dnmanh.smartome.util.error;

import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class FieldsException extends RuntimeException {
    private final List<InvalidFieldDTO> errors;

    public FieldsException(List<InvalidFieldDTO> errors) {
        super("Invalid field value");
        this.errors = errors;
    }
}

