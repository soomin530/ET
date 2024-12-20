package edu.kh.project.common.interceptor;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;


import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
 * Interceptor : 요청/응답/뷰 완성 후 가로채는 객체(Spring 지원)
 * 
 * * HandlerInterceptor 인터페이스를 상속 받아서 구현 해야 한다
 * 
 * - preHandle (전처리) : Dispatcher Servlet -> Controller 사이에 수행
 * 
 * - postHandle (후처리) : Controller -> Dispatcher Servlet 사이에 수행
 * 
 * - afterCompletion (뷰 완성(forward 코드 해석) 후) : View Resolver -> Dispatcher Servlet 사이에 수행
 * 
 * */



public class BoardTypeInterceptor implements HandlerInterceptor {
	
	
	
}
