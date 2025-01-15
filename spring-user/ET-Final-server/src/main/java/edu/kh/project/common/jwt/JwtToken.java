package edu.kh.project.common.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class JwtToken {
	private String grantType;
    private String accessToken;
    private String refreshToken;
    
    //    grantType: JWT의 인증 타입을 나타내는 문자열 필드입니다.
    //    accessToken: 접근 토큰을 나타내는 문자열 필드입니다.
    //    refreshToken: 갱신 토큰을 나타내는 문자열 필드입니다.
}
