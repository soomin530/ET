package edu.kh.project.redis.model.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class RedisService {
    @Autowired
    
    private RedisTemplate<String, String> redisTemplate;

    // Refresh Token 저장
    public void saveRefreshToken(String token, String memberNo, long durationInMillis) {
        redisTemplate.opsForValue().set(token, memberNo, durationInMillis, TimeUnit.MILLISECONDS);
    }

    // Refresh Token 조회
    public String getMemberIdFromToken(String token) {
        return redisTemplate.opsForValue().get(token);
    }

    // Refresh Token 삭제
    public void deleteRefreshToken(String token) {
        redisTemplate.delete(token);
    }

    // Refresh Token 검증 (존재 여부 확인)
    public boolean isTokenValid(String token) {
        return redisTemplate.hasKey(token);
    }
    
}