package edu.kh.project.notice.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.notice.model.dto.Notice;
import edu.kh.project.notice.model.mapper.NoticeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService{
	
	private final NoticeMapper mapper;
	
	
	// 최근 공지사항 4개 가져오기
	@Override
	public List<Notice> getRecentNotices() {
		return mapper.getRecentNotices();
	}


	// 공시 사항 상세
	@Override
	public Notice detailNotice(int noticeId) {
		return mapper.detailNotice(noticeId);
	}

}
