package edu.kh.project.myPage.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;
import edu.kh.project.myPage.model.dto.ticketInfoDTO;
import edu.kh.project.performance.model.dto.Performance;

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


	/** 배송지 등록
	 * @param addressDTO
	 */
	int addAddress(AddressDTO addressDTO);
	
	
	/** 찜한 목록 조회
	 * @param page
	 * @return
	 */
	List<Performance> userWishList(int page, int memberNo);
	
	
	/** 찜한 내역 삭제
	 * @param performanceIds
	 * @param memberNo
	 * @return
	 */
	boolean deleteWishlistItems(List<String> performanceIds, int memberNo);


	/** 예매 내역 조회
	 * @param memberNo
	 * @return
	 */
	List<Map<String, Object>> getBookingHistory(String bookingId, int memberNo);

	/** 예매 내역 상세 조회
	 * @param bookingId
	 * @param memberNo
	 * @return
	 */
	ticketInfoDTO getBookingDetail(String bookingId, int memberNo);


	


	


	
	
	
}
