package ru.kata.spring.boot_security.demo.util;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserErrorResponse {
    private String msg;
    private long timestamp;

    public UserErrorResponse(String msg, long timestamp) {
        this.msg = msg;
        this.timestamp = timestamp;
    }
}
