package edu.kh.project.main.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.PerformanceRanking;
import edu.kh.project.performance.service.PerformanceService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MainController {
	
	private final PerformanceService service;
	
	/** 메인 페이지
	 * @param model
	 * @return
	 */
	@RequestMapping("/") // "/" 요청 매핑
	public String mainPage(Model model) {
		
		// 주요 공연 조회
		List<Performance> mainPerform = service.mainPerform();
		
		
		List<PerformanceRanking> performanceRanking = service.performanceRanking();
		
		model.addAttribute("mainPerform", mainPerform);
		model.addAttribute("performanceRanking", performanceRanking);
		
		return "common/main";
	}
	
	
	// LoginFilter -> loginError 리다이렉트
	// -> message 만들어서 메인페이지로 리다이렉트
	@GetMapping("loginError")
	public String loginError(RedirectAttributes ra) {
		
		ra.addFlashAttribute("message", "로그인 후 이용해 주세요");
		
		return "redirect:/";
		
	}
	
	// 로그인 하지 않았거나, 일반 유저가 관리자 페이지로 접속하려 할 경우
	// 메인페이지로 리다이렉트
	@GetMapping("/accessDenied")
	public String accessDenied(RedirectAttributes ra) {
		
		ra.addFlashAttribute("message", "권한이 없습니다.");
		
		return "redirect:/";
	}

}
