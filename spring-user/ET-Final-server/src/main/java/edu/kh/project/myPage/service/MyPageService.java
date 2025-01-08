package edu.kh.project.myPage.service;

import java.util.List;

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

	
	
	
	/** 배송지 목록 조회(로드) 
	 * @param memberNo
	 * @return
	 */
	List<AddressDTO> getAddressList(int memberNo);
	
	
	
	/** 배송지 추가
	 * @param addressDTO
	 */
	int addAddress(AddressDTO addressDTO);


	/** 주소 개수 체크
	 * @param memberNo
	 * @return
	 */
	int getAddressCount(int memberNo);


	/** 기본 배송지 등록하기
	 * @param addressNo
	 * @param memberNo
	 * @return
	 */
	int basicAddress(int addressNo, int memberNo);


	/** 중복 주소 체크
	 * @param addressDTO
	 * @param memberNo
	 * @return
	 */
	boolean isAddressDuplicated(AddressDTO addressDTO, int memberNo);




	/** 배송지 수정
	 * @param addressDTO
	 * @return
	 */
	int updateAddress(AddressDTO addressDTO);


	/** 배송지 데이터 가져오기 (수정 모달에 사용)
	 * @param addressNo
	 * @return
	 */
	AddressDTO getAddress(int addressNo);


	/** 배송지 삭제
	 * @param addressNo
	 * @param memberNo
	 * @return
	 */
	int deleteAddress(int addressNo, int memberNo);
	


	

}
