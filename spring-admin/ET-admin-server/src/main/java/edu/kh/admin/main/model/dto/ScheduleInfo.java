package edu.kh.admin.main.model.dto;

import lombok.Data;

@Data
public class ScheduleInfo {
	
    private String time;
    private int seats;
    private String seatStatus;
    
}