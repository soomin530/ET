package edu.kh.project.notice.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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


	@Override
    public List<Notice> getNoticeList(int offset, int limit, String searchQuery, String searchType) {
        Map<String, Object> params = new HashMap<>();
        params.put("offset", offset);
        params.put("limit", limit);
        params.put("searchQuery", searchQuery);
        params.put("searchType", searchType);
        
        return mapper.selectNoticeList(params);
    }

}
