package com.reqsync.Reqsync.Config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Component
@Data
@Getter
@Setter
public class EncoderConfig {

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
