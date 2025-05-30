package com.dnmanh.smartome.util;

import com.dnmanh.smartome.util.constant.TypeAlphabet;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Random;

@Service
public class GenerateUuidUtil {
    private static final String BEAUTI_ALPHABET = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    private static final String SERCURITY_ALPHABET = "123456789abcdefghijklmnpqrstubwxyzABCDEFGHIJKLMNPQRSTUVWXYZ";
    private static final int DEFAULT_SIZE = 21;
    private static final Random random = new SecureRandom();

    /**
     * Tạo ID với độ dài được chỉ định và alphabet mặc định
     *
     * @param size độ dài của ID
     * @return ID được tạo
     */
    public String generateId(int size, TypeAlphabet nameAlphabet) {
        switch (nameAlphabet) {
            case BEAUTI:
                return generateId(size, BEAUTI_ALPHABET);
            case SECURITY:
                return generateId(size, SERCURITY_ALPHABET);
            default:
                return generateId(size, BEAUTI_ALPHABET);
        }
    }

    /**
     * Tạo ID với độ dài và alphabet được chỉ định
     *
     * @param size     độ dài của ID
     * @param alphabet chuỗi ký tự dùng để tạo ID
     * @return ID được tạo
     */
    private String generateId(int size, String alphabet) {

        if (size <= 0) {
            throw new IllegalArgumentException("Size phải lớn hơn 0");
        }

        if (alphabet == null || alphabet.length() == 0) {
            throw new IllegalArgumentException("Alphabet không được null hoặc rỗng");
        }

        final int mask = (2 << (int) Math.floor(Math.log(alphabet.length() - 1) / Math.log(2))) - 1;
        final int step = (int) Math.ceil(1.6 * mask * size / alphabet.length());

        StringBuilder idBuilder = new StringBuilder();

        while (true) {
            byte[] bytes = new byte[step];
            random.nextBytes(bytes);

            for (int i = 0; i < step; i++) {
                int alphabetIndex = bytes[i] & mask;

                if (alphabetIndex < alphabet.length()) {
                    idBuilder.append(alphabet.charAt(alphabetIndex));
                    if (idBuilder.length() == size) {
                        return idBuilder.toString();
                    }
                }
            }
        }
    }
}