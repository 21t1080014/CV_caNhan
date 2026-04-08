package com.cv.cv_api.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cv_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(columnDefinition = "LONGTEXT")
    private String about;

    @Column(columnDefinition = "LONGTEXT")
    private String summary;

    @Column(columnDefinition = "JSON")
    private String skills; // JSON array: ["Java", "React", ...]

    @Column(columnDefinition = "JSON")
    private String experiences; // JSON array

    @Column(columnDefinition = "JSON")
    private String education; // JSON array

    @Column(columnDefinition = "JSON")
    private String projects; // JSON array

    private String phoneNumber;

    private String location;

    private String profileImage; // URL to image

    @Column(columnDefinition = "JSON")
    private String socialLinks; // {linkedin, github, portfolio}

    private boolean isPublished = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @Version
    private Long version; // Optimistic locking
}
