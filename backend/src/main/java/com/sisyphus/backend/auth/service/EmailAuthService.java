package com.sisyphus.backend.auth.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailAuthService {

    private final JavaMailSender javaMailSender;
    private final RedisTemplate<String, String> redisTemplate;

    private static final long EXPIRE_MINUTES = 5;

    // email로 전송
    public void sendCodeToEmail(String email) {
        String key = "verify:" + email;

        // 이미 인증코드가 존재하면 5분 동안 재요청 제한
        Boolean isSet = redisTemplate.opsForValue()
                .setIfAbsent(key, generateCode(), Duration.ofMinutes(EXPIRE_MINUTES));

        // 재요청 시 예외 처리
        if (Boolean.FALSE.equals(isSet)) {
            throw new IllegalStateException("이미 인증 코드가 전송되었습니다. 5분 후 다시 시도해주세요.");
        }

        // 이메일 전송 로직
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(email);
        // message.setSubject("[Sisyphus] 이메일 인증 코드");
        // message.setText("인증 코드: " + code + "\n유효시간: " + EXPIRE_MINUTES + "분");
        // javaMailSender.send(message);


        String code = redisTemplate.opsForValue().get(key);
        sendHtmlEmail(email, code); // HTML 전송
    }

    // redis key와 value 비교
    public boolean verifyCode(String email, String inputCode) {
        String saved = redisTemplate.opsForValue().get("verify:" + email);
        return saved != null && saved.equals(inputCode);
    }

    // email code value 범위
    private String generateCode() {
        Random random = new Random();
        int codeNumber = 100_000 + random.nextInt(900_000); // 6자리
        return String.valueOf(codeNumber);
    }

    // email 형식
    private void sendHtmlEmail(String to, String code) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("[Sisyphus] 이메일 인증 코드 안내");
            helper.setFrom(new InternetAddress("no-reply@sisyphus.com", "Sisyphus 인증"));

            String htmlContent = "<div style='font-family:Arial, sans-serif; padding:20px;'>" +
                    "<h2 style='color:#4CAF50;'>📮 Sisyphus 인증코드</h2>" +
                    "<p>안녕하세요!<br>아래 인증 코드를 입력해 주세요. 😊</p>" +
                    "<div style='margin:20px 0; font-size:24px; font-weight:bold; color:#333;'>" +
                    "👉 <span style='color:#4CAF50;'>" + code + "</span></div>" +
                    "<p style='font-size:12px; color:gray;'>본 코드는 <strong>5분간</strong>만 유효합니다.<br>" +
                    "본인이 요청하지 않았다면 무시해 주세요.</p>" +
                    "<hr style='margin-top:30px;'/>" +
                    "<p style='font-size:12px; color:gray;'>ⓒ 2025 Sisyphus Inc. All rights reserved.</p>" +
                    "</div>";

            helper.setText(htmlContent, true); // 💡 true: HTML 모드
            javaMailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("이메일 전송 실패", e);
        }
    }


}