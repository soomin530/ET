package edu.kh.project.payment.model.dto;

import java.sql.Timestamp;

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
public class Booking {
    private String bookingId; // 예약 ID
    private Timestamp bookingDate; // 예약 날짜
    private int totalPrice; // 총 결제 금액
    private int memberNo; // 회원 번호 (외래키)
    private String mt20id; // 공연 ID (외래키)
    private String mt10id; // 공연시설 ID 
    private String merchantUid; // 주문 번호
    private String bookingStatus; // 예약 상태 (예: COMPLETE)
} 
