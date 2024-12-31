package edu.kh.project.myPage.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.service.MyPageService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@RequestMapping("mypage")
@Slf4j
@SessionAttributes({ "loginMember" })
public class MyPageController {

	private final MyPageService service;
	private final BCryptPasswordEncoder bcrypt;

	private final JwtTokenUtil jwtTokenUtil;
	
	// 닉네임 클릭 시 회원정보 페이지로 이동
	@GetMapping("memberInfo")
	public String memberInfo() {

		return "mypage/memberInfo";
	}

	// 비밀번호 검증
	@RequestMapping(value = "verifyPassword", method = {RequestMethod.GET, RequestMethod.POST})
	@ResponseBody
	public int verifyPassword(@RequestParam("memberPw") String memberPw,
			@SessionAttribute("loginMember") Member loginMember, HttpServletResponse resp) {
		
		// 네이버 로그인 사용자는 자동 인증 통과
        if("Y".equals(loginMember.getNaverFl())) {
            // 네이버 사용자용 토큰 생성
            String memberNo = String.valueOf(loginMember.getMemberNo());
            String memberEmail = loginMember.getMemberEmail();
            JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);
            
            // Access Token을 쿠키에 저장
            Cookie accessTokenCookie = new Cookie("Access-Token", tokenInfo.accessToken());
            accessTokenCookie.setHttpOnly(false);
            accessTokenCookie.setSecure(false);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge((int) jwtTokenUtil.getAccessTokenValidityInMilliseconds() / 1000);
            resp.addCookie(accessTokenCookie);
            
            return 1; // 인증 성공
        }
        
        // memberPw가 없는 GET 요청의 경우
        if (memberPw == null) {
            return 0;
        }

        // 일반 사용자 비밀번호 검증 및 토큰 생성
        String memberNo = String.valueOf(loginMember.getMemberNo());
        String memberEmail = loginMember.getMemberEmail();
        JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);
        
        Cookie accessTokenCookie = new Cookie("Access-Token", tokenInfo.accessToken());
        accessTokenCookie.setHttpOnly(false);
        accessTokenCookie.setSecure(false);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge((int) jwtTokenUtil.getAccessTokenValidityInMilliseconds() / 1000);
        resp.addCookie(accessTokenCookie);
        
        int result = service.verifyPassword(memberPw, loginMember.getMemberNo());
        return result;
	}

	// 회원 정보 조회
	@GetMapping("info")
	@ResponseBody
	public ResponseEntity<Member> getMemberInfo(@SessionAttribute("loginMember") Member loginMember) {
		Member member = service.getMemberInfo(loginMember.getMemberNo());
		return ResponseEntity.ok(member);
	}

	// 회원정보 수정 페이지로 이동
	@GetMapping("updateInfo")
	public String updateInfo() {

		return "mypage/updateInfo";
	}

	// 비밀번호 변경 페이지로 이동
	@GetMapping("changePw")
	public String ChangePw() {

		return "mypage/changePw";
	}
	
	/** 비밀번호 변경
	 * @param loginMember
	 * @param requestData
	 * @return
	 */
	@PostMapping("changePw")
	@ResponseBody
	public int ChangePw(@SessionAttribute("loginMember") Member loginMember,
						   @RequestBody Map<String, String> requestData) {
		// 네이버 로그인 사용자는 비밀번호 변경 불가
        if("Y".equals(loginMember.getNaverFl())) {
            return -1; // 네이버 사용자 오류 코드
        }
        
        String newPassword = requestData.get("newPassword");
        int memberNo = loginMember.getMemberNo();
        
        return service.changePw(memberNo, newPassword);
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
	
	/** 회원 탈퇴 진행
	 * @param requestMap
	 * @param loginMember
	 * @return
	 */
	@PostMapping("membershipOut")
	@ResponseBody
	public ResponseEntity<Integer> membershipOut(@RequestBody Map<String, String> requestMap,
	        @SessionAttribute("loginMember") Member loginMember,
	        HttpServletResponse response, SessionStatus status) {

	    try {
	        int result = 0;
	        String memberOutPw = requestMap.get("memberOutPw");

	        // 네이버 로그인 사용자인 경우
	        if("Y".equals(loginMember.getNaverFl())) {
	            // 바로 회원 탈퇴 처리
	            result = service.membershipNaverOut(loginMember.getMemberNo());
	            
	        } else {
	            // 일반 회원인 경우 비밀번호 검증 후 탈퇴
	            if(memberOutPw != null) {
	            	// 비밀번호 확인
	        	   int check = service.memberPwCheck(memberOutPw, loginMember.getMemberNo());
	        	   if(check > 0) {
	                   // 비밀번호 일치하면 탈퇴 처리
	                   result = service.membershipOut(loginMember.getMemberNo());
	               } else {
	                   // 비밀번호 불일치
	                   return ResponseEntity.ok(-1);
	               }
	            }
	        }

	        if(result > 0) {
	            // 탈퇴 성공 시 세션 무효화
	        	// Access Token 쿠키 삭제
	        	// Access Token 쿠키 삭제
	        	Cookie accessTokenCookie = new Cookie("Access-Token", "");
	        	accessTokenCookie.setHttpOnly(true);  // HttpOnly 설정 추가
	        	accessTokenCookie.setSecure(false);   // 원래 설정과 동일하게
	        	accessTokenCookie.setMaxAge(0);
	        	accessTokenCookie.setPath("/");
	        	response.addCookie(accessTokenCookie);

	        	// Refresh Token 쿠키도 삭제
	        	Cookie refreshTokenCookie = new Cookie("Refresh-Token", "");
	        	refreshTokenCookie.setHttpOnly(true);  // HttpOnly 설정 추가
	        	refreshTokenCookie.setSecure(false);   // 원래 설정과 동일하게
	        	refreshTokenCookie.setMaxAge(0);
	        	refreshTokenCookie.setPath("/api/auth/refresh");  // 원래 path와 동일하게
	        	response.addCookie(refreshTokenCookie);

				status.setComplete();
				
				
	            return ResponseEntity.ok(1);
	        }

	        // 탈퇴 실패
	        return ResponseEntity.ok(0);

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
	
	// 비밀번호 변경 페이지로 이동
	@GetMapping("checkPw")
	public String CheckPw() {

		return "mypage/checkPw";
	}

}
