package edu.kh.project.search.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.kh.project.search.model.dto.SearchResultDTO;
import edu.kh.project.search.service.SearchService;
import lombok.RequiredArgsConstructor;

//SearchController.java
@Controller
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {	

    private final SearchService searchService;
    
    /** 통합 검색 결과 페이지
     * @param query
     * @param model
     * @return
     */
    @GetMapping("/searchResult/{query}")
    public String search(@PathVariable("query") String query, Model model) {
        SearchResultDTO results = searchService.searchAll(query);
        model.addAttribute("query", query);
        model.addAttribute("results", results);
        return "common/search-result";
    }

    
    /** 검색 자동완성 보이기
     * @param query
     * @return
     */
    @GetMapping("/suggestions/{query}")
    @ResponseBody
    public List<Map<String, Object>> getSuggestions(@PathVariable("query") String query) {
        return searchService.getSuggestions(query);
    }
    
}
