package com.backend.meninas.demo.helpers;

import java.util.Random;



public class Utils {
     public static String randomString(int len, String an) {
        StringBuilder str = new StringBuilder();
        Random random = new Random();

        int min = "a".equals(an) ? 10 : 0;
        int max = "n".equals(an) ? 10 : 62;

        for (int i = 0; i < len; i++) {
            int r = random.nextInt(max - min) + min;

            if (r > 9) {
                r += (r < 36) ? 55 : 61;
            } else {
                r += 48;
            }

            str.append((char) r);
        }

        return str.toString();
    }


    public static String randomString() {
        return randomString(10, null);
    }
}
