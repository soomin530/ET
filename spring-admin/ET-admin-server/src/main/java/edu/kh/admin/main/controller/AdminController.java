package edu.kh.admin.main.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController // 전부다 비동기 요청만 받을것임 - ResponseBody도 생략 가능
@CrossOrigin( origins = "http://localhost:3000",
			  allowedHeaders = "*",
			  allowCredentials = "true",
			  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
				           RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("admin")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginMember" }) // 로그인 세션
public class AdminController {

	private final AdminService service;
	
	@GetMapping("showMemberList")
	public ResponseEntity<Object> showMemberList() {
		List<Member> showMemberList = service.showMemberList();
		log.info(showMemberList.toString());
		try {
			return ResponseEntity.status(HttpStatus.OK).body(showMemberList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
		}
	}
	
	@GetMapping("searchShowMemberList")
	public ResponseEntity<Object> searchShowMemberList(@RequestBody Map<String, Object> formdata)  {
		List<Member> showMemberList = service.showMemberList();
		log.info(formdata.toString());
		log.info(showMemberList.toString());
		try {
			return ResponseEntity.status(HttpStatus.OK).body(showMemberList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
		}
	}
	
	
}
