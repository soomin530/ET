package edu.kh.project.performance.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("performanceApi")
@RequiredArgsConstructor
@Slf4j
public class PerformanceApiController {
    
    @Autowired
    private PerformanceService performanceService;
    
    /** 무한 스크롤 데이터
     * @param page
     * @param genre
     * @return
     */
    @GetMapping("/genre/more")
    @ResponseBody
    public List<Performance> getMorePerformances(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "genre") String genre,
            @RequestParam(value = "filter") String filter) {
        int pageSize = 20;
        return performanceService.getPerformancesByPage(page, pageSize, genre, filter);
    }
    
    /** 관리자 공연 등록
     *  -> 공연장 이름 또는 주소 검색시 공연장 목록 가져오기
     * @param keyword
     * @return
     * @author 우수민
     */
    @GetMapping("/venue/list")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> venueListPerformances(
        @RequestParam(value="keyword", required = false) String keyword
    ) {
        try {
            // 모든 공연장 목록
            List<Map<String, Object>> allVenues = performanceService.getVenueList(); // 공연장 목록을 가져오는 메서드 필요
            
            // 검색어가 비어있지 않은 경우 필터링
           
            if (!keyword.isEmpty()) {
                allVenues = allVenues.stream()
                    .filter(venue ->     
                        String.valueOf(venue.get("FCLTYNM")).contains(keyword) || // 공연장 이름으로 검색
                        String.valueOf(venue.get("ADRES")).contains(keyword)	  // 주소로 검색
                    )
                    .collect(Collectors.toList());
            }
            
            
            return ResponseEntity.ok(allVenues);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
