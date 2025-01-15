package edu.kh.admin.main.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminMapper {

	int memberCount();

	int performanceNowCount();

	int newInquiryCount();

	int newEnrollCount();

	


}
