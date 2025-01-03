package edu.kh.project.performance.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import edu.kh.project.perfmgr.model.dto.PerfMgr;
import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.PerformanceRegistrationDTO;
import edu.kh.project.performance.model.dto.ScheduleInfo;
import edu.kh.project.performance.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("performanceApi")
@RequiredArgsConstructor
@Slf4j
public class PerformanceApiController {

	@Autowired
	private PerformanceService performanceService;
	
	
	
	/**
	 * 잔여 좌석 개수 조회
	 * 
	 * @param page
	 * @param genre
	 * @return
	 */
	@GetMapping("/remainingSeats/{performanceId}/{selectedDate}")
	@ResponseBody
	public ResponseEntity<?> remainingSeats(@PathVariable("performanceId") String performanceId,
											@PathVariable("selectedDate") String selectedDate) {
		try {
			Map<String, Object> paramMap = new HashMap<>();
			
			paramMap.put("performanceId", performanceId);
			paramMap.put("selectedDate", selectedDate);
			
			// 잔여 좌석 개수 조회
			ScheduleInfo seatsInfo = performanceService.remainingSeats(paramMap);

			return ResponseEntity.ok(seatsInfo);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	

	/**
	 * 무한 스크롤 데이터
	 * 
	 * @param page
	 * @param genre
	 * @return
	 */
	@GetMapping("/genre/more")
	@ResponseBody
	public List<Performance> getMorePerformances(@RequestParam(value = "page", defaultValue = "1") int page,
			@RequestParam(value = "genre") String genre, @RequestParam(value = "filter") String filter) {
		int pageSize = 20;
		return performanceService.getPerformancesByPage(page, pageSize, genre, filter);
	}

	/**
	 * 공연장 좌석 정보 목록
	 * 
	 * @param
	 * @return
	 * @author 우수민
	 */
	@GetMapping("/venue/seats/{mt10id}")
	@ResponseBody
	public ResponseEntity<List<Map<String, Object>>> loadVenueSeats(@PathVariable("mt10id") String mt10id) {
		try {
			// 공연장 좌석 정보 목록
			List<Map<String, Object>> priceSeatInfo = performanceService.priceSeatInfoList(mt10id);

			return ResponseEntity.ok(priceSeatInfo);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	/**
	 * 공연 일정 중복 체크
	 * 
	 * @param
	 * @return
	 * @author 우수민
	 */
	@GetMapping("/venue/reserved-dates/{mt10id}")
	@ResponseBody
	public ResponseEntity<List<Map<String, Object>>> reservedDates(@PathVariable("mt10id") String mt10id) {
		try {

			// 공연 일정 중복 체크
			List<Map<String, Object>> result = performanceService.reservedDates(mt10id);

			return ResponseEntity.ok(result);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	/**
	 * 공연 등록
	 * 
	 * @param
	 * @return
	 * @author 우수민
	 */
	@PostMapping("/register")
	@ResponseBody
	public ResponseEntity<?> register(@RequestBody PerformanceRegistrationDTO dto,
			@SessionAttribute("loginMember") PerfMgr loginMember) throws Exception {
		try {

			// Base64 이미지가 있는 경우 파일로 저장
			if (dto.getPosterBase64() != null && !dto.getPosterBase64().isEmpty()) {
				String uploadDir = "uploads/posters"; // 실제 경로로 수정 필요
				String filename = saveBase64Image(dto.getPosterBase64(), uploadDir, dto.getPosterFileName());
				dto.setPosterFileName(filename); // 저장된 파일명 설정
			}

			dto.setConcertManagerNo(loginMember.getConcertManagerNo());
			dto.setEntrpsnm(loginMember.getConcertManagerCompany());

			// 공연 등록
			// 기본 공연 정보 TB_PERFORMANCES_DETAIL
			// 좌석별 가격 정보 TB_PERFORMANCE_SEAT_PRICE
			// 공연 요일, 시간 TB_PERFORMANCE_TIME
			int result = performanceService.registerPerformance(dto);

			return ResponseEntity.ok(result);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	private String saveBase64Image(String base64Data, String uploadDir, String originalFilename) throws IOException {
		// 파일명 생성 (중복 방지)
		String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
		String filename = UUID.randomUUID().toString() + extension;

		// 디렉토리 생성
		File directory = new File(uploadDir);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		// Base64를 파일로 저장
		byte[] imageBytes = Base64.getDecoder().decode(base64Data);
		Path filepath = Paths.get(uploadDir, filename);
		Files.write(filepath, imageBytes);

		return filename;
	}

	/**
	 * 관리자 공연 등록 -> 공연장 이름 또는 주소 검색시 공연장 목록 가져오기
	 * 
	 * @param keyword
	 * @return
	 * @author 우수민
	 */
	@GetMapping("/venue/list")
	@ResponseBody
	public ResponseEntity<List<Map<String, Object>>> venueListPerformances(
			@RequestParam(value = "keyword", required = false) String keyword) {
		try {
			// 모든 공연장 목록
			List<Map<String, Object>> allVenues = performanceService.getVenueList(); // 공연장 목록을 가져오는 메서드 필요

			// 검색어가 비어있지 않은 경우 필터링

			if (!keyword.isEmpty()) {
				allVenues = allVenues.stream().filter(venue -> String.valueOf(venue.get("FCLTYNM")).contains(keyword) || // 공연장
																															// 이름으로
																															// 검색
						String.valueOf(venue.get("ADRES")).contains(keyword) // 주소로 검색
				).collect(Collectors.toList());
			}

			return ResponseEntity.ok(allVenues);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

}
