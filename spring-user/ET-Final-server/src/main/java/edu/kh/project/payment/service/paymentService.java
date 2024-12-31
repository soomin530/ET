package edu.kh.project.payment.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.payment.model.dto.Booking;
import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.model.dto.Seat;
import edu.kh.project.performance.model.dto.Performance;

public interface paymentService {

	

	// 좌석 상태 업데이트(예약)
	static boolean bookSeat(String seatId) {	
		return false;
	}

	// 결제 내역 저장
	boolean savePayment(Payment paymentData);

	// 좌석 예약
	//boolean insertTicketSeat(Map<String, Object> seatData);
	
	// 상세정보 조회
	Performance getPerformanceDetail(String performanceId);

	// 예약 정보 저장
	boolean saveBooking(Booking bookingData);

	// 특정 공연 좌석 정보 조회
	List<Seat> getSeatsByPerformance(String mt20id, String selectedDate, String selectedTime, String dayOfWeek);

	
	// 좌석 예약
	boolean insertTicketSeat(Seat seatData);

	// 좌석 예약
	//boolean insertTicketSeat(Seat seatData);



	

	
	

}
