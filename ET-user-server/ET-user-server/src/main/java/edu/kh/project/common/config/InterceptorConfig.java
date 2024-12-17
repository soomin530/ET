package edu.kh.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import edu.kh.project.common.interceptor.BoardTypeInterceptor;
import lombok.RequiredArgsConstructor;

// 인터셉터가 어떤 요청을 가로챌지 설정하는 클래스

@Configuration // 서버가 켜지면 내부 메서드를 모두 수행
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer {
	
	
	
}
