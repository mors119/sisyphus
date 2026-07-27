package com.sisyphus.backend.unit;

import com.sisyphus.backend.auth.dto.LoginRequest;
import com.sisyphus.backend.auth.dto.RegisterRequest;
import com.sisyphus.backend.auth.service.AuthService;
import com.sisyphus.backend.auth.token.ExtensionAuthorizationCodeService;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import com.sisyphus.backend.auth.dto.TokenWithRefresh;
import com.sisyphus.backend.security.jwt.JwtTokenProvider;
import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.dto.AccountUserSnapshot;
import com.sisyphus.backend.user.repository.AccountRepository;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.service.AccountService;
import com.sisyphus.backend.user.util.Provider;
import com.sisyphus.backend.user.util.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtTokenProvider jwtTokenProvider;

    @Mock
    RefreshTokenService refreshTokenService;

    @Mock
    AccountRepository accountRepository;

    @Mock
    AccountService accountService;

    @Mock
    ExtensionAuthorizationCodeService extensionAuthorizationCodeService;

    @InjectMocks
    AuthService authService;

    @Test
    void checkReturnsRepositoryResult() {
        when(accountRepository.existsByEmailAndProvider("user@example.com", Provider.CAMUS)).thenReturn(true);

        boolean result = authService.check("user@example.com");

        assertThat(result).isTrue();
    }

    @Test
    void signupDelegatesProvisioningAndIssuesSession() {
        RegisterRequest request = new RegisterRequest(
                "user@example.com",
                "password",
                Provider.CAMUS,
                "tester"
        );
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "refresh-token").build();
        when(accountService.saveOrGetLocalAccount("user@example.com", "tester", "password"))
                .thenReturn(new AccountUserSnapshot(1L, "user@example.com", Role.USER));
        when(jwtTokenProvider.createAccessToken(1L, "user@example.com", java.util.List.of("USER")))
                .thenReturn("access-token");
        when(jwtTokenProvider.createRefreshToken(1L)).thenReturn("refresh-token");
        when(jwtTokenProvider.createRefreshTokenCookie("refresh-token")).thenReturn(refreshCookie);

        TokenWithRefresh result = authService.signup(request);

        assertThat(result.getAccessToken()).isEqualTo("access-token");
        assertThat(result.getRefreshCookie()).isEqualTo(refreshCookie);
        verify(refreshTokenService).save(1L, "refresh-token");
    }

    @Test
    void loginReturnsAccessTokenAndRefreshCookie() {
        LoginRequest request = new LoginRequest("user@example.com", "password", Provider.CAMUS);
        User user = new User("user@example.com", "tester", Role.USER);
        ReflectionTestUtils.setField(user, "id", 1L);
        Account account = Account.ofLocal("user@example.com", "tester", "encoded-password");
        account.linkToUser(user);
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "refresh-token").build();

        when(accountRepository.findByEmailAndProviderFetchUser("user@example.com", Provider.CAMUS))
                .thenReturn(Optional.of(account));
        when(passwordEncoder.matches("password", "encoded-password")).thenReturn(true);
        when(jwtTokenProvider.createAccessToken(eq(1L), eq("user@example.com"), eq(java.util.List.of("USER"))))
                .thenReturn("access-token");
        when(jwtTokenProvider.createRefreshToken(1L)).thenReturn("refresh-token");
        when(jwtTokenProvider.createRefreshTokenCookie("refresh-token")).thenReturn(refreshCookie);

        TokenWithRefresh result = authService.login(request);

        assertThat(result.getAccessToken()).isEqualTo("access-token");
        assertThat(result.getRefreshCookie()).isEqualTo(refreshCookie);
        verify(refreshTokenService).save(eq(1L), eq("refresh-token"));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void extensionLoginIssuesNoRefreshCredential() {
        LoginRequest request = new LoginRequest("user@example.com", "password", Provider.CAMUS);
        User user = new User("user@example.com", "tester", Role.USER);
        ReflectionTestUtils.setField(user, "id", 1L);
        Account account = Account.ofLocal("user@example.com", "tester", "encoded-password");
        account.linkToUser(user);

        when(accountRepository.findByEmailAndProviderFetchUser("user@example.com", Provider.CAMUS))
                .thenReturn(Optional.of(account));
        when(passwordEncoder.matches("password", "encoded-password")).thenReturn(true);
        when(jwtTokenProvider.createAccessToken(eq(1L), eq("user@example.com"), eq(java.util.List.of("USER"))))
                .thenReturn("access-token");

        assertThat(authService.loginExtension(request)).isEqualTo("access-token");
        verify(jwtTokenProvider, never()).createRefreshToken(anyLong());
        verify(refreshTokenService, never()).save(anyLong(), anyString());
    }

    @Test
    void refreshValidatesStoredCredentialBeforeIssuingAccessToken() {
        User user = new User("user@example.com", "tester", Role.USER);
        ReflectionTestUtils.setField(user, "id", 1L);
        when(jwtTokenProvider.validateToken("refresh-token")).thenReturn(true);
        when(jwtTokenProvider.getUserId("refresh-token")).thenReturn(1L);
        when(refreshTokenService.isValid(1L, "refresh-token")).thenReturn(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(jwtTokenProvider.createAccessToken(1L, "user@example.com", java.util.List.of("USER")))
                .thenReturn("new-access-token");

        assertThat(authService.refreshAccessToken("refresh-token"))
                .isEqualTo("new-access-token");
    }
}
