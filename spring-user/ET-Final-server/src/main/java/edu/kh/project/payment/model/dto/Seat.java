package edu.kh.project.payment.model.dto;

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
public class Seat {
    private String mt20id;
    private int dayOfWeek;
    private String performanceTime;
    
	private String seatId; // 좌석 ID
	private String gradeId; // 좌석 등급 ID
	private String gradeName; // 좌석 등급 이름 (VIP, R, S 등)
	private int price; // 좌석 가격
	private String status; // 좌석 상태 (AVAILABLE, RESERVED, BOOKED 등)
	private String showDate; // 공연 날짜
	private String showTime; // 공연 시간
	
	private int totalSeatCount;  // 총 좌석 수 (추가)
	private int availableSeatCount;  // 총 좌석 수 (추가)
}