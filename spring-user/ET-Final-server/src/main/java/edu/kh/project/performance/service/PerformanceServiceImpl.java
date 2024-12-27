package edu.kh.project.performance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.ScheduleInfo;
import edu.kh.project.performance.model.mapper.PerformanceMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements PerformanceService {

	private final PerformanceMapper mapper;

	// 장르별 공연 목록 조회
	@Override
	public List<Performance> getPerformancesByGenre(String genre) {
		return mapper.genre(genre);
	}

	// 공연 상세페이지 조회
	@Override
	public Performance getPerformanceById(String mt20id) {
		return mapper.detail(mt20id);
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
                info.setRound(getTimeRound((String) data.get("TIME")));
                info.setSeats(((BigDecimal) data.get("SEATS")).intValue());
                info.setSeatStatus((String) data.get("STATUS"));
                
                scheduleMap.computeIfAbsent(dayOfWeek, k -> new ArrayList<>())
                          .add(info);
            }
        }
        
        return scheduleMap;
    }
    
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
    
    private String getTimeRound(String time) {
        try {
            int hour = Integer.parseInt(time.split(":")[0]);
            return hour < 15 ? "1회차" : "2회차";
        } catch (Exception e) {
            return "1회차"; // 기본값
        }
    }
}
