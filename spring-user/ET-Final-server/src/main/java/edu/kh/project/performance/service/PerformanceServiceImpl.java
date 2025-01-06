package edu.kh.project.performance.service;

import java.io.File;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.common.util.IdGeneratorUtil;
import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.PerformanceRanking;
import edu.kh.project.performance.model.dto.PerformanceRegistrationDTO;
import edu.kh.project.performance.model.dto.Review;
import edu.kh.project.performance.model.dto.ScheduleInfo;
import edu.kh.project.performance.model.mapper.PerformanceMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceServiceImpl implements PerformanceService {

	private final PerformanceMapper mapper;
	private final IdGeneratorUtil idGeneratorUtil;

	@Value("${my.performance.location}")
	private String performanceLocation; // C:/uploadFiles/performance/
	

	// 장르별 공연 목록 조회 (기존)
	@Override
	public List<Performance> getPerformancesByGenre(String genre) {
		return mapper.genre(genre);
	}

	// 장르별 공연 목록 조회 무한 스크롤
	@Override
	public List<Performance> getPerformancesByPage(int page, int pageSize, String genre, String filter) {
		// 시작 위치 계산
		int offset = (page - 1) * pageSize;
		return mapper.genreWithPaging(genre, pageSize, offset, filter);
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

	// 스케줄 조회
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
				info.setSeatStatus((String) data.get("STATUS"));

				scheduleMap.computeIfAbsent(dayOfWeek, k -> new ArrayList<>()).add(info);
			}
		}

		return scheduleMap;
	}
	
	// 잔여 좌석 조회
	@Override
	public List<ScheduleInfo> remainingSeats(Map<String, Object> paramMap) {
		// 1. 매퍼를 통해 SQL 쿼리 실행
		List<ScheduleInfo> scheduleData = mapper.getRemainingSeats(paramMap);
	    
	    // 5. 결과 반환
	    return scheduleData;
	}

	// 요일 값 받아서 출력
	private String getDayOfWeek(Integer dayNum) {
		switch (dayNum) {
		case 1:
			return "월요일";
		case 2:
			return "화요일";
		case 3:
			return "수요일";
		case 4:
			return "목요일";
		case 5:
			return "금요일";
		case 6:
			return "토요일";
		case 7:
			return "일요일";
		default:
			return null;
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

	// 공연장 좌석 목록
	@Override
	public List<Map<String, Object>> priceSeatInfoList(String mt10id) {
		return mapper.priceSeatInfoList(mt10id);
	}

	// 공연 일정 중복체크
	@Override
	public List<Map<String, Object>> reservedDates(String mt10id) {
		return mapper.getReservedDates(mt10id);
	}

	// 공연 등록
	@Override
	public int registerPerformance(PerformanceRegistrationDTO dto) throws Exception {
		try {
			// 1. MT20ID 생성
			String mt20id = idGeneratorUtil.generateMT20Id();

			// 2. 포스터 이미지 처리
			String poster = null;
			if (dto.getPosterBase64() != null && !dto.getPosterBase64().isEmpty()) {
				poster = saveBase64ToImage(dto.getPosterBase64(), mt20id, dto.getPosterFileName());
			}

			// 2. 기본 공연 정보 저장 (TB_PERFORMANCES_DETAIL)
			Map<String, Object> performanceMap = new HashMap<>();
			performanceMap.put("mt20id", mt20id);
			performanceMap.put("mt10id", dto.getMt10id());
			performanceMap.put("prfnm", dto.getPrfnm());
			performanceMap.put("prfpdfrom", dto.getPrfpdfrom());
			performanceMap.put("prfpdto", dto.getPrfpdto());
			performanceMap.put("fcltynm", dto.getFcltynm());
			performanceMap.put("prfcast", dto.getPrfcast());
			performanceMap.put("prfruntime", dto.getRuntime());
			performanceMap.put("genrenm", dto.getGenrenm());
			performanceMap.put("prfstate", "공연예정");
			performanceMap.put("description", dto.getDescription());
			performanceMap.put("concertManagerNo", dto.getConcertManagerNo());
			performanceMap.put("entrpsnm", dto.getEntrpsnm());
			performanceMap.put("area", dto.getArea());
			performanceMap.put("poster", poster);

			// 가격 정보 문자열 생성
			String pcseguidance = dto.getPrices().stream()
					.map(price -> price.getGradeName() + "석 " + String.format("%,d", price.getPrice()) + "원")
					.collect(Collectors.joining(", "));
			performanceMap.put("pcseguidance", pcseguidance);

			// 공연 시간 문자열 생성
			String dtguidance = createDtguidance(dto.getSchedules());
			performanceMap.put("dtguidance", dtguidance);
			
			int result = mapper.insertPerformance(performanceMap);
			if (result == 0)
				throw new Exception("공연 정보 저장 실패");

			// 3. 좌석별 가격 정보 저장 (TB_PERFORMANCE_SEAT_PRICE)
			for (PerformanceRegistrationDTO.PriceDTO price : dto.getPrices()) {
				Map<String, Object> priceMap = new HashMap<>();
				priceMap.put("mt20id", mt20id);
				priceMap.put("grade", price.getGrade());
				priceMap.put("price", price.getPrice());

				result = mapper.insertPerformancePrice(priceMap);
				if (result == 0)
					throw new Exception("가격 정보 저장 실패");
			}

			// 4. 공연 시간 정보 저장 (TB_PERFORMANCE_TIME)
			for (PerformanceRegistrationDTO.ScheduleDTO schedule : dto.getSchedules()) {
				for (String day : schedule.getDays()) {
					for (String time : schedule.getTimes()) {
						Map<String, Object> timeMap = new HashMap<>();
						timeMap.put("mt20id", mt20id);
						timeMap.put("dayOfWeek", convertDayToNumber(day));
						timeMap.put("performanceTime", time);

						result = mapper.insertPerformanceTime(timeMap);
						if (result == 0)
							throw new Exception("시간 정보 저장 실패");
					}
				}
			}

			return 1;

		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("공연 등록 중 오류 발생: " + e.getMessage());
		}
	}

	// Base64 이미지를 파일로 저장하는 메서드
	private String saveBase64ToImage(String base64Data, String mt20id, String originalFileName) throws Exception {
		try {
			// 파일 확장자 추출
			String ext = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();

			// 저장할 파일명 생성 (mt20id + 확장자)
			String fileName = mt20id + ext;

			// 저장 경로 생성
			File directory = new File(performanceLocation);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			// Base64 디코딩
			byte[] imageBytes = Base64.getDecoder().decode(base64Data);

			// 파일 저장
			Path filePath = Paths.get(performanceLocation + fileName);
			Files.write(filePath, imageBytes);

			// DB에 저장할 이미지 경로 생성 
	        String imagePath = "/images/performance/" + fileName; // 웹 접근 경로로 변환
	        return imagePath; // 웹 경로 반환

		} catch (Exception e) {
			throw new Exception("이미지 저장 실패: " + e.getMessage());
		}
	}

	private int convertDayToNumber(String day) {
		return switch (day) {
		case "1" -> 1;
		case "2" -> 2;
		case "3" -> 3;
		case "4" -> 4;
		case "5" -> 5;
		case "6" -> 6;
		case "7" -> 7;
		default -> throw new IllegalArgumentException("Invalid day: " + day);
		};
	}

	private String createDtguidance(List<PerformanceRegistrationDTO.ScheduleDTO> schedules) {
		return schedules.stream().map(schedule -> {
			String days = schedule.getDays().stream().map(this::getDayOfWeek).collect(Collectors.joining(" ~ "));
			String times = String.join(",", schedule.getTimes());
			return days + "(" + times + ")";
		}).collect(Collectors.joining(", "));
	}

	private String getDayOfWeek(String dayNum) {
		return switch (dayNum) {
		case "1" -> "월요일";
		case "2" -> "화요일";
		case "3" -> "수요일";
		case "4" -> "목요일";
		case "5" -> "금요일";
		case "6" -> "토요일";
		case "7" -> "일요일";
		default -> throw new IllegalArgumentException("Invalid day number: " + dayNum);
		};
	}

	// 관리자 공연 등록 -> 공연장 이름 또는 주소 검색시 공연장 목록 가져오기
	@Override
	public List<Map<String, Object>> getVenueList() {
		return mapper.selectVenueList();
	}

}
