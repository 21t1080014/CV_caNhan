package com.cv.cv_api.service;
import com.cv.cv_api.dto.CVDataDTO;
import com.cv.cv_api.entity.AdminUser;
import com.cv.cv_api.entity.CVData;
import com.cv.cv_api.repository.AdminUserRepository;
import com.cv.cv_api.repository.CVDataRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CVDataService {
    private final CVDataRepository cvRepository;
    private final AdminUserRepository adminUserRepository;
    private final ObjectMapper objectMapper;

    // Public: Lấy CV công khai (cho viewers)
    public CVDataDTO getPublicCV() {
        CVData cv = cvRepository.findByIsPublishedTrue()
                .orElseThrow(() -> new RuntimeException("CV chưa được công bố"));
        return convertToDTO(cv);
    }

    // Admin: Lấy CV hiện tại để chỉnh sửa
    public CVDataDTO getAdminCV(String adminUsername) {
        AdminUser admin = getAdminByUsername(adminUsername);
        CVData cv = cvRepository.findByEmail(admin.getEmail())
                .orElseGet(() -> CVData.builder()
                        .email(admin.getEmail())
                        .fullName(resolveDefaultFullName(admin))
                        .isPublished(false)
                        .build()
                );
        return convertToDTO(cv);
    }

    // Admin: Cập nhật CV
    public CVDataDTO updateCV(String adminUsername, CVDataDTO dto) {
        AdminUser admin = getAdminByUsername(adminUsername);
        CVData cv = cvRepository.findByEmail(admin.getEmail())
                .orElse(CVData.builder()
                        .email(admin.getEmail())
                        .fullName(resolveDefaultFullName(admin))
                        .isPublished(false)
                        .build()
                );

        CVDataDTO normalizedDto = normalizeDto(dto, admin);

        cv.setFullName(normalizedDto.getFullName());
        cv.setEmail(admin.getEmail());
        cv.setAbout(normalizedDto.getAbout());
        cv.setSummary(normalizedDto.getSummary());
        cv.setPhoneNumber(normalizedDto.getPhoneNumber());
        cv.setLocation(normalizedDto.getLocation());
        cv.setProfileImage(normalizedDto.getProfileImage());
        cv.setUpdatedAt(LocalDateTime.now());

        // Convert lists to JSON
        try {
            cv.setSkills(objectMapper.writeValueAsString(normalizedDto.getSkills()));
            cv.setExperiences(objectMapper.writeValueAsString(normalizedDto.getExperiences()));
            cv.setEducation(objectMapper.writeValueAsString(normalizedDto.getEducation()));
            cv.setProjects(objectMapper.writeValueAsString(normalizedDto.getProjects()));
            cv.setSocialLinks(objectMapper.writeValueAsString(normalizedDto.getSocialLinks()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi xử lý dữ liệu", e);
        }

        CVData saved = cvRepository.save(cv);
        return convertToDTO(saved);
    }

    // Admin: Công bố/ẩn CV
    public void publishCV(String adminUsername, boolean publish) {
        AdminUser admin = getAdminByUsername(adminUsername);
        CVData cv = cvRepository.findByEmail(admin.getEmail())
                .orElseThrow(() -> new RuntimeException("CV không tồn tại"));
        cv.setPublished(publish);
        cvRepository.save(cv);
    }

    private CVDataDTO convertToDTO(CVData cv) {
        return CVDataDTO.builder()
                .id(cv.getId())
                .fullName(defaultString(cv.getFullName()))
                .email(defaultString(cv.getEmail()))
                .about(defaultString(cv.getAbout()))
                .summary(defaultString(cv.getSummary()))
                .skills(readList(cv.getSkills(), new TypeReference<List<String>>() {}))
                .experiences(readList(cv.getExperiences(), new TypeReference<List<CVDataDTO.ExperienceDTO>>() {}))
                .education(readList(cv.getEducation(), new TypeReference<List<CVDataDTO.EducationDTO>>() {}))
                .projects(readList(cv.getProjects(), new TypeReference<List<CVDataDTO.ProjectDTO>>() {}))
                .phoneNumber(defaultString(cv.getPhoneNumber()))
                .location(defaultString(cv.getLocation()))
                .profileImage(defaultString(cv.getProfileImage()))
                .socialLinks(readSocialLinks(cv.getSocialLinks()))
                .isPublished(cv.isPublished())
                .build();
    }

    private AdminUser getAdminByUsername(String username) {
        return adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));
    }

    private CVDataDTO normalizeDto(CVDataDTO dto, AdminUser admin) {
        CVDataDTO source = dto != null ? dto : CVDataDTO.builder().build();
        CVDataDTO.SocialLinksDTO socialLinks = source.getSocialLinks();

        return CVDataDTO.builder()
                .id(source.getId())
                .fullName(defaultString(source.getFullName(), resolveDefaultFullName(admin)))
                .email(admin.getEmail())
                .about(defaultString(source.getAbout()))
                .summary(defaultString(source.getSummary()))
                .skills(source.getSkills() != null ? source.getSkills() : Collections.emptyList())
                .experiences(source.getExperiences() != null ? source.getExperiences() : Collections.emptyList())
                .education(source.getEducation() != null ? source.getEducation() : Collections.emptyList())
                .projects(source.getProjects() != null ? source.getProjects() : Collections.emptyList())
                .phoneNumber(defaultString(source.getPhoneNumber()))
                .location(defaultString(source.getLocation()))
                .profileImage(defaultString(source.getProfileImage()))
                .socialLinks(CVDataDTO.SocialLinksDTO.builder()
                        .linkedin(defaultString(socialLinks != null ? socialLinks.getLinkedin() : null))
                        .github(defaultString(socialLinks != null ? socialLinks.getGithub() : null))
                        .portfolio(defaultString(socialLinks != null ? socialLinks.getPortfolio() : null))
                        .twitter(defaultString(socialLinks != null ? socialLinks.getTwitter() : null))
                        .build())
                .isPublished(source.isPublished())
                .build();
    }

    private <T> List<T> readList(String value, TypeReference<List<T>> typeReference) {
        if (value == null || value.isBlank() || "null".equalsIgnoreCase(value)) {
            return Collections.emptyList();
        }

        try {
            List<T> result = objectMapper.readValue(value, typeReference);
            return result != null ? result : Collections.emptyList();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi chuyển đổi dữ liệu danh sách", e);
        }
    }

    private CVDataDTO.SocialLinksDTO readSocialLinks(String value) {
        if (value == null || value.isBlank() || "null".equalsIgnoreCase(value)) {
            return emptySocialLinks();
        }

        try {
            CVDataDTO.SocialLinksDTO socialLinks = objectMapper.readValue(value, CVDataDTO.SocialLinksDTO.class);
            if (socialLinks == null) {
                return emptySocialLinks();
            }

            return CVDataDTO.SocialLinksDTO.builder()
                    .linkedin(defaultString(socialLinks.getLinkedin()))
                    .github(defaultString(socialLinks.getGithub()))
                    .portfolio(defaultString(socialLinks.getPortfolio()))
                    .twitter(defaultString(socialLinks.getTwitter()))
                    .build();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi chuyển đổi dữ liệu liên kết", e);
        }
    }

    private CVDataDTO.SocialLinksDTO emptySocialLinks() {
        return CVDataDTO.SocialLinksDTO.builder()
                .linkedin("")
                .github("")
                .portfolio("")
                .twitter("")
                .build();
    }

    private String defaultString(String value) {
        return defaultString(value, "");
    }

    private String defaultString(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback == null ? "" : fallback;
        }

        return value;
    }

    private String resolveDefaultFullName(AdminUser admin) {
        if (admin == null) {
            return "";
        }

        if (admin.getFullName() != null && !admin.getFullName().isBlank()) {
            return admin.getFullName();
        }

        if (admin.getUsername() != null && !admin.getUsername().isBlank()) {
            return admin.getUsername();
        }

        return defaultString(admin.getEmail());
    }
}
