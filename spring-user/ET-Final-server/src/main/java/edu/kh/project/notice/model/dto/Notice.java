package edu.kh.project.notice.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Notice {

	private int announceNo;						// 공지사항 번호
	private String announceTitle;				// 공지사항 제목
	private String announceContent;				// 공지사항 내용
	private String announceWriteDate;			// 공지사항 작성일
	private String announceDelFl;				// 공지사항 삭제여부
	
}
