package edu.kh.project.redis.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenRequest {

	private String refreshToken;
    private String memberEmail;
}
