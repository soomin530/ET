package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.Performance;

public interface PerformanceService {


	/** 검색된 공연 정qh
	 * @param formdata
	 * @return
	 */
	List<Performance> searchPerformanceList(Map<String, Object> formdata);
	
	
}
