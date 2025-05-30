package com.dnmanh.smartome.dto.response;

import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestResponse<T> {
    private int status;
    private String error;

    // message can be string or arrayList
    private Object message;
    private List<InvalidFieldDTO> invalidField;
    private T data;
}
