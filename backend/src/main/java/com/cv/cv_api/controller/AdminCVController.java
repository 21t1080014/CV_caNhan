package com.cv.cv_api.controller;
import com.cv.cv_api.dto.CVDataDTO;
import com.cv.cv_api.service.CVDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCVController {
    private final CVDataService cvService;

    @GetMapping("/cv")
    public ResponseEntity<CVDataDTO> getCV(Authentication auth) {
        return ResponseEntity.ok(cvService.getAdminCV(auth.getName()));
    }

    @PutMapping("/cv")
    public ResponseEntity<CVDataDTO> updateCV(
            Authentication auth,
            @RequestBody CVDataDTO dto) {
        return ResponseEntity.ok(cvService.updateCV(auth.getName(), dto));
    }

    @PostMapping("/cv/publish")
    public ResponseEntity<String> publishCV(
            Authentication auth,
            @RequestParam boolean publish) {
        cvService.publishCV(auth.getName(), publish);
        return ResponseEntity.ok(publish ? "CV đã công bố" : "CV đã ẩn");
    }
}
