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

	/** 공지사항 목록 조회 (페이징, 검색 포함)
     * @param offset 시작 위치
     * @param limit 조회할 개수
     * @param searchQuery 검색어
     * @param searchType 검색 유형
     * @return List<Notice>
     */
    List<Notice> getNoticeList(int offset, int limit, String searchQuery, String searchType);

}
