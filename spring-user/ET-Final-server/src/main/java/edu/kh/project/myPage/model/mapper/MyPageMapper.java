package edu.kh.project.myPage.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.member.model.dto.Member;

@Mapper
public interface MyPageMapper {
    
    /** 암호화된 비밀번호 조회
     * @param memberNo
     * @return encPw
     */
    String selectEncPw(int memberNo);

	/** 회원정보 조회
	 * @param memberNo
	 * @return
	 */
	Member getMemberInfo(int memberNo);

	/** 이메일 중복 체크
	 * @param verificationEmail
	 * @return
	 */
	int verifyEmail(String verificationEmail);

	/** 닉네임 중복검사(수정)
	 * @param userNickname
	 * @return
	 */
	int updateNickname(String userNickname);

	
}
