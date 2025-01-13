package edu.kh.project.search.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.search.model.dto.SearchResultDTO;
import edu.kh.project.search.model.mapper.SearchMapper;
import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService{

	private final SearchMapper mapper;
	
	public SearchResultDTO searchAll(String keyword) {
		SearchResultDTO result = new SearchResultDTO();
        
        // 공연과 공지사항 검색
        result.setPerformances(mapper.searchPerformances(keyword));
        result.setNotices(mapper.searchNotices(keyword));
        
        return result;
    }
    
    public List<Map<String, Object>> getSuggestions(String keyword) {
        List<Map<String, Object>> suggestions = new ArrayList<>();
        
        // 공연 제목 자동완성
        suggestions.addAll(mapper.getPerformanceSuggestions(keyword));
        
        // 공지사항 제목 자동완성
        suggestions.addAll(mapper.getNoticeSuggestions(keyword));
        
        // 최대 10개로 제한
        return suggestions.stream()
                .limit(10)
                .collect(Collectors.toList());
    }
	
}
