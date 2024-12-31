package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.Announcement;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.dto.Performance;

public interface AnnouncementDetailService {

	/** 모든 공지사항 정보 
	 * @return
	 */
	List<Announcement> showAnnouncementList();
	
	
	
	/** 내용 업로드 메서드
	 * @param title
	 * @param content
	 * @return 
	 */
	int upload(String title, String content);

	
}
