package edu.kh.project.notice.model.service;

import java.util.List;

import edu.kh.project.notice.model.dto.Notice;

public interface NoticeService {

	/** 최근 공지사항 4개 조회
	 * @return
	 */
	List<Notice> getRecentNotices();

	/** 공지사항 상세 조회
	 * @param noticeId
	 * @return
	 */
	Notice detailNotice(int noticeId);

}
