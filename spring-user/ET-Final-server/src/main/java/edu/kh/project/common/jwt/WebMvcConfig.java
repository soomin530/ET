package edu.kh.project.common.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    private final JwtAuthenticationInterceptor jwtInterceptor;
    
    @Value("${my.performance.resource-handler}")
    private String resourceHandler;
    
    @Value("${my.performance.resource-location}")
    private String resourceLocation;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(resourceHandler)
                .addResourceLocations(resourceLocation)
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
    }
    
    public WebMvcConfig(JwtAuthenticationInterceptor jwtInterceptor) {
        this.jwtInterceptor = jwtInterceptor;
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://t1.kakaocdn.net")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
    
}