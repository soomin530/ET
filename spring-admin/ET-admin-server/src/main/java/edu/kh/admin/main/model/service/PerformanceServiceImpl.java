package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.dto.Performance;
import edu.kh.admin.main.model.mapper.PerformanceMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class PerformanceServiceImpl implements PerformanceService{

		private final PerformanceMapper mapper;
		private final BCryptPasswordEncoder bcrypt;
		
		@Override
		public List<Performance> showPerformanceList() {
		return mapper.showPerformanceList();
		}
		
		@Override
		public List<Performance> searchPerformanceList(Map<String, Object> formdata) {
			return  mapper.searchPerformanceList(formdata);
		}
		
		@Override
		public int insert(Map<String, Object> formdata) {
		return mapper.insert(formdata);
		}
		
		@Override
		public List<Performance> performanceDetailList(String mt10id) {
		return mapper.performanceDetailList(mt10id);
		}
}
