package edu.kh.admin.main.model.service;

import java.util.List;


import edu.kh.admin.main.model.dto.Member;

public interface AdminService {

	/** 모든 유저 정보 
	 * @return
	 */
	List<Member> showMemberList();

	
	
}
