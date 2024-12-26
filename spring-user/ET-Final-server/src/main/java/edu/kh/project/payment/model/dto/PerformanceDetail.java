package edu.kh.project.payment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class PerformanceDetail {
	
	private String performanceName;
	private String performanceFrom;
	private String performanceTo;
	private String facilityName;
	private String performanceRuntime;
	private String poster;
}
