package edu.kh.project.payment.controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.client.RestTemplate;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.payment.model.dto.Booking;
import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.model.dto.Seat;
import edu.kh.project.payment.service.paymentService;
import edu.kh.project.performance.model.dto.Performance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("payment")
@SessionAttributes({ "loginMember" }) // 로그인된 멤버 유지
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
	public String seatSelection(@RequestParam("mt20id") String mt20id,
			@RequestParam("selectedDate") String selectedDate, @RequestParam("selectedTime") String selectedTime,
			Model model) {

		log.info("좌석 조회 요청: mt20id={}, selectedDate={}, selectedTime={}", mt20id, selectedDate, selectedTime);

		try {
			List<Seat> seats = service.getSeatsByPerformance(mt20id, selectedDate, selectedTime);

			if (seats.isEmpty()) {
				log.warn("좌석 데이터가 없습니다: 공연 ID={}, 날짜={}, 시간={}", mt20id, selectedDate, selectedTime);

			}


		} catch (Exception e) {
			e.printStackTrace();
			
		}

		return "payment/seat-selection";
	}

	/**
	 * 주문자 확인
	 * 
	 * @return
	 */
	@GetMapping("booking-info")
	public String bookingInfo(@SessionAttribute("loginMember") Member loginMember, Model model) {

		String phone = loginMember.getMemberTel();

		// 전화번호를 010-0000-0000 형식으로 포맷팅
		if (phone != null && phone.length() == 11) {
			phone = phone.replaceFirst("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
		}

		model.addAttribute("nickname", loginMember.getMemberNickname());
		model.addAttribute("phone", loginMember.getMemberTel());
		model.addAttribute("email", loginMember.getMemberEmail());

		return "payment/booking-info";
	}

	/**
	 * 결제 창
	 * 
	 * @return
	 */
	@GetMapping("payment")
	public String payment(@SessionAttribute("loginMember") Member loginMember) {
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
	public ResponseEntity<List<Seat>> getSeats(
			@RequestParam("mt20id") String mt20id,
			@RequestParam("selectedDate") String selectedDate,
			@RequestParam("selectedTime") String selectedTime,
			Model model) {

		if (mt20id == null || selectedDate == null || selectedTime == null) {
			log.error("필수 파라미터가 누락되었습니다: mt20id={}, selectedDate={}, selectedTime={}", mt20id, selectedDate,
					selectedTime);
			return ResponseEntity.badRequest().build(); // 400 Bad Request 반환
		}

		try {
			List<Seat> seats = service.getSeatsByPerformance(mt20id, selectedDate, selectedTime);

			if (seats.isEmpty()) {
				log.warn("좌석 데이터가 없습니다: 공연 ID={}, 날짜={}, 시간={}", mt20id, selectedDate, selectedTime);
				return ResponseEntity.noContent().build();
			}

			return ResponseEntity.ok(seats);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * 공연 상세 정보 조회
	 * 
	 * @param performanceId
	 * @return
	 */
	@GetMapping("performance-detail")
	public ResponseEntity<Performance> getPerformanceDetail(@RequestParam("performanceId") String performanceId) {

		if (performanceId == null || performanceId.trim().isEmpty()) {
			log.warn("performanceId가 제공되지 않았습니다.");
			return ResponseEntity.badRequest().body(null);
		}

		try {
			Performance detail = service.getPerformanceDetail(performanceId);
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
	public ResponseEntity<String> savePayment(@RequestBody Payment paymentData,
			@SessionAttribute("loginMember") Member loginMember) {

		try {
			System.out.println("전송받은 결제 데이터: " + paymentData);
			System.out.println("공연 ID (mt20id): " + paymentData.getMt20id());
			System.out.println("공연 시설 ID (mt10id): " + paymentData.getMt10id());

			// 1. TB_PAYMENT에 데이터 삽입
			boolean success = service.savePayment(paymentData);
			if (!success) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 저장 실패");
			}

			// 2. 예약 정보 생성
			Booking bookingData = Booking.builder()
					.bookingId(paymentData.getMerchantUid()) // 결제와 동일한 주문번호 사용
					.bookingDate(new Timestamp(System.currentTimeMillis())) // 현재 시간
					.totalPrice(paymentData.getPaidAmount())
					.memberNo(loginMember.getMemberNo()) // 로그인된 회원 번호
					.mt20id(paymentData.getMt20id()) // 공연 ID 추가
					.mt10id(paymentData.getMt10id()) // 공연 시설 ID 추가
					.merchantUid(paymentData.getMerchantUid())
					.bookingStatus("COMPLETE") // 기본 예약 상태
					.build();

			// 3. TB_TICKET_BOOKING에 데이터 삽입
			boolean bookingSaved = service.saveBooking(bookingData);
			if (!bookingSaved) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예약 정보 저장 실패");
			}

			// 4 .여러 좌석 업데이트
			for (String seatId : paymentData.getSeatIds()) {
				boolean seatReserved = service.reserveSeat(seatId);
				if (!seatReserved) {
					log.warn("좌석 상태 업데이트 실패: {}", seatId);
				}
			}
			return ResponseEntity.ok("결제가 성공적으로 저장되었고 좌석 상태가 업데이트되었습니다.");

		} catch (Exception e) {
			log.error("결제 처리 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 처리 중 오류가 발생했습니다.");
		}
	}

}
