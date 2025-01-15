package edu.kh.project.myPage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.Inquiry;
import edu.kh.project.myPage.service.MyPageService;
import edu.kh.project.performance.model.dto.Performance;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("mypageApi")
@SessionAttributes({ "loginMember" })
public class MyPageApiController {

	private final MyPageService service;
	
	@PostMapping("checkPreviousPassword")
	@ResponseBody
	public ResponseEntity<?> checkPreviousPassword(@RequestBody Map<String, Object> paramMap,
			@SessionAttribute("loginMember") Member loginMember) {
		try {
			String newPassword = (String) paramMap.get("newPassword");
			
			boolean isDuplicate = service.checkPreviousPassword(newPassword, loginMember.getMemberNo());
			
			// Map으로 응답 구조화
	        Map<String, Boolean> response = new HashMap<>();
	        response.put("isDuplicate", isDuplicate);
			
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("이전 비밀번호 조회중 오류 발생");
		}
	}

	/**
	 * 사용자 찜 목록 조회
	 * 
	 * @param page
	 * @param loginMember
	 * @return 찜 목록 Performance 리스트
	 */
	@GetMapping("items")
	@ResponseBody
	public List<Performance> getWishlistItems(@RequestParam(value = "page", defaultValue = "1") int page,
			@SessionAttribute("loginMember") Member loginMember) {
		return service.userWishList(page, loginMember.getMemberNo());
	}

	/**
	 * 찜 목록 삭제
	 * 
	 * @param request     삭제할 공연 ID 목록
	 * @param loginMember
	 * @return 성공 여부
	 */
	@PostMapping("delete")
	@ResponseBody
	public Map<String, Boolean> deleteWishlistItems(@RequestBody Map<String, List<String>> request,
			@SessionAttribute("loginMember") Member loginMember) {
		List<String> performanceIds = request.get("performanceIds");
		boolean success = service.deleteWishlistItems(performanceIds, loginMember.getMemberNo());

		Map<String, Boolean> response = new HashMap<>();
		response.put("success", success);
		return response;
	}
	
	
	/** 1:1 문의 내역 작성
	 * @param paramMap
	 * @param loginMember
	 * @return
	 */
	@PostMapping("inquiryWrite")
	@ResponseBody
	public ResponseEntity<?> inquiryWrite(@RequestBody Map<String, Object> paramMap,
			@SessionAttribute("loginMember") Member loginMember) {
		
		try {

			// 1:1 문의내역 작성
			boolean result = service.inquiryWrite(paramMap, loginMember.getMemberNo());
			
			// Map으로 응답 구조화
	        Map<String, Boolean> response = new HashMap<>();
	        response.put("success", result);
			
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("문의내역 저장중 오류 발생");
		}
		
	}
	
    /** 문의 내역 목록 조회
     * @param page
     * @param searchType
     * @param keyword
     * @param memberNo
     * @return
     */
    @GetMapping("/inquiryList")
    @ResponseBody
    public Map<String, Object> getInquiryList(
            @RequestParam(value="page", defaultValue = "1") int page,
            @RequestParam(value="searchType", defaultValue = "") String searchType,
            @RequestParam(value="keyword", defaultValue = "") String keyword,
            @SessionAttribute("loginMember") Member loginMember) {
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 페이징 처리를 위한 파라미터
            int itemsPerPage = 10;
            int offset = (page - 1) * itemsPerPage;
            
            // 검색 조건과 페이징을 포함한 조회
            List<Inquiry> inquiries = service.getInquiries(loginMember.getMemberNo(), searchType, keyword, offset, itemsPerPage);
            
            // 전체 개수 조회
            int totalCount = service.getInquiryCount(loginMember.getMemberNo(), searchType, keyword);
            int totalPages = (int) Math.ceil((double) totalCount / itemsPerPage);

            result.put("inquiries", inquiries);
            result.put("totalPages", totalPages);
            result.put("success", true);
            
        } catch (Exception e) {
        	e.printStackTrace();
            result.put("success", false);
            result.put("message", "문의 목록 조회 중 오류가 발생했습니다.");
        }
        
        return result;
    }

    /** 문의 내역 상세조회
     * @param inquiryNo
     * @param model
     * @return
     */
    @GetMapping("/inquiryDetail/{inquiryNo}")
    public String inquiryDetail(@PathVariable(value="inquiryNo") int inquiryNo, Model model) {
        Inquiry inquiry = service.getInquiryDetail(inquiryNo);
        model.addAttribute("inquiry", inquiry);
        return "myPage/memberInquirytDetail";
    }
    
    /** 해당 문의 사항 삭제
     * @param inquiryNo
     * @return
     */
    @PostMapping("/inquiryDelete/{inquiryNo}")
    @ResponseBody
    public Map<String, Object> deleteInquiry(@PathVariable(value="inquiryNo") int inquiryNo,
    		@SessionAttribute("loginMember") Member loginMember) {
        Map<String, Object> result = new HashMap<>();
        
        try {
        	// 문의 사항 삭제
            int deleteResult = service.deleteInquiry(inquiryNo, loginMember.getMemberNo());
            
            result.put("success", deleteResult > 0);
            
        } catch (Exception e) {
            result.put("success", false);
            
        }
        
        return result;
    }
	
	
}
