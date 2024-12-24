package edu.kh.project.payment.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.model.dto.Seat;

@Mapper
public interface paymentMapper {

	// 특정 공연 좌석 조회
	List<Seat> selectSeatsByShow(@Param("showDate") String showDate, @Param("showTime") String showTime);

	// 좌석 상태 업데이트(예약)
	int updateSeatStatus(@Param("seatId") String seatId, @Param("status") String status);


	// 좌석 가격 조회 (등급 기준)
	int selectSeatPrice(String gradeId);

	// 결제 정보 저장
	int insertPayment(Payment paymentData);

	// 공연 상세 정보 조회
	Map<String, Object> getPerformanceDetail(@Param("performanceId") String performanceId);
	
}
