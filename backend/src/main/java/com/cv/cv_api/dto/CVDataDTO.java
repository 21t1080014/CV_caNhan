package com.cv.cv_api.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CVDataDTO {
    private Long id;
    private String fullName;
    private String email;
    private String about;
    private String summary;
    private List<String> skills;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> education;
    private List<ProjectDTO> projects;
    private String phoneNumber;
    private String location;
    private String profileImage;
    private SocialLinksDTO socialLinks;
    private boolean isPublished;

    @Data
    @Builder
    public static class ExperienceDTO {
        private String company;
        private String position;
        private String startDate;
        private String endDate;
        private String description;
    }

    @Data
    @Builder
    public static class EducationDTO {
        private String school;
        private String degree;
        private String field;
        private String graduationDate;
    }

    @Data
    @Builder
    public static class ProjectDTO {
        private String name;
        private String description;
        private String link;
        private String technologies;
    }

    @Data
    @Builder
    public static class SocialLinksDTO {
        private String linkedin;
        private String github;
        private String portfolio;
        private String twitter;
    }
}
