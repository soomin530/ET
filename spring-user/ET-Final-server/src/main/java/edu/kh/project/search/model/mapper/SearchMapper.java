package edu.kh.project.search.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.notice.model.dto.Notice;
import edu.kh.project.performance.model.dto.Performance;

@Mapper
public interface SearchMapper {

	// 공연 검색
    List<Performance> searchPerformances(String keyword);
    
    // 공지사항 검색
    List<Notice> searchNotices(String keyword);
    
    // 공연 제목 자동완성
    List<Map<String, Object>> getPerformanceSuggestions(String keyword);
    
    // 공지사항 제목 자동완성
    List<Map<String, Object>> getNoticeSuggestions(String keyword);
	
}
