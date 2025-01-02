package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.Announcement;
import edu.kh.admin.main.model.dto.ConcertManager;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.mapper.AnnouncementMapper;
import edu.kh.admin.main.model.mapper.ConcertManagerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class AnnouncementServiceImpl implements AnnouncementService{

		private final AnnouncementMapper mapper;

		// 초기 목록 띄우기
		@Override
		public List<Announcement> showAnnouncementList() {
			return mapper.showAnnouncementList();
			
		}
		
		// 검색 찾기
		@Override
		public int upload(String title, String content) {
			return mapper.upload(title,content);
		}
		
		// 상세 목록 띄우기
		@Override
		public List<Announcement> announcementDetail(int announceNo) {
		return mapper.announceDetail(announceNo);
		}
	
}
