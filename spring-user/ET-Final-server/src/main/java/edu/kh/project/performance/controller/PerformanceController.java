package edu.kh.project.performance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.ScheduleInfo;
import edu.kh.project.performance.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("performance")
@RequiredArgsConstructor
@Slf4j
public class PerformanceController {

	private final PerformanceService performanceService;

	/**
     * 공연 목록 페이지로 이동
     * @param genre 공연 장르
     * @param model 
     * @return 
     * @author 우수민
     */
	@GetMapping("/genre/{genre}")
	public String genre(@PathVariable("genre") String genre, Model model) {
	    // 장르명 변환 로직
	    if(genre.equals("musical")) {
	        genre = "뮤지컬";
	    }
	    if(genre.equals("theater")) {
	        genre = "연극";
	    }
	    if(genre.equals("classic")) {
	        genre = "서양음악(클래식)";
	    }

	    // 첫 페이지 데이터만 가져오기 (20개)
	    List<Performance> performances = performanceService.getPerformancesByPage(1, 20, genre);

	    log.debug("Performances: {}", performances);

	    // 모델에 데이터 추가
	    model.addAttribute("performances", performances);
	    model.addAttribute("genre", genre);

	    return "performance/genre";
	}
    
    /** 공연 상세페이지 조회
     * @param mt20id
     * @param model
     * @return
     * @author 우수민
     */
    @GetMapping("/detail/{mt20id}")
    public String detail(@PathVariable("mt20id") String mt20id, Model model) {
    	
        // 공연 ID로 공연 정보 조회
        Performance performance = performanceService.getPerformanceById(mt20id);
        
        // 스케줄 및 잔여석 정보 조회
 		Map<String, List<ScheduleInfo>> schedule = performanceService.getScheduleWithAvailableSeats(mt20id);
 		performance.setSchedule(schedule);

        // 공연 정보 추가
        model.addAttribute("performance", performance);

        return "performance/performance-detail-calander"; 
    }
    
    /** 공연관리자가 등록한 공연 목록 조회 
     * @return
     * @author 우수민
     */
    @GetMapping("/manager")
    public String manager(@SessionAttribute("loginMember") Member loginMember, Model model) {
    	
        // 로그인된 관리자 정보 가져오기
        int memberNo = loginMember.getMemberNo();

        // 등록된 공연 목록 가져오기 (서비스 호출)
        List<Performance> performances = performanceService.getPerformancesByManager(memberNo);

        // 모델에 공연 목록 추가
        model.addAttribute("performances", performances);

        return "performance/performance-manager"; 
    }
}
