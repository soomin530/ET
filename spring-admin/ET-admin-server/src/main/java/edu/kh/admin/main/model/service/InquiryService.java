package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.Inquiry;

public interface InquiryService {

	/** 문의사항 찾기
	 * @param formData 
	 * @return
	 */
	List<Inquiry> showInquiryList(Map<String, Object> formData);

	/** 문의사항 상세 페이지
	 * @param inquiryNo
	 * @return
	 */
	List<Inquiry> inquiryDetail(int inquiryNo);

	/** 답글 달기
	 * @param formData
	 * @return
	 */
	int reply(Map<String, Object> formData);

	/** 검색한 문의사항 찾기
	 * @param formData
	 * @return
	 */
	List<Inquiry> searchInquiryList(Map<String, Object> formData);

	/** 문의 삭제
	 * @param inquiryNo
	 * @return
	 */
	int delete(int inquiryNo);



	
}
