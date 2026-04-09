package com.cv.cv_api.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSchemaMigration implements ApplicationRunner {
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        migrateProfileImageColumn();
    }

    private void migrateProfileImageColumn() {
        String dataType = jdbcTemplate.query(
                """
                SELECT DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'cv_data'
                  AND COLUMN_NAME = 'profile_image'
                """,
                rs -> rs.next() ? rs.getString("DATA_TYPE") : null
        );

        if (dataType == null) {
            log.info("Skipping profile_image migration because cv_data.profile_image does not exist yet");
            return;
        }

        if ("mediumtext".equalsIgnoreCase(dataType) || "longtext".equalsIgnoreCase(dataType)) {
            log.info("profile_image column already uses {}", dataType);
            return;
        }

        log.info("Updating cv_data.profile_image column from {} to LONGTEXT", dataType);
        jdbcTemplate.execute("ALTER TABLE cv_data MODIFY COLUMN profile_image LONGTEXT NULL");
    }
}
