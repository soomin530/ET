package edu.kh.admin.main.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.admin.main.model.dto.Member;

@Mapper
public interface AdminMapper {

	/** 모든 유저 정보
	 * @return
	 */
	List<Member> showMemberList();

}
