package edu.kh.project.main.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import edu.kh.project.notice.model.dto.Notice;
import edu.kh.project.notice.model.service.NoticeService;
import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.PerformanceRanking;
import edu.kh.project.performance.service.PerformanceService;
import edu.kh.project.statistics.model.dto.Statistics;
import edu.kh.project.statistics.service.StatisticsBatchService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MainController {

	private final PerformanceService service;

	private final NoticeService noticeService;
	
	private final StatisticsBatchService statBatchService;

	/** 메인 페이지
	 * @param model
	 * @return
	 */
	@RequestMapping("/") // "/" 요청 매핑
	public String mainPage(Model model) {
		
		YearMonth today1 = YearMonth.now();
		LocalDate start1 = today1.atDay(1).minusMonths(1);
		LocalDate end1 = today1.atEndOfMonth().minusMonths(1);

		System.out.println("# YearMonth의 atDay(int dayOfMonth), atEndOfMonth() 방법");
		System.out.println("오늘 날짜 : " + today1);
		System.out.println("해당 월의 시작일(1일) : " + start1);
		System.out.println("해당 월의 마지막일 : " + end1);
		
		// 주요 공연 조회
		List<Performance> mainPerform = service.mainPerform();
		
		// 공연 랭킹 목록 조회
		List<PerformanceRanking> performanceRanking = service.performanceRanking();
		
		// 최근 공지사항 4개 조회해서 모델에 추가
        List<Notice> recentNotices = noticeService.getRecentNotices();
        
        // 통계 데이터 조회(지난달)
        List<Statistics> statList = statBatchService.getStatList();
        
        model.addAttribute("statList", statList);
        model.addAttribute("notices", recentNotices);
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
