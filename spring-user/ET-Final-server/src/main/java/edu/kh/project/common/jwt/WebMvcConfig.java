package edu.kh.project.common.jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
   
   private final JwtAuthenticationInterceptor jwtInterceptor;
   
   @Value("${my.performance.resource-handler}")
   private String resourceHandler;
   
   @Value("${my.performance.resource-location}")
   private String resourceLocation;
   
   @Autowired
   private Environment env;
   
   @PostConstruct
   public void checkProperties() {
       log.info("=== Resource Properties in WebMvcConfig ===");
       log.info("From @Value resourceHandler: {}", resourceHandler);
       log.info("From @Value resourceLocation: {}", resourceLocation);
       log.info("From Environment resourceHandler: {}", 
           env.getProperty("my.performance.resource-handler"));
       log.info("From Environment resourceLocation: {}", 
           env.getProperty("my.performance.resource-location"));
   }
   
   @Override
   public void addResourceHandlers(ResourceHandlerRegistry registry) {
       log.info("Resource Handler: {}", resourceHandler);
       log.info("Resource Location: {}", resourceLocation);
       
       registry.addResourceHandler("/images/performance/**")
               .addResourceLocations("file:/home/ec2-user/uploadFiles/performance/")
               .setCachePeriod(3600)
               .resourceChain(true)
               .addResolver(new PathResourceResolver());

       // 기본 정적 리소스 처리
       registry.addResourceHandler("/static/**")
               .addResourceLocations("classpath:/static/");
       
       // 로그로 설정된 경로 확인
       log.info("정적 리소스 설정 완료");
   }
   
   public WebMvcConfig(JwtAuthenticationInterceptor jwtInterceptor) {
       this.jwtInterceptor = jwtInterceptor;
   }
   
   @Override
   public void addCorsMappings(CorsRegistry registry) {
       registry.addMapping("/**")
               .allowedOrigins(
                   "https://t1.kakaocdn.net",
                   "http://modeunticket.store",
                   "http://43.202.85.129"
               )
               .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
               .allowedHeaders("*")
               .allowCredentials(true)
               .maxAge(3600);
       
       log.info("CORS 설정 완료");
   }
}