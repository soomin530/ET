package edu.kh.project.performance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.PerformanceRanking;
import edu.kh.project.performance.model.dto.Review;
import edu.kh.project.performance.model.dto.ScheduleInfo;
import edu.kh.project.performance.model.mapper.PerformanceMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements PerformanceService {

	private final PerformanceMapper mapper;

	// 장르별 공연 목록 조회 (기존)
    @Override
    public List<Performance> getPerformancesByGenre(String genre) {
        return mapper.genre(genre);
    }

    // 장르별 공연 목록 조회 무한 스크롤
    @Override
    public List<Performance> getPerformancesByPage(int page, int pageSize, String genre) {
        // 시작 위치 계산
        int offset = (page - 1) * pageSize;
        return mapper.genreWithPaging(genre, pageSize, offset);
    }

	
	// 공연 상세페이지 조회
	@Override
	public Performance getPerformanceById(String mt20id) {

	    Performance performance = mapper.detail(mt20id);

	    // 지도 API 정보
	    Performance mapInfo = mapper.selectPerformanceById(mt20id);

	    // 데이터 병합
	    if (mapInfo != null) {
	        performance.setFcltla(mapInfo.getFcltla()); // 위도
	        performance.setFcltlo(mapInfo.getFcltlo()); // 경도
	    }

	    return performance;
	}

	
	// 스케줄 및 잔여 좌석 조회
	@Override
	 public Map<String, List<ScheduleInfo>> getScheduleWithAvailableSeats(String mt20id) {
        List<Map<String, Object>> scheduleData = mapper.getScheduleData(mt20id);
        
        Map<String, List<ScheduleInfo>> scheduleMap = new LinkedHashMap<>();
        
        for (Map<String, Object> data : scheduleData) {
            /// BigDecimal을 int로 변환
            int dayOfWeekNum = ((BigDecimal) data.get("DAY_OF_WEEK")).intValue();
            String dayOfWeek = getDayOfWeek(dayOfWeekNum);
            
            if (dayOfWeek != null) {
                ScheduleInfo info = new ScheduleInfo();
                info.setTime((String) data.get("TIME"));
                info.setSeats(((BigDecimal) data.get("SEATS")).intValue());
                info.setSeatStatus((String) data.get("STATUS"));
                
                scheduleMap.computeIfAbsent(dayOfWeek, k -> new ArrayList<>())
                          .add(info);
            }
        }
        
        return scheduleMap;
    }
    
	
    // 요일 값 받아서 출력
    private String getDayOfWeek(Integer dayNum) {
        switch (dayNum) {
            case 1: return "월요일";
            case 2: return "화요일";
            case 3: return "수요일";
            case 4: return "목요일";
            case 5: return "금요일";
            case 6: return "토요일";
            case 7: return "일요일";
            default: return null;
        }
    }
    
    
    // 메인 페이지 주요 공연 소개
	@Override
	public List<Performance> mainPerform() {
		return mapper.mainPerform();
	}


	// 상위 10개 공연 가져오기
	@Override
	public List<PerformanceRanking> performanceRanking() {
		return mapper.performanceRanking();
	}


	// 리뷰 등록
	@Override
	public boolean insertReview(Review review) {
		int result = mapper.insertReview(review);
		return result > 0;
	}

	// 리뷰 중복 여부 확인
	@Override
	public boolean hasReviewForPerformance(int memberNo, String mt20id) {
		
		Map<String, Object> params = new HashMap<>();
		
	    params.put("memberNo", memberNo); 
	    params.put("mt20id", mt20id);     
		    
		int reviewCount = mapper.selectReviewCount(params);
		
		return reviewCount > 0;
	}
	
	// 리뷰 수정
	@Override
	public boolean updateReview(Review review) {
		int result = mapper.updateReview(review);
		return result > 0; // 업데이트 성공 여부 반환
	}

	// 리뷰 삭제
	@Override
	public boolean deleteReview(Map<String, Object> paramMap) {
		int result = mapper.deleteReview(paramMap);
		return result > 0;
	}


	// 리뷰 목록 조회 
	@Override
	public List<Review> getReviewsByPerformanceId(String mt20id) {
	    
	    return mapper.selectReviewsByPerformanceId(mt20id);
	}

	// 관리자 공연 등록 -> 공연장 이름 또는 주소 검색시 공연장 목록 가져오기
	@Override
	public List<Map<String, Object>> getVenueList() {
		return mapper.selectVenueList();
	}

}

