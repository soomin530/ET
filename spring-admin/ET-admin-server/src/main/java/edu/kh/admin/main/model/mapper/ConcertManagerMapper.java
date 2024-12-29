package edu.kh.admin.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.admin.main.model.dto.ConcertManager;


@Mapper
public interface ConcertManagerMapper {

	/** 업체계정 신청 목록 조회
	 * @return
	 */
	List<ConcertManager> managerEnrollList();

	/** 검색된 업체계정 신청 목록 조회
	 * @param formdata
	 * @return
	 */
	List<ConcertManager> searchManagerEnrollList(Map<String, Object> formdata);



}
