package edu.kh.admin.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.admin.main.model.dto.Inquiry;

@Mapper
public interface InquiryMapper {


	List<Inquiry> showInquiryList(Map<String, Object> formData);

	List<Inquiry> inquiryDetail(int inquiryNo);

	int reply(Map<String, Object> formData);

	List<Inquiry> searchInquiryList(Map<String, Object> formData);



}
