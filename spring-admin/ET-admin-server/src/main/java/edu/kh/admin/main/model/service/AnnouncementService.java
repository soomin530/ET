package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.Announcement;

public interface AnnouncementService {

	/** 모든 공지사항 정보 
	 * @return
	 */
	List<Announcement> showAnnouncementList();
	
	
	/** 상세 내용 정보
	 * @param announceNo
	 * @return
	 */
	List<Announcement> announcementDetail(int announceNo);
	
	/** 내용 업로드 메서드
	 * @param title
	 * @param content
	 * @return 
	 */
	int upload(String title, String content);



	/** 내용 수정 메서드
	 * @param title
	 * @param content
	 * @param announceNo
	 * @return
	 */
	int update(String title, String content, String announceNo);


	/** 공지사항 삭제
	 * @param announceNo
	 * @return
	 */
	int delete(int announceNo);
 

	/** 검색한 글들 찾기
	 * @param formdata 
	 * @return
	 */
	List<Announcement> searchAnnouncementList(Map<String, Object> formdata);


	
}
