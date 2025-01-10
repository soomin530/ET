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
public class DashboardData {
	private String totalMember; // 총 회원 수
	private String performanceNow; // 진행 중인 공연
	private String newInquiry; // 신규 문의 
	private String newEnroll; // 업체계정 신청
}