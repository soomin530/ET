package edu.kh.project.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Member {

	private int memberNo;
	private String memberId;
	private String memberPw;
	private String memberNickname;
	private String memberTel;
	private String memberAddress;
	private String memberGender;
	private String profileImg;
	private String enrollDate;
	private Boolean memberDelFl;
	private int memberAuth;
	private Boolean memberEmailAlarm;
	private String memberEmail;
	
	// 네이버 로그인 구분 필드 추가
    private String naverFl; // 'Y' 또는 'N'
	
	
}
