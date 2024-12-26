package edu.kh.project.perfmgr.controller;

import java.util.HashMap;
import java.util.Map;

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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.service.MemberService;
import edu.kh.project.perfmgr.model.dto.PerfMgr;
import edu.kh.project.perfmgr.service.PerfmgrService;
import edu.kh.project.redis.model.service.RedisService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("perfmgr")
@SessionAttributes({ "loginMember" })
@RequiredArgsConstructor
@Slf4j
public class PerfmgrController {

	private final PerfmgrService service;

	private final JwtTokenUtil jwtTokenUtil;

	private final RedisService redisService;

	/**
	 * 로그인 진행
	 * 
	 * @param inputMember
	 * @param ra
	 * @param model
	 * @param saveId
	 * @param resp
	 * @return
	 */
	@PostMapping("login")
	@ResponseBody
	public Map<String, Object> login(@RequestBody PerfMgr inputMember, HttpSession session, RedirectAttributes ra,
			Model model, @RequestParam(value = "saveId", required = false) String saveId, HttpServletResponse resp) {

		Map<String, Object> result = new HashMap<>();

		// 로그인 서비스 호출
		PerfMgr perfmgrLoginMember = service.login(inputMember);

		// 로그인 실패 시
		if (inputMember == null) {
			result.put("status", "fail");
			result.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
			return result;
		}

		// Session scope에 loginMember 추가
		model.addAttribute("loginMember", perfmgrLoginMember);

		// JWT 토큰 생성
		String memberNo = String.valueOf(perfmgrLoginMember.getConcertManagerNo());
		String memberEmail = perfmgrLoginMember.getConcertManagerEmail();

		// 토큰 생성 및 Redis에 저장
		JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);

		// Access Token을 HttpOnly 쿠키에 저장
		Cookie accessTokenCookie = new Cookie("Access-token", tokenInfo.accessToken());
		accessTokenCookie.setHttpOnly(true);
		accessTokenCookie.setPath("/");
		accessTokenCookie.setMaxAge((int) jwtTokenUtil.getAccessTokenValidityInMilliseconds() / 1000);
		resp.addCookie(accessTokenCookie);

		result.put("status", "success");
		result.put("redirectUrl", "/");

		return result;

	}

	/**
	 * 회원 가입
	 * 
	 * @param inputMember   : 입력된 회원 정보(memberEmail, memberPw, memberNickname,
	 *                      memberTel, (memberAddress - 따로 배열로 받아서 처리))
	 * @param memberAddress : 입력한 주소 input 3개의 값을 배열로 전달 [우편번호, 도로명/지번주소, 상세주소]
	 * @param ra            : 리다이렉트 시 request scope로 데이터 전달하는 객체
	 * @return
	 */
	@PostMapping("signup")
	public String signup(PerfMgr inputMember, RedirectAttributes ra) {

		// 회원가입 서비스 호출
		int result = service.signup(inputMember);

		String path = null;
		String message = null;

		if (result > 0) { // 성공 시
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
	 * @param request
	 * @param response
	 * @return
	 */
	@PostMapping("logout")
	public ResponseEntity<?> logout(HttpServletRequest request,
	                                 HttpServletResponse response,
	                                 SessionStatus status) {
	    try {
	        // Access Token 추출
	        String accessToken = extractAccessToken(request.getCookies());
	        String memberNo = jwtTokenUtil.getMemberIdFromToken(accessToken);

	        // Redis에서 Refresh Token 찾기 및 삭제
	        String refreshToken = redisService.getMemberNoFromToken(memberNo);
	        if (refreshToken != null) {
	            redisService.deleteRefreshToken(refreshToken);
	        }

	        // Access Token 쿠키 삭제
	        Cookie accessTokenCookie = new Cookie("Access-token", "");
	        accessTokenCookie.setMaxAge(0);
	        accessTokenCookie.setPath("/");
	        response.addCookie(accessTokenCookie);
	        
	        status.setComplete();

	        return ResponseEntity.ok()
	            .body(Map.of(
	                "message", "로그아웃 되었습니다.",
	                "redirectUrl", "/"
	            ));

	    } catch (Exception e) {
	        return ResponseEntity.internalServerError()
	            .body(Map.of("message", "로그아웃 처리 중 오류가 발생했습니다."));
	    }
	}
	
	private String extractAccessToken(Cookie[] cookies) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("Access-token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        throw new JwtException("Access token not found in cookies");
    }

	/**
	 * 이메일 중복검사 (비동기 요청)
	 * 
	 * @return
	 */
	@ResponseBody
	@GetMapping("checkEmail")
	public int checkEmail(@RequestParam("concertManagerEmail") String concertManagerEmail) {
		return service.checkEmail(concertManagerEmail);
	}

	/**
	 * 아이디 중복검사 (비동기 요청)
	 * 
	 * @return
	 */
	@ResponseBody // 응답 본문(fetch)으로 돌려보냄
	@GetMapping("checkId") // Get요청 /member/checkEmail
	public int checkId(@RequestParam("concertManagerId") String concertManagerId) {
		return service.checkId(concertManagerId);
	}

	/**
	 * 닉네임 중복 검사
	 * 
	 * @return 중복 1, 아님 0
	 */
	@ResponseBody
	@GetMapping("checkNickname")
	public int checkNickname(@RequestParam("concertManagerNickname") String concertManagerNickname) {
		return service.checkNickname(concertManagerNickname);
	}

}
