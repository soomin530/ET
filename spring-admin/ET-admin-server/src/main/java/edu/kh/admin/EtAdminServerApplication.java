package edu.kh.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class EtAdminServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(EtAdminServerApplication.class, args);
	}

}
