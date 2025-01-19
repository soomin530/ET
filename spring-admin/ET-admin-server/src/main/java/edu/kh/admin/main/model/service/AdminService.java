package edu.kh.admin.main.model.service;

import java.util.List;

import edu.kh.admin.main.model.dto.DashboardData;

public interface AdminService {

	/** 대시보드 관련 정보 얻기
	 * @return
	 */
	List<DashboardData> getData();

	

	
}
