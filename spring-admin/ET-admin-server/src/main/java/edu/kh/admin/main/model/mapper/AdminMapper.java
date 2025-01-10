package edu.kh.admin.main.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.admin.main.model.dto.Announcement;

@Mapper
public interface AdminMapper {

	int memberCount();

	int performanceNowCount();

	int newInquiryCount();

	int newEnrollCount();

	


}
