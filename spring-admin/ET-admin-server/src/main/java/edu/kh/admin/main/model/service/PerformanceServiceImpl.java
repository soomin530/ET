package edu.kh.admin.main.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.Performance;
import edu.kh.admin.main.model.dto.SeatInfo;
import edu.kh.admin.main.model.mapper.PerformanceMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class PerformanceServiceImpl implements PerformanceService {

	private final PerformanceMapper mapper;

	@Override
	public List<Performance> showPerformanceList() {
		return mapper.showPerformanceList();
	}

	@Override
	public List<Performance> searchPerformanceList(Map<String, Object> formdata) {
		return mapper.searchPerformanceList(formdata);
	}

	@Override
	public List<Performance> IDCheck() {
		return mapper.IDCheck();
	}

	@Override
	public int insert(Map<String, Object> formdata) {

		String mt10Id = (String) formdata.get("MT10ID");
		String seatScale = (String) formdata.get("SEATSCALE");
		Map<Integer, Integer> gradeSeats = (Map<Integer, Integer>) formdata.get("gradeSeats");

		int result1 = 1;
		int result2 = 1;
		int result3 = mapper.insert(formdata);

		// gradeSeats가 null인지 확인하여 처리
		if (gradeSeats == null) {
			// gradeSeats가 null인 경우
			Map<String, Object> grade = new HashMap<>();
			grade.put("MT10ID", mt10Id);
			grade.put("grade", 6); // 고정 값 6
			grade.put("count", seatScale);
			result1 = mapper.insertGrade(grade);
		} else {
			// gradeSeats가 존재하는 경우
			for (Map.Entry<Integer, Integer> entry : gradeSeats.entrySet()) {
				Map<String, Object> grade = new HashMap<>();
				grade.put("MT10ID", mt10Id);
				grade.put("grade", entry.getKey()); // i번째 요소의 key
				grade.put("count", entry.getValue()); // i번째 요소의 value
				if (mapper.insertGrade(grade) == 0)
					result2 = 0;
			}
		}

		int result = (result1 == 1 && result2 == 1 && result3 == 1) ? 1 : 0;

		return result;
	}

	@Override
	public List<Performance> performanceDetailList(String mt10id) {
		return mapper.performanceDetailList(mt10id);
	}

	@Override
	public List<SeatInfo> seatInfoDetailList(String mt10id) {
		return mapper.seatInfoDetailList(mt10id);
	}

	@Override
	public int update(Map<String, Object> formdata) {

		String mt10Id = (String) formdata.get("MT10ID");
		String seatScale = (String) formdata.get("SEATSCALE");
		Map<Integer, Integer> gradeSeats = (Map<Integer, Integer>) formdata.get("gradeSeats");

		int result1 = 1;
		int result2 = 1;
		int result3 = mapper.update(formdata);

		// gradeSeats가 null인지 확인하여 처리
		Map<String, Object> deleteGrade = new HashMap<>();
		deleteGrade.put("MT10ID", mt10Id);
		int resultD = mapper.deleteGrade(deleteGrade);
		if (gradeSeats == null) {
			// gradeSeats가 null인 경우
			Map<String, Object> grade = new HashMap<>();
			grade.put("MT10ID", mt10Id);
			grade.put("grade", 6); // 고정 값 6
			grade.put("count", seatScale);
			result1 = mapper.insertGrade(grade);
		} else {
			// gradeSeats가 존재하는 경우
			for (Map.Entry<Integer, Integer> entry : gradeSeats.entrySet()) {
				Map<String, Object> grade = new HashMap<>();
				grade.put("MT10ID", mt10Id);
				grade.put("grade", entry.getKey()); // i번째 요소의 key
				grade.put("count", entry.getValue()); // i번째 요소의 value
				if (mapper.insertGrade(grade) == 0)
					result2 = 0;
			}
		}

		int result = (result1 == 1 && result2 == 1 && result3 == 1) ? 1 : 0;

		return result;
	}
}
