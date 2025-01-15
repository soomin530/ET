package edu.kh.project.statistics.model.dto;

import java.time.LocalDate;

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
public class Statistics {

	private int statNo;						// 통계 키번호
    private String statCategory;			// 통계 카테고리
    private int statPrfcnt;					// 카테고리별 공연수
    private int statPrfdtcnt;				// 카테고리별 상연횟수
    private Long statNtssnmrssm;			// 카테고리별 예매수
    private Long statCancelnmrssm;			// 카테고리별 취소수
    private Long statNtssamountsm;			// 카테고리별 총 티켓판매액
    private String categoryCode;			// 카테고리 코드
    private LocalDate statStartDate;  		// 통계 시작일
    private LocalDate statEndDate;    		// 통계 종료일
	
}
