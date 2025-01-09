package edu.kh.project.myPage.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;
import edu.kh.project.myPage.model.dto.Inquiry;
import edu.kh.project.myPage.model.dto.ticketInfoDTO;
import edu.kh.project.performance.model.dto.Performance;

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
	
	/** 비밀번호 변경
	 * @param paramMap
	 * @return
	 */
	int changePw(Map<String, Object> paramMap);

	/** 회원 탈퇴 처리
	 * @param memberNo
	 * @return
	 */
	int membershipOut(int memberNo);
	
	/** 네이버 회원 삭제
	 * @param memberNo
	 * @return
	 */
	int membershipNaverOut(int memberNo);

	/** 해당 회원 비밀번호 조회
	 * @param memberNo
	 * @return
	 */
	String memberPwCheck(int memberNo);

	/** 회원정보 수정
	 * @param member
	 * @return
	 */
	int updateMember(Member member);
	
	/** 사용자 찜 목록 조회
	 * @param offset
	 * @param pageSize
	 * @param memberNo
	 * @return
	 */
	List<Performance> userWishList(@Param("offset") int offset, 
			@Param("pageSize") int pageSize, 
			@Param("memberNo") int memberNo);
	
	/** 찜한 내역 삭제
	 * @param paramMap
	 * @return
	 */
	int deleteWishlistItems(Map<String, Object> paramMap);
	
	/** 1:1 문의 작성
	 * @param paramMap
	 * @return
	 */
	int inquiryWrite(Map<String, Object> paramMap);
	
	/** 문의 내역 목록 조회
	 * @param paramMap
	 * @return
	 */
	List<Inquiry> getInquiries(Map<String, Object> paramMap);

	/** 문의 내역 목록 개수 조회
	 * @param paramMap
	 * @return
	 */
	int getInquiryCount(Map<String, Object> paramMap);

	/** 문의 내역 상세 조회
	 * @param inquiryNo
	 * @return
	 */
	Inquiry getInquiryDetail(int inquiryNo);
	
	/** 해당 문의 사항 삭제
	 * @param paramMap
	 * @return
	 */
	int deleteInquiry(Map<String, Object> paramMap);

	/** 예약 내역 조회
	 * @param memberNo
	 * @return
	 */
	List<ticketInfoDTO> selectBookingHistory(int memberNo);

	/** 예약 상세 내용 조회
	 * @param bookingId
	 * @param memberNo
	 * @return
	 */
	ticketInfoDTO selectBookingDetail(@Param("bookingId") String bookingId, @Param("memberNo") int memberNo);

	







	
	
	

	/** 배송지 목록 조회(로드)
	 * @param memberNo
	 * @return
	 */
	List<AddressDTO> selectAddressList(int memberNo);

	
	/** 배송지 추가
	 * @param addressDTO
	 * @return
	 */
	int insertAddress(AddressDTO addressDTO);

	
	/** 중복 주소 체크
	 * @param addressDTO
	 * @param memberNo
	 * @return
	 */
	int countDuplicateAddress(Map<String, Object> paramMap);
	
	/** 주소 개수 체크
	 * @param memberNo
	 * @return
	 */
	int getAddressCount(int memberNo);

	
	/**  기본 배송지 등록하기
	 * @param memberNo
	 */
	int resetBasicAddress(int memberNo);

	int basicAddress(Map<String, Object> paramMap);  // Map 형태로 매개변수 변경

	

	/** 배송지 수정
	 * @param addressDTO
	 * @return
	 */
	int updateAddress(AddressDTO addressDTO);

	/** 배송지 데이터 가져오기 (수정 모달에 사용)
	 * @param addressNo
	 * @return
	 */
	AddressDTO selectAddress(int addressNo);

	
	/** 배송지 삭제
	 * @param paramMap
	 * @return
	 */
	int deleteAddress(Map<String, Object> paramMap);



	
	/** TB_TICKET_SEAT에서 예약된 좌석 삭제
	 * @param bookingId
	 * @return
	 */
	int deleteTicketSeat(String bookingId);

	/** TB_PAYMENT의 결제 상태 업데이트
	 * @param bookingId
	 * @return
	 */
	int updatePaymentStatus(String bookingId);

	/** TB_TICKET_BOOKING의 예약 상태 업데이트
	 * @param bookingId
	 * @param memberNo
	 * @return
	 */
	int updateBookingStatus(@Param("bookingId") String bookingId, @Param("memberNo") int memberNo);

	/** TB_BOOKING_HISTORY의 예매 내역 상태 업데이트
	 * @param bookingId
	 * @return
	 */
	int updateHistoryStatus(String bookingId);

	



	
	
	
	

	
}
