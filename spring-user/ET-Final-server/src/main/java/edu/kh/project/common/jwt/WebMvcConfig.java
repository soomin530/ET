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
        System.out.println("=== Resource Properties in WebMvcConfig ===");
        System.out.println("From @Value resourceHandler: " + resourceHandler);
        System.out.println("From @Value resourceLocation: " + resourceLocation);
        System.out.println("From Environment resourceHandler: " + 
            env.getProperty("my.performance.resource-handler"));
        System.out.println("From Environment resourceLocation: " + 
            env.getProperty("my.performance.resource-location"));
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    	System.out.println("Resource Handler: " + resourceHandler);
        System.out.println("Resource Location: " + resourceLocation);
        
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