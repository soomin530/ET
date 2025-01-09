package edu.kh.project.myPage.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;
import edu.kh.project.myPage.model.dto.Inquiry;
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
	
	/** 이전 패스워드 비교
	 * @param newPassword
	 * @return
	 */
	boolean checkPreviousPassword(String newPassword, int memberNo);
	
	/** 1:1 문의 작성
	 * @param paramMap
	 * @param memberNo
	 * @return
	 */
	boolean inquiryWrite(Map<String, Object> paramMap, int memberNo);
	
	/** 문의 내역 목록 조회
	 * @param memberNo
	 * @param searchType
	 * @param keyword
	 * @param offset
	 * @param itemsPerPage
	 * @return
	 */
	List<Inquiry> getInquiries(int memberNo, String searchType, String keyword, int offset, int itemsPerPage);

	/** 문의 내역 목록 개수 조회
	 * @param memberNo
	 * @param searchType
	 * @param keyword
	 * @return
	 */
	int getInquiryCount(int memberNo, String searchType, String keyword);

	/** 문의 내역 상세 조회
	 * @param inquiryNo
	 * @return
	 */
	Inquiry getInquiryDetail(int inquiryNo);
	
	/** 해당 문의 사항 삭제
	 * @param inquiryNo
	 * @param memberNo
	 * @return
	 */
	int deleteInquiry(int inquiryNo, int memberNo);

	/** 예매 내역 조회
	 * @param memberNo
	 * @return
	 */
	List<ticketInfoDTO> getBookingHistory(int memberNo);

	/** 예매 내역 상세 조회
	 * @param bookingId
	 * @param memberNo
	 * @return
	 */
	ticketInfoDTO getBookingDetail(String bookingId, int memberNo);






	
}
