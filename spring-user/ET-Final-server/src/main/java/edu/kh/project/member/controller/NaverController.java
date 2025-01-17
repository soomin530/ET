package edu.kh.project.member.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.service.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("naver")
@SessionAttributes({ "loginMember" })
@RequiredArgsConstructor
@Slf4j
public class NaverController {

	private final MemberService service;

	private final JwtTokenUtil jwtTokenUtil;

	@Value("${naver.client.id}")
	private String clientId;

	@Value("${naver.client.secret}")
	private String clientSecret;

	@Value("${naver.redirect.url}")
	private String redirectUrl;

	/**
	 * 네이버 로그인 초기 요청
	 * 
	 * @return
	 */
	@GetMapping("login")
	public String naverLogin() {
		// state용 난수 생성
		String state = UUID.randomUUID().toString();

		// redirect URL 생성
		String naverAuthUrl = String.format(
				"https://nid.naver.com/oauth2.0/authorize" + "?response_type=code" + "&client_id=%s"
						+ "&redirect_uri=%s" + "&state=%s",
				clientId, URLEncoder.encode(redirectUrl, StandardCharsets.UTF_8), state);

		return "redirect:" + naverAuthUrl;
	}

	/**
	 * callback 처리
	 * 
	 * @param code
	 * @param state
	 * @param error
	 * @param session
	 * @return
	 */
	@GetMapping("callback")
	public String naverCallback(@RequestParam(name = "code", required = false) String code,
			@RequestParam(name = "state", required = false) String state,
			@RequestParam(name = "error", required = false) String error, HttpSession session) {

		if (error != null || code == null || state == null) {
			return "redirect:/";
		}

		// 임시 저장
		session.setAttribute("naverCode", code);
		session.setAttribute("naverState", state);

		// POST 처리로 forward
		return "forward:/naver/process";
	}

	/**
	 * 실제 로그인 처리
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "process", method = { RequestMethod.GET, RequestMethod.POST })
	public String processNaverLogin(HttpSession session, HttpServletResponse resp) {
		// 임시 저장된 값 가져오기
		String code = (String) session.getAttribute("naverCode");
		String state = (String) session.getAttribute("naverState");

		// 사용 후 바로 제거
		session.removeAttribute("naverCode");
		session.removeAttribute("naverState");

		try {
			// 토큰 받기
			String tokenUrl = String.format("https://nid.naver.com/oauth2.0/token" + "?grant_type=authorization_code"
					+ "&client_id=%s" + "&client_secret=%s" + "&code=%s" + "&state=%s", clientId, clientSecret, code,
					state);

			URL url = (new URI(tokenUrl.toString()).toURL());
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");

			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String responseBody = br.lines().collect(Collectors.joining());
			JSONObject tokenResponse = new JSONObject(responseBody);
			String accessToken = tokenResponse.getString("access_token");

			// 사용자 정보 가져오기
			String apiUrl = "https://openapi.naver.com/v1/nid/me";
			URL userInfoUrl = (new URI(apiUrl.toString()).toURL());
			HttpURLConnection userInfoConn = (HttpURLConnection) userInfoUrl.openConnection();
			userInfoConn.setRequestMethod("GET");
			userInfoConn.setRequestProperty("Authorization", "Bearer " + accessToken);

			BufferedReader userInfoBr = new BufferedReader(new InputStreamReader(userInfoConn.getInputStream()));
			String userInfoResponse = userInfoBr.lines().collect(Collectors.joining());
			JSONObject userInfo = new JSONObject(userInfoResponse);
			JSONObject response = userInfo.getJSONObject("response");

			// Member 객체에 매핑
			Member naverMember = new Member();
			naverMember.setMemberId(response.getString("id")); // 네이버 고유 ID
			naverMember.setMemberEmail(response.getString("id")); // 네이버 이메일(아이디로 대체)
			naverMember.setMemberNickname(response.getString("nickname")); // 네이버 닉네임
			naverMember.setMemberGender(response.getString("gender").toUpperCase()); // M/F
			naverMember.setNaverFl("Y"); // 네이버 로그인 회원
			naverMember.setMemberAuth(1); // 일반회원 권한
			naverMember.setMemberPw("naver" + response.getString("id")); // 임의 비밀번호
			naverMember.setMemberTel("00000000000"); // 기본값
			naverMember.setMemberAddress(" "); // 기본값

			// 프로필 이미지가 있다면 저장
			if (response.has("profile_image")) {
				naverMember.setProfileImg(response.getString("profile_image"));
			}

			// 기존 네이버 회원인지 확인 후 처리하는 서비스 호출
			Member naverUser = service.loginNaver(naverMember);

			if (naverUser != null) {
				// 세션에 로그인 정보 저장
	        	session.setAttribute("loginMember", naverUser);
	        	
				// JWT 토큰 생성
				String memberNo = String.valueOf(naverUser.getMemberNo());
				String memberEmail = naverUser.getMemberEmail();

				JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);

				// Refresh Token을 HttpOnly 쿠키에 저장
				Cookie refreshTokenCookie = new Cookie("Refresh-Token", tokenInfo.refreshToken());
				refreshTokenCookie.setHttpOnly(true);
				refreshTokenCookie.setSecure(false); // HTTPS 사용 시 true로 변경
				refreshTokenCookie.setPath("/");
				refreshTokenCookie.setMaxAge((int) jwtTokenUtil.getRefreshTokenValidityInMilliseconds() / 1000);
				resp.addCookie(refreshTokenCookie);

				// Access Token을 localStorage에 저장하기 위해 임시 쿠키로 전달
				Cookie tempTokenCookie = new Cookie("Temp-Access-Token", tokenInfo.accessToken());
				tempTokenCookie.setPath("/");
				tempTokenCookie.setMaxAge(60); // 1분
				resp.addCookie(tempTokenCookie);

				// 네이버 로그인 여부를 쿠키에 저장
				Cookie naverFlCookie = new Cookie("naverFl", "Y");
				naverFlCookie.setPath("/");
				naverFlCookie.setMaxAge(3600);
				resp.addCookie(naverFlCookie);
			}

		} catch (Exception e) {
			log.error("네이버 로그인 처리 중 오류 발생", e);
		}

		return "redirect:/";
	}

	/**
	 * 로그아웃 처리
	 * 
	 * @param session
	 * @param status
	 * @param response
	 * @return
	 */
	@PostMapping("logout")
	public String naverLogout(HttpSession session, SessionStatus status, HttpServletResponse response) {
		try {
			// Refresh Token 쿠키 삭제
            Cookie refreshTokenCookie = new Cookie("Refresh-Token", "");
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(0);
            response.addCookie(refreshTokenCookie);

            // 네이버 로그인 플래그 삭제
            Cookie naverFlCookie = new Cookie("naverFl", "");
            naverFlCookie.setPath("/");
            naverFlCookie.setMaxAge(0);
            response.addCookie(naverFlCookie);

			status.setComplete();

		} catch (Exception e) {
			log.error("로그아웃 처리 중 에러 발생", e);
		}

		return "redirect:/";
	}

	/**
	 * 예외 처리
	 * 
	 * @param e
	 * @param model
	 * @return
	 */
	@ExceptionHandler(Exception.class)
	public String handleException(Exception e, Model model) {
		log.error("네이버 로그인 오류", e);
		model.addAttribute("errorMessage", "로그인 처리 중 오류가 발생했습니다");
		return "error/oauth";
	}

}