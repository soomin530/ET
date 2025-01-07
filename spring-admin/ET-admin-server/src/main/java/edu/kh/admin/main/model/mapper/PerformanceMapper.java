package edu.kh.admin.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.admin.main.model.dto.Performance;

@Mapper
public interface PerformanceMapper {

	/** 검색된 공연 찾기
	 * @param formdata
	 * @return
	 */
	List<Performance> searchPerformanceList(Map<String, Object> formdata);



}
