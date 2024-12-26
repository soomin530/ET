package edu.kh.project.payment.model.dto;

import java.sql.Timestamp;
import java.util.List;

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
public class Payment {
	private String payNo; // 결제 번호
	private String impUid; // 아임포트 고유 ID
	private String merchantUid; // 주문번호
	private String payMethod; // 결제 방식
	private String pgProvider; // PG사
	private String pgType; // PG 타입
	private String pgTid; // PG_tid
	private String name; // 결제 이름
	private int paidAmount; // 결제 금액
	private String currency; // 결제 통화
	private String buyerName; // 구매자 이름
	private String buyerTel; // 구매자 연락처
	private String buyerAddr; // 기본값 설정
	private String buyerPostcode; // 기본값 설정
	private String buyerEmail; // 기본값 설정
	private String status; // 결제 상태
	private Timestamp paidAt; // Null 방지 기본값 설정 // 결제 시간
	private String receiptUrl; // 영수증 URL
	
    // 추가된 필드
	private String seatId; // 단일 좌석 ID
	private List<String> seatIds; // 여러 좌석 ID
	private String mt20id; // 공연 ID (추가)
	private int memberNo; // 로그인된 회원 번호 (추가)

}
