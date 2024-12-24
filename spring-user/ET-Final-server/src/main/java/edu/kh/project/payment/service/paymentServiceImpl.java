package edu.kh.project.payment.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.payment.model.dto.Payment;
import edu.kh.project.payment.model.dto.PerformanceDetail;
import edu.kh.project.payment.model.dto.Seat;
import edu.kh.project.payment.model.mapper.paymentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
public class paymentServiceImpl implements paymentService{

	private final paymentMapper mapper;
	
	@Value("${iamport.api.key}")
	private String apiKey;

	@Value("${iamport.api.secret}")
	private String apiSecret;

	@Override
	public List<Seat> getSeats(String showDate, String showTime) {
		
		// 파라미터 null 체크
        if (showDate == null || showTime == null) {
            throw new IllegalArgumentException("showDate와 showTime은 null일 수 없습니다.");
        }
        
		return mapper.selectSeatsByShow(showDate,showTime);
	}
	
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
	public PerformanceDetail getPerformanceDetail(String performanceId) {
	    Map<String, Object> resultMap = mapper.getPerformanceDetail(performanceId);
	    if (resultMap == null || resultMap.isEmpty()) {
	        throw new RuntimeException("공연 상세 정보를 찾을 수 없습니다.");
	    }

	    PerformanceDetail dto = new PerformanceDetail();
	    dto.setPerformanceName((String) resultMap.get("performanceName"));
	    dto.setPerformanceFrom((String) resultMap.get("performanceFrom"));
	    dto.setPerformanceTo((String) resultMap.get("performanceTo"));
	    dto.setFacilityName((String) resultMap.get("facilityName"));
	    dto.setPerformanceRuntime(resultMap.get("performanceRuntime") != null 
	        ? ((Number) resultMap.get("performanceRuntime")).intValue() 
	        : 0);
	    dto.setPoster((String) resultMap.get("poster"));

	    return dto;
	}

	
	

  
}
