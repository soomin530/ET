package edu.kh.project.performance.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PerformanceRegistrationDTO {
    private String prfnm;          			// 공연명
    private String runtime;        			// 런타임
    private String fcltynm;					// 공연 시설명
    private String prfcast;        			// 출연진
    private String genrenm;        			// 장르
    private String prfpdfrom;      			// 시작일
    private String prfpdto;        			// 종료일
    private List<ScheduleDTO> schedules;  	// 공연 시간
    private List<PriceDTO> prices;        	// 가격 정보
    private String description;    			// 공연 설명
    private int concertManagerNo;			// 공연 등록자
    private String entrpsnm;				// 공연 제작사
    private String area;					// 공연 지역
    private String mt10id;					// 공연장 id
    
    // 포스터 관련 필드 추가
    private String posterBase64;    // 포스터 이미지 Base64
    private String posterFileName;  // 원본 파일명

    @Getter
    @Setter
    public static class ScheduleDTO {
        private List<String> days;     		// 요일 목록
        private List<String> times;    		// 시간 목록
    }

    @Getter
    @Setter
    public static class PriceDTO {
        private String grade;      			// 좌석 등급
        private String gradeName;			// 좌석 이름
        private int price;         			// 가격
    }
}