package com.cv.cv_api.service;
import com.cv.cv_api.dto.CVDataDTO;
import com.cv.cv_api.entity.CVData;
import com.cv.cv_api.repository.CVDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class CVDataService {
    private final CVDataRepository cvRepository;
    private final ObjectMapper objectMapper;

    // Public: Lấy CV công khai (cho viewers)
    public CVDataDTO getPublicCV() {
        CVData cv = cvRepository.findByIsPublishedTrue()
                .orElseThrow(() -> new RuntimeException("CV chưa được công bố"));
        return convertToDTO(cv);
    }

    // Admin: Lấy CV hiện tại để chỉnh sửa
    public CVDataDTO getAdminCV(String adminUsername) {
        CVData cv = cvRepository.findByEmail(adminUsername)
                .orElseGet(() -> CVData.builder()
                        .email(adminUsername)
                        .isPublished(false)
                        .build()
                );
        return convertToDTO(cv);
    }

    // Admin: Cập nhật CV
    public CVDataDTO updateCV(String adminUsername, CVDataDTO dto) {
        CVData cv = cvRepository.findByEmail(adminUsername)
                .orElse(CVData.builder()
                        .email(adminUsername)
                        .isPublished(false)
                        .build()
                );

        cv.setFullName(dto.getFullName());
        cv.setAbout(dto.getAbout());
        cv.setSummary(dto.getSummary());
        cv.setPhoneNumber(dto.getPhoneNumber());
        cv.setLocation(dto.getLocation());
        cv.setProfileImage(dto.getProfileImage());
        cv.setUpdatedAt(LocalDateTime.now());

        // Convert lists to JSON
        try {
            cv.setSkills(objectMapper.writeValueAsString(dto.getSkills()));
            cv.setExperiences(objectMapper.writeValueAsString(dto.getExperiences()));
            cv.setEducation(objectMapper.writeValueAsString(dto.getEducation()));
            cv.setProjects(objectMapper.writeValueAsString(dto.getProjects()));
            cv.setSocialLinks(objectMapper.writeValueAsString(dto.getSocialLinks()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi xử lý dữ liệu", e);
        }

        CVData saved = cvRepository.save(cv);
        return convertToDTO(saved);
    }

    // Admin: Công bố/ẩn CV
    public void publishCV(String adminUsername, boolean publish) {
        CVData cv = cvRepository.findByEmail(adminUsername)
                .orElseThrow(() -> new RuntimeException("CV không tồn tại"));
        cv.setPublished(publish);
        cvRepository.save(cv);
    }

    private CVDataDTO convertToDTO(CVData cv) {
        try {
            return CVDataDTO.builder()
                    .id(cv.getId())
                    .fullName(cv.getFullName())
                    .email(cv.getEmail())
                    .about(cv.getAbout())
                    .summary(cv.getSummary())
                    .skills(cv.getSkills() != null ?
                            Arrays.asList(objectMapper.readValue(cv.getSkills(), String[].class)) : null)
                    .phoneNumber(cv.getPhoneNumber())
                    .location(cv.getLocation())
                    .profileImage(cv.getProfileImage())
                    .isPublished(cv.isPublished())
                    .build();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi chuyển đổi dữ liệu", e);
        }
    }
}
