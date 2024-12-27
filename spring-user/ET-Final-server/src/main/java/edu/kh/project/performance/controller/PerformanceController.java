package edu.kh.project.performance.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import edu.kh.project.performance.model.dto.Performance;
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
    	
    	if(genre.equals("musical")) {
    		genre = "뮤지컬";
    	}
    	
    	if(genre.equals("theater")) {
    		genre = "연극";
    	}
    	
    	if(genre.equals("classic")) {
    		genre = "서양음악(클래식)";
    	}

        // 각 장르 공연 목록을 가져오기
        List<Performance> performances = performanceService.getPerformancesByGenre(genre);
        
        log.debug("Performances: {}", performances);

        // 모델에 데이터 추가해서 전달
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

        // 공연 정보 추가
        model.addAttribute("performance", performance);

        return "performance/performance-detail-calander"; 
    }

}
