package com.sisyphus.backend.auth.service;

import com.sisyphus.backend.auth.exception.EmailDeliveryException;
import com.sisyphus.backend.auth.exception.EmailVerificationConflictException;
import com.sisyphus.backend.global.props.MailProps;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Objects;

@Service
@RequiredArgsConstructor
/**
 * Manages email verification code issuance, delivery, and one-time validation.
 */
public class EmailAuthService {

    private final JavaMailSender mailSender;
    private final RedisTemplate<String, String> redis;
    private final MailProps mailProps;

    /** 인증 코드 TTL */
    private static final Duration EXPIRE = Duration.ofMinutes(5);
    /** Redis 키 프리픽스 */
    private static final String KEY_PREFIX = "verify:";

    private static final SecureRandom RAND = new SecureRandom();

    /**
     * Generates and sends a verification code to the requested email address.
     *
     * @param email recipient email address
     */
    public void sendCodeToEmail(String email) {
        final String key = KEY_PREFIX + email;

        final String code = generateCode();

        Boolean created = redis.opsForValue().setIfAbsent(key, code, EXPIRE);
        if (!Boolean.TRUE.equals(created)) {
            throw new EmailVerificationConflictException(
                    "이미 인증 코드가 전송되었습니다. 5분 후 다시 시도해주세요."
            );
        }

        try {
            sendHtmlEmail(email, code);
        } catch (RuntimeException e) {
            redis.delete(key);
            throw e;
        }
    }

    /**
     * Verifies the submitted code and consumes it on success.
     *
     * @param email target email address
     * @param inputCode verification code provided by the client
     * @return {@code true} when the code matches the stored value
     */
    public boolean verifyCode(String email, String inputCode) {
        final String key = KEY_PREFIX + email;
        String saved = redis.opsForValue().get(key);
        if (saved == null) {
            return false;
        }
        boolean ok = saved.equals(inputCode);
        if (ok) {
            redis.delete(key);
        }
        return ok;
    }

    private String generateCode() {
        int n = 100_000 + RAND.nextInt(900_000);
        return Integer.toString(n);
    }

    private void sendHtmlEmail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setTo(to);
            helper.setSubject("[Sisyphus] 이메일 인증 코드 안내");
            helper.setFrom(new InternetAddress(
                    mailProps.from().address(),
                    mailProps.from().name(),
                    StandardCharsets.UTF_8.name()
            ));
            helper.setText(buildHtml(code), true);

            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new EmailDeliveryException();
        }
    }

    private static String buildHtml(String code) {
        return """
            <div style='font-family:Arial, sans-serif; padding:20px;'>
              <h2 style='color:#4CAF50;'>📮 Sisyphus 인증코드</h2>
              <p>안녕하세요!<br>아래 인증 코드를 입력해 주세요. 😊</p>
              <div style='margin:20px 0; font-size:24px; font-weight:bold; color:#333;'>
                👉 <span style='color:#4CAF50;'>%s</span>
              </div>
              <p style='font-size:12px; color:gray;'>
                본 코드는 <strong>5분간</strong>만 유효합니다.<br>본인이 요청하지 않았다면 무시해 주세요.
              </p>
              <hr style='margin-top:30px;'/>
              <p style='font-size:12px; color:gray;'>ⓒ 2025 Sisyphus Inc. All rights reserved.</p>
            </div>
            """.formatted(Objects.requireNonNull(code));
    }
}
