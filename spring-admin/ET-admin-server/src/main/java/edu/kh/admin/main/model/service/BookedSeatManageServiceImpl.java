package edu.kh.admin.main.model.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.BookedSeatManageDTO;
import edu.kh.admin.main.model.dto.ScheduleInfo;
import edu.kh.admin.main.model.dto.Seat;
import edu.kh.admin.main.model.mapper.BookedSeatManageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BookedSeatManageServiceImpl implements BookedSeatManageService {

	private final BookedSeatManageMapper mapper;

	// 공연 목록 조회
	@Override
	public List<BookedSeatManageDTO> performanceList() {
		return mapper.performanceList();
	}
	
	// 공연 목록 검색
	@Override
	public List<BookedSeatManageDTO> searchPerformanceList(Map<String, Object> formData) {
		return mapper.searchPerformanceList(formData);
	}

	// 공연 상세페이지 조회
	@Override
	public BookedSeatManageDTO getPerformanceById(String mt20id) {

		BookedSeatManageDTO performance = mapper.detail(mt20id);

		// 지도 API 정보
		BookedSeatManageDTO mapInfo = mapper.selectPerformanceById(mt20id);

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

	// 새로운 좌석이 이미 예약되어 있는지 확인
	@Override
	public boolean isAlreadyBooked(String seatId, String mt20id, String selectedDate, String selectedTime) {
		Map<String, Object> params = new HashMap<>();
		params.put("seatId", seatId);
		params.put("mt20id", mt20id);
		params.put("selectedDate", selectedDate);
		params.put("selectedTime", selectedTime);

		return mapper.countBookedSeat(params) > 0;
	}

	// 좌석 이동 처리
	@Override
	@Transactional
	public boolean moveSeat(String oldSeatId, String newSeatId, String mt20id, String selectedDate, String selectedTime,
			Integer memberNo, Integer gradeId) {
		Map<String, Object> params = new HashMap<>();
		params.put("oldSeatId", oldSeatId);
		params.put("newSeatId", newSeatId);
		params.put("mt20id", mt20id);
		params.put("selectedDate", selectedDate);
		params.put("selectedTime", selectedTime);
		params.put("memberNo", memberNo);
		params.put("gradeId", gradeId);

		return mapper.updateSeatLocation(params) > 0;
	}

	// 좌석을 비활성화하는 경우 - TB_TICKET_SEAT에 새로운 레코드 추가
	@Override
	@Transactional
	public boolean insertBlockedSeat(String seatId, String mt20id, String selectedDate, String selectedTime) {
		// seatId에서 등급명 추출 (예: "PF251998-전석-8-5" -> "전석")
		String gradeName = seatId.split("-")[1];

		// 등급명으로 등급 ID 조회
		Integer gradeId = mapper.getGradeIdByName(gradeName);
		if (gradeId == null) {
			throw new RuntimeException("Invalid grade name: " + gradeName);
		}

		Map<String, Object> params = new HashMap<>();
		params.put("seatId", seatId);
		params.put("mt20id", mt20id);
		params.put("selectedDate", selectedDate);
		params.put("selectedTime", selectedTime);
		params.put("gradeId", gradeId);
		params.put("status", "BLOCKED");

		return mapper.insertBlockedSeat(params) > 0;
	}

	// 좌석을 활성화하는 경우 - TB_TICKET_SEAT에서 해당 레코드 삭제
	@Override
	@Transactional
	public boolean removeBlockedSeat(String seatId, String mt20id, String selectedDate, String selectedTime) {
		Map<String, Object> params = new HashMap<>();
		params.put("seatId", seatId);
		params.put("mt20id", mt20id);
		params.put("selectedDate", selectedDate);
		params.put("selectedTime", selectedTime);
		params.put("status", "BLOCKED");

		return mapper.removeBlockedSeat(params) > 0;
	}

}
