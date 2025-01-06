package edu.kh.project.statistics.service;

import java.util.List;

import edu.kh.project.statistics.model.dto.Statistics;

public interface StatisticsBatchService {

	/** 지난달 통계 데이터 조회
	 * @return
	 */
	List<Statistics> getStatList();

}
