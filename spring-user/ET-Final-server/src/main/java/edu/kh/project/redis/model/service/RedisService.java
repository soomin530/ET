package edu.kh.project.redis.model.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.common.jwt.JwtTokenUtil.TokenInfo;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {

    @Autowired
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtTokenUtil jwtTokenUtil;

    // 로그인 시 토큰 생성 및 Redis에 Refresh Token 저장
    public TokenInfo login(String memberNo, String memberEmail) {
        TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);
        saveRefreshToken(tokenInfo.refreshToken(), memberNo, jwtTokenUtil.getRefreshTokenValidityInMilliseconds());
        return tokenInfo;
    }

    // Access Token 재발급
    public String reissueAccessToken(String refreshToken) {
        if (!isTokenValid(refreshToken)) {
            throw new JwtException("Invalid refresh token");
        }

        String memberNo = jwtTokenUtil.getMemberNoFromToken(refreshToken);
        String savedMemberNo = getMemberNoFromToken(refreshToken);

        if (savedMemberNo == null || !savedMemberNo.equals(memberNo)) {
            throw new JwtException("Refresh token not found or not matched");
        }

        return jwtTokenUtil.regenerateAccessToken(refreshToken);
    }

    // Refresh Token Redis 저장
    public void saveRefreshToken(String token, String memberNo, long durationInMillis) {
        redisTemplate.opsForValue().set(token, memberNo, durationInMillis, TimeUnit.MILLISECONDS);
    }

    // Refresh Token으로 회원번호 조회
    public String getMemberNoFromToken(String token) {
        return redisTemplate.opsForValue().get(token);
    }

    // Redis에서 Refresh Token 삭제
    public void deleteRefreshToken(String token) {
        redisTemplate.delete(token);
    }

    // Refresh Token 유효성 검증
    public boolean isTokenValid(String token) {
        return redisTemplate.hasKey(token) && jwtTokenUtil.validateToken(token);
    }
}
