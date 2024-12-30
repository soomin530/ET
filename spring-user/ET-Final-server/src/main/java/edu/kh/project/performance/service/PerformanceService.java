package edu.kh.project.performance.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.dto.PerformanceRanking;
import edu.kh.project.performance.model.dto.ScheduleInfo;

public interface PerformanceService {

	/**장르별 공연 목록 조회
	 * @param genre
	 * @return
	 * @author 우수민
	 */
	List<Performance> getPerformancesByGenre(String genre);
	
	/** 장르별 공연 목록 조회 무한 스크톨
	 * @param page
	 * @param pageSize
	 * @param genre
	 * @return
	 */
	List<Performance> getPerformancesByPage(int page, int pageSize, String genre);

	/** 공연 상세페이지 조회
	 * @param mt20id
	 * @return
	 * @author 우수민
	 */
	Performance getPerformanceById(String mt20id);

	/** 스케줄 및 잔여 좌석 조회
	 * @param mt20id
	 * @return
	 * @author 우수민
	 */
	Map<String, List<ScheduleInfo>> getScheduleWithAvailableSeats(String mt20id);

	/** 메인 페이지 주요 공연 소개
	 * @return
	 */
	List<Performance> mainPerform();

	/** 상위 10개 공연 가져오기
	 * @return
	 */
	List<PerformanceRanking> performanceRanking();
	
	/** 공연관리자가 등록한 공연 목록 조회 
	 * @param memberNo
	 * @return
	 * @author 우수민
	 */
	List<Performance> getPerformancesByManager(int memberNo);


}
