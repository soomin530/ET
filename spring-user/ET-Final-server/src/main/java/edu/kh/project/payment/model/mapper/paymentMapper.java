package edu.kh.project.payment.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.payment.model.dto.Booking;
import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.model.dto.Seat;
import edu.kh.project.performance.model.dto.Performance;

@Mapper
public interface paymentMapper {

	// 좌석 가격 조회 (등급 기준)
	int selectSeatPrice(String gradeId);

	// 결제 내역 저장
	int insertPayment(Payment paymentData);

	// 공연 정보 조회
	Performance getPerformanceDetail(String performanceId);

	// 예약 내역 저장
	int insertBooking(Booking bookingData);

	// 특정 공연 좌석 조회
	List<Seat> selectSeatsByShow(Map<String, Object> params);

	// 좌석 데이터 삽입
	int insertTicketSeat(Seat seatData);

	// 이미 예약된 좌석 조회
	List<Seat> selectBookedSeats(Map<String, Object> params);

	// 예매 내역 데이터 삽입 (TB_BOOKING_HISTORY)
	int insertBookingHistory(Map<String, Object> params);

	

}
