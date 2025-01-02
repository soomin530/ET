package edu.kh.project.member.service;

import java.util.Map;

import edu.kh.project.common.jwt.JwtTokenUtil.TokenInfo;

public interface PasswordService {

	/** 비밀번호 재설정 토큰 생성
	 * @param memberNo
	 * @param email
	 * @return
	 */
	TokenInfo generatePasswordResetToken(int memberNo, String email);
	
	
	/** 토큰 검증 및 정보 추출
	 * @param token
	 * @return
	 */
	Map<String, Object> validatePasswordResetToken(String token);
}
