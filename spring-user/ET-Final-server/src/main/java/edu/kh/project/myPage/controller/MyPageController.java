package edu.kh.project.myPage.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@RequestMapping("mypage")
@Slf4j
@SessionAttributes({"loginMember"})
public class MyPageController {
	
	private final MyPageService service;
    private final BCryptPasswordEncoder bcrypt;

	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	// 비밀번호 검증
	    @PostMapping("verifyPassword")
	    @ResponseBody
	    public int verifyPassword(
	        @RequestParam("memberPw") String memberPw,
	        @SessionAttribute("loginMember") Member loginMember
	    ) {
	        int result = service.verifyPassword(memberPw, loginMember.getMemberNo());
	        return result;
	    }
	
	// 닉네임 클릭 시 회원정보 페이지로 이동
	@GetMapping("memberInfo") 
	public String memberInfo() {
		
		return "mypage/memberInfo";
	}
	
	// 회원정보 수정 페이지로 이동
	@GetMapping("updateInfo") 
	public String updateInfo() {
		
		return "mypage/updateInfo";
	}
	
	// 비밀번호 변경 페이지로 이동
	@GetMapping("ChangePw") 
	public String ChangePw() {
		
		return "mypage/ChangePw";
	}
	
	// 배송지 관리 페이지로 이동
	@GetMapping("addressManagement") 
	public String addressManagement() {
		
		return "mypage/addressManagement";
	}
	
	// 회원탈퇴 페이지로 이동
	@GetMapping("membershipOut") 
	public String membershipOut() {
		
		return "mypage/membershipOut";
	}
	

}
