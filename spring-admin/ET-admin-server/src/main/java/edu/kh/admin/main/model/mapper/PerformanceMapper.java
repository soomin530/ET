package edu.kh.admin.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.admin.main.model.dto.Performance;

@Mapper
public interface PerformanceMapper {

	

	/** 공연장 정보 
	 * @return
	 */
	List<Performance> showPerformanceList();

	/** 검색된 공연 찾기
	 * @param formdata
	 * @return
	 */
	List<Performance> searchPerformanceList(Map<String, Object> formdata);
	
	/** 공연장 삽입
	 * @param formdata
	 * @return
	 */
	int insert(Map<String, Object> formdata);

	/** 디테일 페이지
	 * @param mt10id
	 * @return
	 */
	List<Performance> performanceDetailList(String mt10id);


}
