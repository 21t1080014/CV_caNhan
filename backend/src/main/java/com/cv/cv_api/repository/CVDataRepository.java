package com.cv.cv_api.repository;

import com.cv.cv_api.entity.CVData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CVDataRepository extends JpaRepository<CVData, Long> {
    Optional<CVData> findByEmail(String email);
    Optional<CVData> findByIsPublishedTrue();
}

