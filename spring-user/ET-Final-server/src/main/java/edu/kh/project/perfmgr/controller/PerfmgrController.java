package edu.kh.project.perfmgr.controller;

import java.util.HashMap;
import java.util.Map;

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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.service.MemberService;
import edu.kh.project.perfmgr.model.dto.PerfMgr;
import edu.kh.project.perfmgr.service.PerfmgrService;
import edu.kh.project.redis.model.service.RedisService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("perfmgr")
@SessionAttributes({"loginMember"})
@RequiredArgsConstructor
@Slf4j
public class PerfmgrController {

	private final PerfmgrService service;
	
    private final JwtTokenUtil jwtTokenUtil;
    
    private final RedisService redisService;
    
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
	public Map<String, Object> login(@RequestBody PerfMgr inputMember, 
						HttpSession session,
						RedirectAttributes ra,
						Model model,
						@RequestParam(value="saveId", required = false) String saveId,
						HttpServletResponse resp ) {
		
		Map<String, Object> result = new HashMap<>();
		
		// 체크박스
		// - 체크가    된 경우 : "on"
		// - 체크가  안된 경우 : null
		
		// 로그인 서비스 호출
		PerfMgr perfmgrLoginMember = service.login(inputMember);
		
		// 로그인 실패 시
		if(perfmgrLoginMember == null) {
			result.put("status", "fail");
			result.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
			
		} else {
			// Session scope에 loginMember 추가
			model.addAttribute("loginMember", perfmgrLoginMember);

			// JWT 토큰 생성
			String memberNo = String.valueOf(perfmgrLoginMember.getConcertManagerNo());
			String memberEmail = perfmgrLoginMember.getConcertManagerEmail();

			JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);

			// Refresh Token을 Redis에 저장
			// redisService.saveRefreshToken(tokenInfo.refreshToken(), memberNo, jwtTokenUtil.getRefreshTokenValidityInMilliseconds());

			// Access Token을 HttpOnly 쿠키에 저장
			Cookie accessTokenCookie = new Cookie("Access-token", tokenInfo.accessToken());
			accessTokenCookie.setHttpOnly(true); // JavaScript에서 접근하지 못하도록 설정
			accessTokenCookie.setPath("/");     // 쿠키 유효 경로 설정
			accessTokenCookie.setMaxAge((int) jwtTokenUtil.getAccessTokenValidityInMilliseconds() / 1000); // 초 단위 설정
			resp.addCookie(accessTokenCookie);

			// Refresh Token을 HttpOnly 쿠키에 저장
			Cookie refreshTokenCookie = new Cookie("Refresh-token", tokenInfo.refreshToken());
			refreshTokenCookie.setHttpOnly(true); // JavaScript에서 접근하지 못하도록 설정
			refreshTokenCookie.setPath("/");     // 쿠키 유효 경로 설정
			refreshTokenCookie.setMaxAge((int) jwtTokenUtil.getRefreshTokenValidityInMilliseconds() / 1000); // 초 단위 설정
			resp.addCookie(refreshTokenCookie);
			
			
			// 결과에 Access Token과 상태 추가
			result.put("status", "success");
			result.put("redirectUrl", "/");

			
		}
		
		return result; // 메인페이지 재요청
	}
	
	/** 회원 가입 
	 * @param inputMember : 입력된 회원 정보(memberEmail, memberPw, memberNickname, memberTel, 
	 * 						(memberAddress - 따로 배열로 받아서 처리))
	 * @param memberAddress : 입력한 주소 input 3개의 값을 배열로 전달 [우편번호, 도로명/지번주소, 상세주소]
	 * @param ra : 리다이렉트 시 request scope로 데이터 전달하는 객체 
	 * @return
	 */
	@PostMapping("signup")
	public String signup(PerfMgr inputMember, 
						RedirectAttributes ra ) {
		
		// 회원가입 서비스 호출
		int result = service.signup(inputMember);
		
		String path = null;
		String message = null;
		
		if(result > 0) { // 성공 시
			message = inputMember.getConcertManagerNickname() + "님의 가입을 환영 합니다!";
			path = "/";
			
		} else { // 실패
			message = "회원 가입 실패...";
			path = "sigunup";
		}
		
		ra.addFlashAttribute("message", message);
		
		
		return "redirect:" + path; 
	}
	
	/** 로그아웃 진행
	 * @param session
	 */
	@PostMapping("/logout")
	public String logout(SessionStatus session, HttpServletResponse resp, HttpServletRequest request) {
		
		// 삭제할 쿠키를 null로 설정
		Cookie cookie = new Cookie("Access-token", null);
		
		// 쿠키의 Path를 명시적으로 설정 (원래의 Path와 일치시켜야 함)
		cookie.setPath("/");
		
		// 응답에 쿠키를 추가해서 삭제
		resp.addCookie(cookie);
		
        // 세션 무효화
        session.setComplete();	
        
        return "redirect:/"; // 메인 페이지로 리다이렉트
	}
	
	/** 이메일 중복검사 (비동기 요청)
	 * @return
	 */
	@ResponseBody
	@GetMapping("checkEmail")
	public int checkEmail(@RequestParam("concertManagerEmail") String concertManagerEmail) {
		return service.checkEmail(concertManagerEmail);
	}
	
	/** 아이디 중복검사 (비동기 요청)
	 * @return
	 */
	@ResponseBody // 응답 본문(fetch)으로 돌려보냄
	@GetMapping("checkId")   // Get요청 /member/checkEmail 
	public int checkId(@RequestParam("concertManagerId") String concertManagerId) {
		return service.checkId(concertManagerId);
	}
	
	/** 닉네임 중복 검사
	 * @return 중복 1, 아님 0
	 */
	@ResponseBody
	@GetMapping("checkNickname")
	public int checkNickname(@RequestParam("concertManagerNickname") String concertManagerNickname) {
		return service.checkNickname(concertManagerNickname);
	}

}
