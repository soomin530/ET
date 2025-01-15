package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.Inquiry;
import edu.kh.admin.main.model.mapper.InquiryMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class InquiryServiceImpl implements InquiryService{

		private final InquiryMapper mapper;
		
		@Override
		public List<Inquiry> showInquiryList(Map<String, Object> formData) {
		return mapper.showInquiryList(formData);
		}
		
		@Override
		public List<Inquiry> inquiryDetail(@Param("inquiryNo") int inquiryNo) {
		return mapper.inquiryDetail(inquiryNo);
		}
		
		@Override
		public int reply(Map<String, Object> formData) {
		return mapper.reply(formData);
		}
		
		@Override
		public List<Inquiry> searchInquiryList(Map<String, Object> formData) {
		return mapper.searchInquiryList(formData);
		}
		
		
	
}
