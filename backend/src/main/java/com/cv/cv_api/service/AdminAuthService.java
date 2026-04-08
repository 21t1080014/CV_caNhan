package com.cv.cv_api.service;
import com.cv.cv_api.dto.LoginRequestDTO;
import com.cv.cv_api.dto.LoginResponseDTO;
import com.cv.cv_api.entity.AdminUser;
import com.cv.cv_api.repository.AdminUserRepository;
import com.cv.cv_api.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminAuthService {
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponseDTO login(LoginRequestDTO request) {
        AdminUser admin = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));

        if (!admin.isActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }

        // Cập nhật lastLogin
        admin.setLastLogin(LocalDateTime.now());
        adminUserRepository.save(admin);

        String token = jwtTokenProvider.generateToken(admin.getUsername());

        return LoginResponseDTO.builder()
                .token(token)
                .username(admin.getUsername())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .build();
    }
}
