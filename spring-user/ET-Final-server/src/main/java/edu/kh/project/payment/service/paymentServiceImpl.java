
package edu.kh.project.payment.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import edu.kh.project.member.model.dto.Member;
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

	// 좌석 상태 변경(BOOKED) TB_TICKET_SEAT에 데이터 삽입
	@Override
	public boolean insertTicketSeat(Seat seatData) {
		int result = mapper.insertTicketSeat(seatData);
		return result > 0;
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

	// 이미 예약된 좌석 조회
	@Override
	public List<Seat> getBookedSeats(String mt20id, String selectedDate, String selectedTime) {
		Map<String, Object> params = new HashMap<>();
		params.put("mt20id", mt20id);
		params.put("selectedDate", selectedDate);
		params.put("selectedTime", selectedTime);

		return mapper.selectBookedSeats(params);
	}

	// 예매 내역 데이터 삽입 (TB_BOOKING_HISTORY)
	@Override
	public boolean saveBookingHistory(Payment paymentData, Member loginMember) {
		Performance performanceDetail = mapper.getPerformanceDetail(paymentData.getMt20id());

		if (performanceDetail == null) {
			log.error("공연 정보를 가져오지 못했습니다. 공연 ID: {}", paymentData.getMt20id());
			return false;
		}

		// SimpleDateFormat 선언 및 초기화
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd"); // 추가된 부분

		try {
			// 날짜 문자열을 `Date`로 변환 후 하루 전 날짜 계산
			String showDateStr = paymentData.getShowDate();
			Date showDate = dateFormat.parse(showDateStr); // 변환
			Calendar cal = Calendar.getInstance();
			cal.setTime(showDate);
			cal.add(Calendar.DATE, -1); // 하루 전 계산

			// `Date`를 다시 문자열로 변환
			Timestamp cancelableUntil = new Timestamp(cal.getTime().getTime());

			String performanceName = performanceDetail.getPrfnm();

			Map<String, Object> params = new HashMap<>();
			params.put("bookingDate", new Timestamp(System.currentTimeMillis()));
			params.put("paidAt", paymentData.getPaidAt());
			params.put("bookingId", paymentData.getMerchantUid());
			params.put("performanceName", performanceName);
			params.put("showDateTime", paymentData.getShowDate() + " " + paymentData.getShowTime());
			params.put("ticketCount", paymentData.getSeatIds().size());
			params.put("cancelableUntil", cancelableUntil);
			params.put("bookingStatus", "예매");
			params.put("memberNo", loginMember.getMemberNo()); // 추가
			params.put("mt20id", paymentData.getMt20id()); // 추가

			int result = mapper.insertBookingHistory(params);
			return result > 0;
		} catch (Exception e) {
			log.error("날짜 변환 중 오류 발생: ", e);
			return false;
		}

	}

	/**
	 * 포트원 API 토큰 발급
	 */
//	@Override
//	public String getIamportAccessToken() {
//	    try {
//	        log.debug("IAMPORT API Key: '{}'", apiKey.trim());
//	        log.debug("IAMPORT API Secret: '{}'", apiSecret.trim());
//
//	        RestTemplate restTemplate = new RestTemplate();
//
//	        // 요청 헤더 설정
//	        HttpHeaders headers = new HttpHeaders();
//	        headers.setContentType(MediaType.APPLICATION_JSON);
//
//	        // 요청 본문 생성
//	        Map<String, String> tokenRequest = new HashMap<>();
//	        tokenRequest.put("imp_key", apiKey.trim());
//	        tokenRequest.put("imp_secret", apiSecret.trim());
//
//	        HttpEntity<Map<String, String>> request = new HttpEntity<>(tokenRequest, headers);
//
//	        log.debug("Token Request Payload: {}", tokenRequest);
//	        log.debug("Request Headers: {}", headers);
//
//	     // 요청에 대한 응답 상태 코드 및 본문 디버깅
//	        ResponseEntity<Map> response = restTemplate.postForEntity(
//	            "https://api.iamport.kr/users/getToken",
//	            request,
//	            Map.class
//	        );
//	        log.debug("응답 상태 코드: {}", response.getStatusCode());
//	        log.debug("응답 데이터: {}", response.getBody());
//
//	        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
//	            Map<String, Object> responseBody = (Map<String, Object>) response.getBody().get("response");
//	            if (responseBody != null) {
//	                return (String) responseBody.get("access_token");
//	            } else {
//	                log.error("응답 데이터에 'response'가 없습니다.");
//	            }
//	        } else {
//	            log.error("Access Token 요청 실패: {}", response.getStatusCode());
//	        }
//	    } catch (HttpClientErrorException e) {
//	        log.error("HTTP 요청 오류 발생: {}", e.getResponseBodyAsString());
//	        throw new RuntimeException("HTTP 요청 오류 발생", e);
//	    } catch (Exception e) {
//	        log.error("아임포트 Access Token 요청 중 예외 발생", e);
//	        throw new RuntimeException("Access Token 요청 중 예외 발생", e);
//	    }
//
//	    throw new RuntimeException("Access Token을 가져오지 못했습니다.");
//	}
//
//
//
//
//	/**
//	 * 결제 검증
//	 */
//	@Override
//	public Payment getVerifiedPayment(String impUid, String accessToken) {
//		RestTemplate restTemplate = new RestTemplate();
//		Map<String, Object> response = restTemplate
//				.getForObject("https://api.iamport.kr/payments/" + impUid + "?_token=" + accessToken, Map.class);
//
//		if (response != null && response.get("response") != null) {
//			Map<String, Object> paymentInfo = (Map<String, Object>) response.get("response");
//
//			Payment payment = new Payment();
//			payment.setImpUid((String) paymentInfo.get("imp_uid"));
//			payment.setPaidAmount((Integer) paymentInfo.get("amount"));
//			payment.setStatus((String) paymentInfo.get("status"));
//
//			return payment;
//		}
//
//		return null;
//	}
//
//	@Transactional(propagation = Propagation.REQUIRES_NEW)
//	@Override
//	public void logPaymentFailure(Payment paymentData, String errorMsg) {
//	    Map<String, Object> logData = new HashMap<>();
//	    logData.put("merchantUid", paymentData.getMerchantUid());
//	    logData.put("pgProvider", paymentData.getPgProvider());
//	    logData.put("pgType", paymentData.getPgType());
//	    logData.put("pgMethod", paymentData.getPayMethod());
//	    logData.put("status", "FAILED");
//	    logData.put("errorMsg", errorMsg);
//
//	    try {
//	        mapper.insertPaymentLog(logData);
//	        log.info("결제 실패 로그 저장 성공: {}", logData);
//	    } catch (Exception e) {
//	        log.error("결제 실패 로그 저장 중 오류 발생: {}", e.getMessage());
//	    }
//	}

}
