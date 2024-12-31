package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.Announcement;
import edu.kh.admin.main.model.dto.ConcertManager;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.mapper.AnnouncementDetailMapper;
import edu.kh.admin.main.model.mapper.ConcertManagerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class AnnouncementDetailServiceImpl implements AnnouncementDetailService{

		private final AnnouncementDetailMapper mapper;

		@Override
		public List<Announcement> showAnnouncementList() {
			return mapper.showAnnouncementList();
			
		}
		
		
		
		
		
		
		
		
		
		
		
		@Override
		public int upload(String title, String content) {
			return mapper.upload(title,content);
		}
		
	
}
