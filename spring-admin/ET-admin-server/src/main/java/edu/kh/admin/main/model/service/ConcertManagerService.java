package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.ConcertManager;


public interface ConcertManagerService {

	/** 업체계정 신청 목록 조회
	 * @return
	 */
	List<ConcertManager> managerEnrollList();

	/** 검색된 업체 계정 신청 목록 조회
	 * @param formdata
	 * @return
	 */
	List<ConcertManager> searchManagerEnrollList(Map<String, Object> formdata);

	/** 업체계정 신청 상세
	 * @param concertManagerNo
	 * @return
	 */
	List<ConcertManager> concertManagerDetail(int concertManagerNo);

	/** 계정 요청 수락
	 * @param concertManagerNo
	 * @return
	 */
	int agree(int concertManagerNo);

	/** 계정 삭제
	 * @param concertManagerNo
	 * @return
	 */
	int delete(int concertManagerNo);


	
}
