package edu.kh.project.performance.model.dto;

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
public class Performance {
	
	private String genrenm;		// 공연장르
	private String mt20id;		// 공연아이디
	private String prfnm; 		// 공연이름
	private String prfpdfrom; 	// 공연시작날짜
	private String prfpdto; 	// 공연종료날짜
	private String fclitynm; 	// 공연장소

}
