package edu.kh.project.myPage.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberWish {

	private int wishNo;				// 찜 번호
	private int memberNo;			// 회원 번호
	private String mt20id;			// 공연 번호
	private String wishDate;		// 찜한 날짜
	
}
