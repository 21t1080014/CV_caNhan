package com.cv.cv_api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private String token;
    private String username;
    private String email;
    private String fullName;
}

