package edu.kh.project.myPage.service;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;

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


	/** 비밀번호 변경
	 * @param memberNo
	 * @param newPassword
	 * @return
	 */
	int changePw(int memberNo, String newPassword);

	
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

	
	/** 회원 비밀번호 비교
	 * @param memberPw
	 * @param memberPw2
	 * @return
	 */
	int memberPwCheck(String memberPw, int memberNo);
	
	
	/** 네이버 회원 삭제
	 * @param memberNo
	 * @return
	 */
	int membershipNaverOut(int memberNo);
	
	
	/** 회원 탈퇴 처리
	 * @param memberNo
	 * @return
	 */
	int membershipOut(int memberNo);


	/** 회원 정보 수정
	 * @param member
	 * @return
	 */
	int updateMember(Member member);


	/** 배송지 추가
	 * @param addressDTO
	 */
	int addAddress(AddressDTO addressDTO);
	
	
	
	
	
	
	
	

}
