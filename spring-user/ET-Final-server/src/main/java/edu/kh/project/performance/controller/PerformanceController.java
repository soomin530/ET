package edu.kh.project.performance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import edu.kh.project.payment.controller.paymentController;
import edu.kh.project.payment.service.paymentService;
import edu.kh.project.performance.model.service.performanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("performance")
@RequiredArgsConstructor
@Slf4j
public class PerformanceController {
	
	private final performanceService PerformanceService;
	
	/** 공연 목록 페이지로 이동
	 * @return
	 * @author 우수민
	 */
	@GetMapping("genre")
	public String musical() {
		return "/performance/genre";
		
	}

}
