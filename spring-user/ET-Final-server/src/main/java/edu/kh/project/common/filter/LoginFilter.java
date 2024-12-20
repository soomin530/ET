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

		// ServletRequest : HttpServletRequest 의 부모 타입
		// ServletResponse : HttpServletResponse의 부모 타입

		// Session 필요함 -> loginMember가 Session에 담김

		// HTTP 통신이 가능한 자식형태로 다운 캐스팅
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;

		// 현재 요청의 URI를 가져옴
		String path = req.getRequestURI();

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
			// /loginError 재요청
			// resp를 이용해서 원하는 곳으로 리다이렉트
			resp.sendRedirect("/loginError");

		} else {
			// 로그인이 되어 있는 경우

			// FilterChain
			// - 다음 필터 또는 Dispatcher Servlet과 연결된 객체

			// 다음 필터로 요청/응답 객체 전달
			// 다음 필터가 없으면 Dispatcher Servlet으로 request, response 전달
			chain.doFilter(request, response);
		}

	}
}
