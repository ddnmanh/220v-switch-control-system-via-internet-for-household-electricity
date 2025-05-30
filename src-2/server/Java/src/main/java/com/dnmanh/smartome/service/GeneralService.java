package com.dnmanh.smartome.service;

import org.springframework.stereotype.Service;

@Service
public class GeneralService {

    public int convertIdStringToInt(String id) {

        if (id == null || id.isEmpty()) {
            return -1;
        }

        try {
            return Integer.parseInt(id);
        } catch (NumberFormatException e) {
            return -1;
        }

    }
}
