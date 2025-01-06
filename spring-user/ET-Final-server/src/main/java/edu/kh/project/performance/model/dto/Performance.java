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
public class Performance {
	
	private String mt20id;				// 공연아이디
	private String prfnm; 				// 공연이름
	private String prfpdfrom; 			// 공연시작날짜
	private String prfpdto; 			// 공연종료날짜
	private String fcltynm;  			// 공연장소
	private String prfcast;				// 출연진
	private String prfruntime;			// 공연시간
	private String entrpsnm;			// 공연기획사
	private String pcseguidance;		// 공연가격
	private String poster;				// 공연포스터
	private String dtguidance;			// 공연기간
	private String area;				// 공연지역
	private String genrenm;				// 공연장르
	private String prfstate;			// 공연상태
	private String mt10id;				// 공연시설
	private String description;			// 공연설명
	private String fcltla;				// 위도
	private String fcltlo;				// 경도
	private int concertManagerNo;		// 공연 등록 관리자 번호
	private int prfreviewRank;			// 공연 리뷰 점수
	private Boolean performance_del_fl;	// 공연 삭제 여부(N/Y)
	
	private String adres;				// 공연장 위치
	
	
	private Map<String, List<ScheduleInfo>> schedule; // 스케줄 정보 추가
	
	// 공연 등록을 위한 추가 정보
    private List<PriceInfo> prices; // 가격 정보

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceInfo {
        private String grade;      // 좌석 등급
        private int price;         // 가격
    }

    // 공연 등록 시 요일별 시간 정보를 위한 필드
    private List<DaySchedule> daySchedules;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DaySchedule {
        private List<String> days;     // 요일 목록
        private List<String> times;    // 시간 목록
    }

}
