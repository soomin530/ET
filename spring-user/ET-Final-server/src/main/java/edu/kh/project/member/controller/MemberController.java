package edu.kh.project.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.service.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("member")
@SessionAttributes({"loginMember"})
@RequiredArgsConstructor
@Slf4j
public class MemberController {
	
	private final MemberService service;

	/** 로그인 진행
	 * @param inputMember
	 * @param ra
	 * @param model
	 * @param saveId
	 * @param resp
	 * @return
	 */
	@PostMapping("login")
	@ResponseBody
	public Map<String, Object> login(@RequestBody Member inputMember, 
						HttpSession session,
						Model model,
						@RequestParam(value="saveId", required = false) String saveId,
						HttpServletResponse resp ) {
		
		Map<String, Object> result = new HashMap<>();
		
		// 체크박스
		// - 체크가    된 경우 : "on"
		// - 체크가  안된 경우 : null
		
		// 로그인 서비스 호출
		Member loginMember = service.login(inputMember);
		
		// 로그인 실패 시
		if(loginMember == null) {
			result.put("status", "fail");
			result.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
			
		} else {
			// 로그인 성공 시 세션에 직접 추가
	        session.setAttribute("loginMember", loginMember);
			
			// 쿠키 객체 생성 (K:V)
			Cookie cookie = new Cookie("saveId", loginMember.getMemberId());
			cookie.setPath("/");
			
			// 쿠키의 만료 기간 지정
			cookie.setMaxAge(60 * 60 * 24 * 30); // 30일 (초 단위로 지정)
			
			// 응답 객체에 쿠키 추가 -> 클라이언트 전달
			resp.addCookie(cookie);
			
			result.put("status", "success");
	        result.put("redirectUrl", "/");
			
		}
		
		return result; // 메인페이지 재요청
	}
	
	/** 로그아웃 진행
	 * @param session
	 */
	@GetMapping("/logout")
	public void logout(SessionStatus session) {
        // 세션 무효화
        session.setComplete();	
	        
	}

	
}
