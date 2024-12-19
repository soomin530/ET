package edu.kh.project.payment.controller;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.service.paymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("payment")
@RequiredArgsConstructor
@Slf4j
public class paymentController {

	
	private final paymentService PaymentService;
	
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
	
	
}
