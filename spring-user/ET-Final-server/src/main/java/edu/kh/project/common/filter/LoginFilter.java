package edu.kh.project.common.filter;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;



//로그인이 되어있지 않은 경우 특정 페이지로 돌아가게함
public class LoginFilter implements Filter {

	// 필터 동작을 정의하는 메서드
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		// HTTP 통신이 가능한 자식형태로 다운 캐스팅
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;

		// 현재 요청의 URI를 가져옴
		String path = req.getRequestURI();
		
		// 로그인/회원가입 관련 경로는 필터링하지 않음
        if (path.equals("/perfmgr/login") || 
            path.equals("/perfmgr/signup") ||
            path.equals("/perfmgr/checkEmail") ||
            path.equals("/perfmgr/checkId") ||
            path.equals("/perfmgr/checkNickname")) {
            chain.doFilter(request, response);
            return;
        }

		// 요청 URI 가 "/myPage/profile/" 로 시작하는지 확인
		if (path.startsWith("/myPage/profile")) {
			// 필터를 통과하도록 함
			chain.doFilter(request, response);
			// 필터를 통과한 후 아래 코드를 수행하지 않도록 return
			return;
		}
		
		// Session 얻어오기
		HttpSession session = req.getSession();

		// 세션에서 로그인한 회원 정보를 얻어오기
		// 얻어왔으나, 없을 때 -> 로그인이 되어있지 않은 상태
		if (session.getAttribute("loginMember") == null) {
			resp.sendRedirect("/loginError");

		} else {
			chain.doFilter(request, response);
		}

	}
}
