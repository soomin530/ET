package edu.kh.admin.main.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.admin.main.model.dto.Performance;
import edu.kh.admin.main.model.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController 
@CrossOrigin( origins = "http://localhost:3000",
			  allowedHeaders = "*",
			  allowCredentials = "true",
			  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
				           RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("performance")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginMember" }) 
public class PerformanceController {

	private final PerformanceService service;
	
	@GetMapping("showPerformanceList")
	public ResponseEntity<Object> showPerformanceList()  {
		
		List<Performance> showPerformanceList = service.showPerformanceList();
		
		try {
			return ResponseEntity.status(HttpStatus.OK).body(showPerformanceList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
		}
	}
	
	@GetMapping("/{mt10ID:FC[0-9]+}")
	public ResponseEntity<Object> performanceDetail(@PathVariable("mt10ID") String mt10ID) {
		
		List<Performance> performanceDetailList = service.performanceDetailList(mt10ID);
		
		try {
			return ResponseEntity.status(HttpStatus.OK).body(performanceDetailList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
		}
	} 
	
	
	
	@PostMapping("searchPerformanceList")
	public ResponseEntity<Object> searchPerformanceList(@RequestBody Map<String, Object> formdata)  {
				
		List<Performance> searchPerformanceList = service.searchPerformanceList(formdata);
	
		try {
			return ResponseEntity.status(HttpStatus.OK).body(searchPerformanceList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
		}
	}
	
	
	
	@PostMapping("insert")
	public ResponseEntity<Object> insert(@RequestBody Map<String, Object> formdata)  {
			
			int result = service.insert(formdata);
			log.info(result+"");
			
		try {
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
//	@GetMapping("showMemberList")
//	public ResponseEntity<Object> showMemberList() {
//		List<Member> showMemberList = service.showMemberList();
//		try {
//			return ResponseEntity.status(HttpStatus.OK).body(showMemberList);
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
//		}
//	}
	
}
