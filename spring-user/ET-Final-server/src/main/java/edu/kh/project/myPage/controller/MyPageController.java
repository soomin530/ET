package edu.kh.project.myPage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@RequestMapping("mypage")
@Slf4j
@SessionAttributes({"loginMember"})
public class MyPageController {
	
	// 닉네임 클릭 시 회원정보 페이지로 이동
	@GetMapping("memberInfo") 
	public String memberInfo() {
		
		//log.debug("작동");
		
		return "mypage/memberInfo";
	}

}
