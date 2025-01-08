package edu.kh.project.statistics.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.statistics.model.dto.Statistics;

@Mapper
public interface StatisticsBatchMapper {

	/** 통계 데이터 배치 정보 저장
	 * @param statisticsList
	 * @return
	 */
	void saveStatistics(Statistics statistics);

	/** 지난달 통계 데이터 조회
	 * @return
	 */
	List<Statistics> getStatList();

	/** 종료된 공연 상태 업데이트
	 * @return
	 */
	int updateExpiredPerformances();

	/** 시작된 공연 상태 업데이트
	 * @return
	 */
	int updateStartedPerformances();

	/** 공연 리뷰 평점 업데이트
	 * @return
	 */
	int updatePerformanceReviewRanks();

}
