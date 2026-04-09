package com.cv.cv_api.controller;

import com.cv.cv_api.dto.CVDataDTO;
import com.cv.cv_api.service.CVDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicCVController {
    private final CVDataService cvService;

    @GetMapping("/cv")
    public ResponseEntity<CVDataDTO> getPublicCV() {
        return ResponseEntity.ok(cvService.getPublicCV());
    }
}
