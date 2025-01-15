package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.Announcement;
import edu.kh.admin.main.model.dto.ConcertManager;
import edu.kh.admin.main.model.dto.Inquiry;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.mapper.AnnouncementMapper;
import edu.kh.admin.main.model.mapper.ConcertManagerMapper;
import edu.kh.admin.main.model.mapper.InquiryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
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
