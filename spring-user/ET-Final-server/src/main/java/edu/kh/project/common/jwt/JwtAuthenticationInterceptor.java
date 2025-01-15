package edu.kh.project.common.jwt;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationInterceptor implements HandlerInterceptor {
    
    private final JwtTokenUtil jwtTokenUtil;
    
    public JwtAuthenticationInterceptor(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("Authorization");
        
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            
            if (jwtTokenUtil.validateToken(token)) {
                String memberNo = jwtTokenUtil.getMemberNoFromToken(token);
                request.setAttribute("memberNo", memberNo);
                return true;
            }
        }
        
        // 토큰이 없거나 유효하지 않은 경우
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }
}