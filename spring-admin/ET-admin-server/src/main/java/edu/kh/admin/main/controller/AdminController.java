package edu.kh.admin.main.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.admin.common.jwt.JwtTokenUtil;
import edu.kh.admin.main.model.dto.DashboardData;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.service.AdminService;
import edu.kh.admin.main.model.service.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "https://final-project-react-individual.vercel.app", allowedHeaders = "*", allowCredentials = "true", methods = {
		RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
@RequestMapping("admin")
@RequiredArgsConstructor
@SessionAttributes({ "loginMember" })
public class AdminController {

	private final JwtTokenUtil jwtTokenUtil;
	
	private final MemberService memberService;
	
	private final AdminService adminService;
	
	/** 리프레시 토큰 가져와서 엑세스 토큰 생성
	 * @param request
	 * @param resp
	 * @return
	 */
	@PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse resp) {
        try {
        	// Refresh Token 추출
			String refreshToken = extractRefreshToken(request.getCookies());
        	
            // 리프레시 토큰 검증
            // 새로운 액세스 토큰 생성
            String newAccessToken = jwtTokenUtil.regenerateAccessToken(refreshToken);
            
            return ResponseEntity.ok()
                .body(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
	
	/** 관리자 인지 확인
	 * @param memberEmail
	 * @return
	 */
	@GetMapping("/check")
    public ResponseEntity<?> checkAdminStatus(@RequestParam(value="memberEmail") String memberEmail,
    		@RequestParam(value="memberNo") String memberNo) {
        // memberEmail로 DB에서 회원 조회
        Member member = memberService.findByEmail(memberEmail, memberNo);
        
        // 관리자 여부 확인 (memberAuth == 2)
        boolean isAdmin = member != null && member.getMemberAuth() == 2;
        
        return ResponseEntity.ok()
            .body(Map.of("isAdmin", isAdmin));
    }
	
	/**
	 * 쿠키에서 Refresh Token 추출
	 */
	private String extractRefreshToken(Cookie[] cookies) {
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("Refresh-Token".equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}
	
	@GetMapping("data")
	private ResponseEntity<?> getData(){
		List<DashboardData> data = adminService.getData();
		
		try {
			return ResponseEntity.status(HttpStatus.OK).body(data);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
		}
	}
	
	
	
}
