package edu.kh.project.myPage.model.dto;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import edu.kh.project.payment.model.dto.Booking;
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
public class ticketInfoDTO {
	private Timestamp bookingDate; // 예매일
	private Timestamp paidAt; // 결제일시
	private String bookingId; // 예약번호
	private String performanceName; // 공연명
	private String showDateTime; // 공연일시
	private int ticketCount; // 좌석 수
	private String seatInfo; // 좌석 정보
	private Timestamp cancelableUntil; // 취소 가능일
	private String bookingStatus; // 예매 상태
	private int totalPaid; // 총 결제 금액
}
