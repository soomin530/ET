package edu.kh.project.notice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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
	
	
}
