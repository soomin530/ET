package edu.kh.project.member.service;

import java.util.Map;

import edu.kh.project.member.model.dto.Member;

public interface MemberService {

	/** 로그인 진행
	 * @param inputMember
	 * @return
	 */
	Member login(Member inputMember);

	/** 이메일 중복 체크
	 * @param memberEmail
	 * @return
	 */
	int checkEmail(String memberEmail);
	
	/** 아이디 중복 체크(비동기)
	 * @param memberId
	 * @return
	 */
	int checkId(String memberId);

	/** 이름 중복 체크(비동기)
	 * @param memberNickname
	 * @return
	 */
	int checkNickname(String memberNickname);

	/** 회원 가입
	 * @param inputMember
	 * @param memberAddress
	 * @return
	 */
	int signup(Member inputMember, String[] memberAddress);

	void insertVenue(Map<String, Object> venue);

	void insertPerf(Map<String, Object> perfMap);

}
