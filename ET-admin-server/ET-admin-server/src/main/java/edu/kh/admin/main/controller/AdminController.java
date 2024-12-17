package edu.kh.admin.main.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.admin.main.model.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController // 전부다 비동기 요청만 받을것임 - ResponseBody도 생략 가능
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("admin")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginMember" }) // 로그인 세션
public class AdminController {

	private final AdminService service;
	
}
