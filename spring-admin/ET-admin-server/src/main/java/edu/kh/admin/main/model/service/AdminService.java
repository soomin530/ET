package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.Member;

public interface AdminService {

	/** 모든 유저 정보 
	 * @return
	 */
	List<Member> showMemberList();

	/** 검색된 유저 정보
	 * @param formdata
	 * @return
	 */
	List<Member> searchShowMemberList(Map<String, Object> formdata);

	
	
}
