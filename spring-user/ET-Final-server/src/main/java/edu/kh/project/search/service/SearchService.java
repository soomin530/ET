package edu.kh.project.search.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.search.model.dto.SearchResultDTO;

public interface SearchService {

	/** 통합 검색
	 * @param query
	 * @return
	 */
	SearchResultDTO searchAll(String query);

	/** 검색 결과 자동생성
	 * @param query
	 * @return
	 */
	List<Map<String, Object>> getSuggestions(String query);

}
