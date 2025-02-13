package edu.kh.project.notice.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.notice.model.dto.Notice;

@Mapper
public interface NoticeMapper {

	/** 최근 공지사항 4개 가져오기
	 * @return
	 */
	List<Notice> getRecentNotices();

	/** 공지사항 상세
	 * @param noticeId
	 * @return
	 */
	Notice detailNotice(int noticeId);

	/** 공지사항 전체 조회
	 * @return
	 */
	List<Notice> selectNoticeList(Map<String, Object> paramMap);

}
