package edu.kh.admin.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.admin.main.model.dto.Announcement;

@Mapper
public interface AnnouncementMapper {

	int upload(@Param("title") String title, @Param("content") String content);

	List<Announcement> showAnnouncementList();

	List<Announcement> announceDetail(int announceNo);

	int update(@Param("title") String title, @Param("content") String content, @Param("announceNo") String announceNo);

	int delete(int announceNo);

	List<Announcement> searchAnnouncementList(Map<String, Object> formdata);


}
