package edu.kh.project.common.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

import org.springframework.stereotype.Component;

@Component
public class IdGeneratorUtil {
    
    public String generateMT20Id() {
        // MT20ID 형식: PF + YYYYMMDD + 3자리 순번
        LocalDateTime now = LocalDateTime.now();
        String prefix = "PF";
        String date = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%03d", generateSequence());
        return prefix + date + sequence;
    }
    
    private int generateSequence() {
        // 실제 구현에서는 DB sequence나 다른 방식으로 순번 생성
        return new Random().nextInt(1000);
    }
}