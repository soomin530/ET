package edu.kh.project.notice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.kh.project.notice.model.dto.Notice;
import edu.kh.project.notice.model.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("notice")
@RequiredArgsConstructor
@Slf4j
public class NoticeController {
    
    private final NoticeService service;
    
    /** 공지사항 상세 조회
     * @param noticeId
     * @return
     */
    @GetMapping("detail/{noticeId}")
    @ResponseBody
    public Notice getMethodName(@PathVariable("noticeId") int noticeId) {
        return service.detailNotice(noticeId);
    }
    
    /** 공지사항 목록 페이지 로드
     * @param model
     * @return
     */
    @GetMapping("/list")
    public String getNoticeList(Model model) {
        // 초기 공지사항 목록 로드 (첫 페이지)
        List<Notice> list = service.getNoticeList(0, 10, null, "all");
        model.addAttribute("noticeList", list);
        
        return "/notice/noticeList";
    }
    
    /** 공지사항 무한스크롤 데이터 로드
     * @param page
     * @param limit
     * @param searchQuery
     * @param searchType
     * @return
     */
    @GetMapping("/api/load")
    @ResponseBody
    public Map<String, Object> loadMoreNotices(
            @RequestParam(value="page", defaultValue = "1") int page,
            @RequestParam(value="limit", defaultValue = "10") int limit,
            @RequestParam(value="searchQuery", required = false) String searchQuery,
            @RequestParam(value="searchType", defaultValue = "all") String searchType) {
        
        // 페이지네이션을 위한 offset 계산
        int offset = (page - 1) * limit;
        
        // 검색 조건에 따른 공지사항 조회
        List<Notice> notices = service.getNoticeList(offset, limit, searchQuery, searchType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("notices", notices);
        response.put("hasMore", notices.size() >= limit);
        
        return response;
    }
}