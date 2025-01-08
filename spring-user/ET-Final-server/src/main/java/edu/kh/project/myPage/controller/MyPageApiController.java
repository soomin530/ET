package edu.kh.project.myPage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.service.MyPageService;
import edu.kh.project.performance.model.dto.Performance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@RequestMapping("mypageApi")
@Slf4j
@SessionAttributes({ "loginMember" })
public class MyPageApiController {

	private final MyPageService service;

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

}
