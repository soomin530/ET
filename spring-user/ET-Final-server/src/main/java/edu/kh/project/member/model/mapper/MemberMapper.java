package edu.kh.project.member.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	/** 로그인 진행
	 * @param memberId
	 * @return
	 */
	Member login(String memberId);

	/** 이메일 중복 체크
	 * @param memberEmail
	 * @return
	 */
	int checkEmail(String memberEmail);

	/** 아이디 중복 체크
	 * @param memberId
	 * @return
	 */
	int checkId(String memberId);

	/** 닉네임 중복 체크
	 * @param memberNickname
	 * @return
	 */
	int checkNickname(String memberNickname);

	/** 회원가입 서비스
	 * @param inputMember
	 * @return
	 */
	int signup(Member inputMember);

	void insertVenue(Map<String, Object> venue);

	void insertPerf(Map<String, Object> perfMap);

}
