package edu.kh.project.payment.controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.client.RestTemplate;

import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.model.dto.PerformanceDetail;
import edu.kh.project.payment.model.dto.Seat;
import edu.kh.project.payment.service.paymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("payment")
@SessionAttributes({"loginMember"}) // 로그인된 멤버 유지
@RequiredArgsConstructor
@Slf4j
public class paymentController {

	private final paymentService service;

	@Value("${iamport.api.key}")
	private String apiKey;

	@Value("${iamport.api.secret}")
	private String apiSecret;

	@PostMapping("validate")
	public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> request) {
		String impUid = request.get("imp_uid");

		// 포트원 인증 토큰 발급
		RestTemplate restTemplate = new RestTemplate();
		Map<String, String> tokenRequest = new HashMap<>();
		tokenRequest.put("imp_key", apiKey);
		tokenRequest.put("imp_secret", apiSecret);

		ResponseEntity<Map> tokenResponse = restTemplate.postForEntity("https://api.iamport.kr/users/getToken",
				tokenRequest, Map.class);

		String accessToken = (String) ((Map) tokenResponse.getBody().get("response")).get("access_token");

		// 결제 정보 검증
		ResponseEntity<Map> paymentResponse = restTemplate
				.getForEntity("https://api.iamport.kr/payments/" + impUid + "?_token=" + accessToken, Map.class);

		Map<String, Object> response = new HashMap<>();
		response.put("success", paymentResponse.getStatusCode().is2xxSuccessful());
		return ResponseEntity.ok(response);
	}

	/**
	 * @return
	 */
	@GetMapping("seatPage")
	public String seatPage() {
		return "payment/seatPage"; // seatPage.html 파일을 렌더링
	}

	/**
	 * 좌석 선택
	 * 
	 * @return
	 */
	@GetMapping("seat-selection")
	public String seatSelection() {

		return "payment/seat-selection";
	}

	/**
	 * 주문자 확인
	 * 
	 * @return
	 */
	@GetMapping("booking-info")
	public String bookingInfo() {
		return "payment/booking-info";
	}

	/**
	 * 결제 창
	 * 
	 * @return
	 */
	@GetMapping("payment")
	public String payment() {
		return "payment/payment";
	}

	/**
	 * 좌석 정보 제공
	 * 
	 * @param showDate
	 * @param showTime
	 * @return
	 */
	@GetMapping("seats")
	public ResponseEntity<List<Seat>> getSeats(@RequestParam(name = "showDate") String showDate,
			@RequestParam(name = "showTime") String showTime) {
		try {
			List<Seat> seats = service.getSeats(showDate, showTime);
			return ResponseEntity.ok(seats);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}
	
	/** 공연 상세 정보 조회
	 * @param performanceId
	 * @return
	 */
	@GetMapping("performance-detail")
	public ResponseEntity<PerformanceDetail> getPerformanceDetail(@RequestParam("performanceId") String performanceId){
		
		if (performanceId == null || performanceId.trim().isEmpty()) {
	        log.warn("performanceId가 제공되지 않았습니다.");
	        return ResponseEntity.badRequest().body(null);
	    }
		
		try {
	        PerformanceDetail detail = service.getPerformanceDetail(performanceId);
	        return ResponseEntity.ok(detail);
	        
	    } catch (RuntimeException e) {
	        log.error("공연 상세 정보 조회 실패: {}", e.getMessage());
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	        
	    } catch (Exception e) {
	        log.error("서버 오류 발생", e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    }
	}
	

	/**
	 * 좌석 예약
	 * 
	 * @param request
	 * @return
	 */
	@PostMapping("book-seat")
	public ResponseEntity<String> reserveSeat(@RequestBody Map<String, String> request) {
		String seatId = request.get("seatId");
		boolean success = paymentService.bookSeat(seatId);

		if (success) {
			return ResponseEntity.ok("좌석이 성공적으로 예약되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("좌석 예약에 실패했습니다.");
		}
	}

	/**
	 * 결제 내역 저장
	 * 
	 * @param paymentData
	 * @return
	 */
	@PostMapping("save-payment")
	public ResponseEntity<String> savePayment(@RequestBody Payment paymentData) {

		// 전달된 데이터를 로그로 출력
		log.info("수신된 결제 데이터: {}", paymentData);

		try {
			boolean success = service.savePayment(paymentData);

			if (success) {
	            // 여러 좌석 업데이트
	            for (String seatId : paymentData.getSeatIds()) {
	                boolean seatReserved = service.reserveSeat(seatId);
	                if (!seatReserved) {
	                    log.warn("좌석 상태 업데이트 실패: {}", seatId);
	                }
	            }
	            return ResponseEntity.ok("결제가 성공적으로 저장되었고 좌석 상태가 업데이트되었습니다.");
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 저장에 실패했습니다.");
	        }
	    } catch (Exception e) {
	        log.error("결제 처리 중 오류 발생", e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 처리 중 오류가 발생했습니다.");
	    }
	}

}
