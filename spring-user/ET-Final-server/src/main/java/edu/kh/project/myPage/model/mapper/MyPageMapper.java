package edu.kh.project.myPage.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;
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

	







	
}
