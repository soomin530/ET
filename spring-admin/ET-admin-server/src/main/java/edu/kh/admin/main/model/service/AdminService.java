package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.Announcement;
import edu.kh.admin.main.model.dto.DashboardData;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.dto.Performance;

public interface AdminService {

	/** 대시보드 관련 정보 얻기
	 * @return
	 */
	List<DashboardData> getData();

	

	
}
