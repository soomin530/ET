package edu.kh.project.performance.service;

import java.util.List;

import edu.kh.project.performance.model.dto.Performance;

public interface PerformanceService {

	/**장르별 공연 목록 조회
	 * @param genre
	 * @return
	 * @author 우수민
	 */
	List<Performance> getPerformancesByGenre(String genre);

}
