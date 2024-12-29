package edu.kh.admin.main.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Performance {
	private String performanceNo;
	private String performanceName;
	private String performanceStartDate;
	private String performanceEndDate;
	private String hall;
	private String cating;
	private String runtime;
	private String agency;
	private String ticketPrice;
	private String poster;
	private String performanceSchedule;
	private String area;
	private String genre;
	private String performanceState;
	private String performanceHallId;
}