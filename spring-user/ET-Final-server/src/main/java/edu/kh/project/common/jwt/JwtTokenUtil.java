package edu.kh.project.common.jwt;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * JWT 토큰 생성 및 검증을 위한 유틸리티 클래스
 * JJWT 0.11.5 버전과 Java 21 기능을 사용
 */
@Component
public class JwtTokenUtil {
    // JWT 토큰 생성에 사용될 비밀키 바이트 배열
    private final byte[] secretKeyBytes;
    
    // 토큰 유효 시간 설정
    private final long accessTokenValidityInMilliseconds = 1000 * 60 * 1;    // Access Token: 15분
    private final long refreshTokenValidityInMilliseconds = 1000 * 60 * 60 * 24 * 14; // Refresh Token: 2주

    /**
     * 토큰 정보를 담는 내부 클래스
     */
    public record TokenInfo(
        String grantType,    // Bearer
        String accessToken,
        String refreshToken
    ) {}

    /**
     * 생성자: 비밀키 설정
     */
    public JwtTokenUtil(String secretKey) {
        this.secretKeyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Access Token과 Refresh Token을 함께 생성
     */
    public TokenInfo generateTokenSet(String memberNo, String memberEmail) {
        // Access Token 생성
        String accessToken = createToken(memberNo, memberEmail, accessTokenValidityInMilliseconds);
        
        // Refresh Token 생성
        String refreshToken = createToken(memberNo, memberEmail, refreshTokenValidityInMilliseconds);

        return new TokenInfo("Bearer", accessToken, refreshToken);
    }

    /**
     * 토큰 생성 메소드
     */
    private String createToken(String memberNo, String memberEmail, long validityInMilliseconds) {
        var now = Instant.now();
        var validity = Date.from(now.plusMillis(validityInMilliseconds));

        var claims = Jwts.claims().setSubject(memberNo);
        claims.put("memberEmail", memberEmail);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(validity)
                .signWith(Keys.hmacShaKeyFor(secretKeyBytes), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Refresh Token으로 새로운 Access Token 발급
     */
    public String regenerateAccessToken(String refreshToken) {
        // Refresh Token 검증
        if (!validateToken(refreshToken)) {
            throw new JwtException("Invalid refresh token");
        }

        // Refresh Token에서 사용자 정보 추출
        String memberNo = getMemberNoFromToken(refreshToken);
        String roles = getRolesFromToken(refreshToken);

        // 새로운 Access Token 발급
        return createToken(memberNo, roles, accessTokenValidityInMilliseconds);
    }

    /**
     * 토큰에서 권한 정보 추출
     */
    public String getRolesFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKeyBytes))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("roles", String.class);
    }

    /**
     * 토큰에서 사용자 번호 추출
     */
    public String getMemberNoFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKeyBytes))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    
    /**
     * 토큰에서 이메일 정보 추출
     */
    public String getMemberEmailFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(secretKeyBytes))
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("memberEmail", String.class);  // createToken에서 설정한 claim 키와 동일하게
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKeyBytes))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            return !claims.getExpiration().before(Date.from(Instant.now()));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

	public long getRefreshTokenValidityInMilliseconds() {
		return refreshTokenValidityInMilliseconds;
	}
	
	public long getAccessTokenValidityInMilliseconds() {
		return accessTokenValidityInMilliseconds;
	}
    
}