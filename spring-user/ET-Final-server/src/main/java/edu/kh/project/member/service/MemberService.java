package edu.kh.project.member.service;

import edu.kh.project.member.model.dto.Member;

public interface MemberService {

	/** 로그인 진행
	 * @param inputMember
	 * @return
	 */
	Member login(Member inputMember);

}
