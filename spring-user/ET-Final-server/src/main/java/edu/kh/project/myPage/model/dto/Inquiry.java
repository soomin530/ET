package edu.kh.project.myPage.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

	private int inquiryNo;					// 문의사항 번호
	private String inquiryTitle;			// 문의사항 제목
	private String inquiryContent;			// 문의사항 내용
	private String inquiryDate;				// 문의사항 작성일
	private String inquiryDelFl;			// 삭제 여부
	private int memberNo;					// 회원 번호
	private String replyIs;					// 답글 여부
	private String replyContent;			// 답글 내용
	
}
