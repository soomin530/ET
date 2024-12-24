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
    @GetMapping("/genre")
    public String genre(Model model) {
        // log.debug("Requested genre: {}", genre); 
    	
    	String genre = "연극";

        // 각 장르 공연 목록을 가져오기
        List<Performance> performances = performanceService.getPerformancesByGenre(genre);

        // 모델에 데이터 추가해서 전달
        model.addAttribute("performances", performances);
        model.addAttribute("genre", genre);

        return "/performance/genre";
    }
}
