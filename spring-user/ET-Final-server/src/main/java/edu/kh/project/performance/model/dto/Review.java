package edu.kh.project.performance.model.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Review {
	
	private int reviewNo;			
	private String reviewContent; 	// 공연리뷰내용
	private String reviewStar; 		// 공연리뷰점수
	private String createDate; 		// 공연리뷰등록일자
	private String modifyDate;  	// 공연리뷰수정일자
	private String reviewDelFl;		// 공연리뷰삭제여부
	private int memberNo;			// 회원번호
	private String mt20id;			// 공연아이디
	private String memberNickname;	// 회원닉네임

}
