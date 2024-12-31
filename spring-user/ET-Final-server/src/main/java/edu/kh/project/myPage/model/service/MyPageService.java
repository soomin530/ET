package edu.kh.project.myPage.model.service;

import edu.kh.project.member.model.dto.Member;

public interface MyPageService {
	
	/** 비밀번호 검증
     * @param memberPw : 입력한 비밀번호
     * @param memberNo : 회원 번호
     * @return result : 1(일치) / 0(불일치)
     */
    int verifyPassword(String memberPw, int memberNo);

    
    
	/** 회원정보 조회
	 * @param memberNo
	 * @return
	 */
	Member getMemberInfo(int memberNo);

	
	/** 이메일 중복 체크(수정)
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
