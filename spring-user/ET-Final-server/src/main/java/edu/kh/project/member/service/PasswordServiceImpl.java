package edu.kh.project.member.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.common.jwt.JwtTokenUtil.TokenInfo;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PasswordServiceImpl implements PasswordService {

private final JwtTokenUtil jwtTokenUtil;
    
    /**
     * 비밀번호 재설정 토큰 생성
     */
    public TokenInfo generatePasswordResetToken(int memberNo, String email) { // memberNo를 int로 변경
    	String no = String.valueOf(memberNo);
        JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(no, email);
        return tokenInfo;
    }

    /**
     * 토큰 검증 및 정보 추출
     */
    public Map<String, Object> validatePasswordResetToken(String token) {
        try {
            if (!jwtTokenUtil.validateToken(token)) {
                return null;
            }
            
            String memberNo = jwtTokenUtil.getMemberNoFromToken(token);
            String memberEmail = jwtTokenUtil.getMemberEmailFromToken(token);
            
            Map<String, Object> result = new HashMap<>();
            
            result.put("memberNo", memberNo);
            result.put("memberEmail", memberEmail);
            
            return result;
            
            
        } catch (Exception e) {
            return null;
        }
    }

}
