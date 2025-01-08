package edu.kh.admin.main.model.dto;

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
public class Performance {
    private String MT10ID;          // 공연장 ID
    private String FCLTYNM;         // 공연장 명
    private String MT13CNT;         // 공연장 시설 수
    private String FCLTYCHARTR;     // 시설 특성
    private String OPENDE;          // 개관일
    private String SEATSCALE;       // 객석 수
    private String TELNO;           // 전화번호
    private String RELATEURL;       // 홈페이지 URL
    private String ADRES;           // 주소
    private String FCLTLA;          // 위도
    private String FCLTLO;          // 경도
}
