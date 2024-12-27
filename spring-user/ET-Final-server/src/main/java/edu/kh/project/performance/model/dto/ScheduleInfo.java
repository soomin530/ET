package edu.kh.project.performance.model.dto;

import lombok.Data;

@Data
public class ScheduleInfo {
	
    private String time;
    private String round;
    private int seats;
    private String seatStatus;
    
}