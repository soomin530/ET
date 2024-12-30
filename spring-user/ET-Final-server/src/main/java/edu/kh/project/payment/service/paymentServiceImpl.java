package edu.kh.project.payment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.payment.model.dto.Booking;
import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.model.dto.Seat;
import edu.kh.project.payment.model.mapper.paymentMapper;
import edu.kh.project.performance.model.dto.Performance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
public class paymentServiceImpl implements paymentService {

	private final paymentMapper mapper;

	@Value("${iamport.api.key}")
	private String apiKey;

	@Value("${iamport.api.secret}")
	private String apiSecret;

	// 좌석 상태 업데이트 (예약)
	public boolean reserveSeat(String seatId) {
		int result = mapper.updateSeatStatus(seatId, "BOOKED");
		return result > 0; // 업데이트 성공 여부 반환
	}

	// 좌석 가격 조회 (등급 기준)
	public int getSeatPrice(String gradeId) {
		return mapper.selectSeatPrice(gradeId);
	}

	// 결제 내역 저장
	@Override
	public boolean savePayment(Payment paymentData) {
		return mapper.insertPayment(paymentData) > 0;
	}

	// 공연 상세 정보 조회
	@Override
	public Performance getPerformanceDetail(String performanceId) {
		return mapper.getPerformanceDetail(performanceId);
	}

	// 예약 정보 저장
	@Override
	public boolean saveBooking(Booking bookingData) {
		int result = mapper.insertBooking(bookingData);
		return result > 0;
	}

	// 특정 공연 좌석 정보 조회
	@Override
	public List<Seat> getSeatsByPerformance(String mt20id, String selectedDate, String selectedTime, String dayOfWeek) {
		Map<String, Object> params = new HashMap<>();
		params.put("mt20id", mt20id);
		params.put("selectedDate", selectedDate);
		params.put("selectedTime", selectedTime);
		params.put("dayOfWeek", dayOfWeek); // 요일 추가

		return mapper.selectSeatsByShow(params);
	}


}
