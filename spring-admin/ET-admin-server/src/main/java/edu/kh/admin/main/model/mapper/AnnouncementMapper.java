package edu.kh.admin.main.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.admin.main.model.dto.Announcement;

@Mapper
public interface AnnouncementMapper {


	int upload(@Param("title") String title, @Param("content") String content);

	List<Announcement> showAnnouncementList();

	List<Announcement> announceDetail(int announceNo);



}
