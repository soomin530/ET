package edu.kh.project.myPage.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;
import edu.kh.project.myPage.model.dto.Inquiry;
import edu.kh.project.myPage.model.dto.ticketInfoDTO;
import edu.kh.project.myPage.model.mapper.MyPageMapper;
import edu.kh.project.performance.model.dto.Performance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MyPageServiceImpl implements MyPageService {
	
	private final MyPageMapper mapper;

	private final BCryptPasswordEncoder bcrypt;

	// 비밀번호 인증
	@Override
	public int verifyPassword(String memberPw, int memberNo) {

		// DB에서 현재 회원의 암호화된 비밀번호 조회
		String encPw = mapper.selectEncPw(memberNo);

		// 비밀번호가 일치하면 1, 아니면 0 반환
		if (bcrypt.matches(memberPw, encPw)) {
			return 1;
		}
		return 0;
	}

	// 회원 정보 조회
	@Override
	public Member getMemberInfo(int memberNo) {

		return mapper.getMemberInfo(memberNo);
	}

	// 이메일 중복 체크
	@Override
	public int verifyEmail(String verificationEmail) {

		return mapper.verifyEmail(verificationEmail);
	}

	// 닉네임 중복검사(수정)
	@Override
	public int updateNickname(String userNickname) {

		return mapper.updateNickname(userNickname);
	}

	// 비밀번호 변경
	@Override
	public int changePw(int memberNo, String newPassword) {

		Map<String, Object> paramMap = new HashMap<>();

		String encPw = bcrypt.encode(newPassword);

		paramMap.put("encPw", encPw);
		paramMap.put("memberNo", memberNo);

		return mapper.changePw(paramMap);
	}

	// 회원 비밀번호 비교
	@Override
	public int memberPwCheck(String memberPw, int memberNo) {

		String checkPw = mapper.memberPwCheck(memberNo);

		if (bcrypt.matches(memberPw, checkPw)) {
			return 1;
		} else {
			return 0;
		}

	}
	
	// 현재 회원의 티켓 예매 내역 확인
	@Override
	public boolean checkTicketBookingExists(int memberNo) {
		int count = mapper.countTicketBookings(memberNo);
        return count > 0;
	}

	// 네이버 회원 삭제
	@Override
	public int membershipNaverOut(int memberNo) {
		return mapper.membershipNaverOut(memberNo);
	}

	// 회원 탈퇴 처리
	@Override
	public int membershipOut(int memberNo) {
		return mapper.membershipOut(memberNo);
	}

	// 회원 정보 수정
	@Override
	public int updateMember(Member member) {

		return mapper.updateMember(member);
	}
	
	
	
	// 배송지 목록 조회(로드)
	@Override
	public List<AddressDTO> getAddressList(int memberNo) {
			
	 return myPageMapper.selectAddressList(memberNo);
	 
    }
		
		
		
	// 배송지 추가
	@Autowired
    private MyPageMapper myPageMapper;

	@Override
    public int addAddress(AddressDTO addressDTO) {
		
         return myPageMapper.insertAddress(addressDTO);
         
	}
	
	
	// 중복 주소 체크
	@Override
	public boolean isAddressDuplicated(AddressDTO addressDTO, int memberNo) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		paramMap.put("address", addressDTO.getAddress());
		paramMap.put("memberNo", memberNo);
		paramMap.put("detailAddress", addressDTO.getDetailAddress());
		
		int count = myPageMapper.countDuplicateAddress(paramMap);
        return count > 0;
	}

	// 주소 개수 체크
	public int getAddressCount(int memberNo) {
		
	     return myPageMapper.getAddressCount(memberNo);
	}
	

	// 기본 배송지 등록하기
	@Override
	@Transactional
	public int basicAddress(int addressNo, int memberNo) {
		
		try {
	        // 디버깅을 위한 로그 추가
	        System.out.println("addressNo: " + addressNo);
	        System.out.println("memberNo: " + memberNo);
	        
	        // 매개변수 유효성 검사
	        if (addressNo <= 0 || memberNo <= 0) {
	            throw new IllegalArgumentException("유효하지 않은 매개변수입니다. (addressNo: " + addressNo + ", memberNo: " + memberNo + ")");
	        }

	        Map<String, Object> paramMap = new HashMap<>();
	        paramMap.put("addressNo", addressNo);
	        paramMap.put("memberNo", memberNo);

	        // 기존 기본 배송지 해제
	        myPageMapper.resetBasicAddress(memberNo);
	        
	        // 새로운 기본 배송지 설정
	        int setResult = myPageMapper.basicAddress(paramMap);
	        
	        if (setResult <= 0) {
	            throw new RuntimeException("기본 배송지 설정에 실패했습니다. (적용된 행이 없습니다)");
	        }
	        
	        return setResult;
	        
	    } catch (Exception e) {
	        throw new RuntimeException("기본 배송지 처리 중 오류 발생: " + e.getMessage());
	    }
	}
	
	
	// 배송지 수정
	@Override
	public int updateAddress(AddressDTO addressDTO) {
		
		return myPageMapper.updateAddress(addressDTO);
	}

	
	// 배송지 데이터 가져오기 (수정 모달에 사용)
	@Override
	public AddressDTO getAddress(int addressNo) {
		
		return myPageMapper.selectAddress(addressNo);
	}

	// 배송지 삭제
		@Override
		@Transactional
		public int deleteAddress(int addressNo, int memberNo) {
		    Map<String, Object> paramMap = new HashMap<>();
		    paramMap.put("addressNo", addressNo);
		    paramMap.put("memberNo", memberNo);
		    
		    return myPageMapper.deleteAddress(paramMap);
		}
	
	

	
	
	
	// 찜한 목록 조회
	@Override
	public List<Performance> userWishList(int page, int memberNo) {
		int pageSize = 20;
		
		// 시작 위치 계산
		int offset = (page - 1) * pageSize;	
		
		return mapper.userWishList(offset, pageSize, memberNo);
	}
	
	
	// 찜한 내역 삭제
	@Override
	public boolean deleteWishlistItems(List<String> performanceIds, int memberNo) {
		try {
	        // 입력값 검증
	        if(performanceIds == null || performanceIds.isEmpty()) {
	            return false;
	        }
	        
	        // Map에 memberNo와 performanceIds를 담아서 전달
	        Map<String, Object> paramMap = new HashMap<>();
	        paramMap.put("memberNo", memberNo);
	        paramMap.put("performanceIds", performanceIds);
	        
	        // 실제 삭제된 행의 수를 확인
	        int result = mapper.deleteWishlistItems(paramMap);
	        
	        // 모든 선택된 항목이 성공적으로 삭제되었는지 확인
	        return result == performanceIds.size();
	        
	    } catch(Exception e) {
	        log.error("찜목록 삭제 중 오류 발생: {}", e.getMessage());
	        return false;
	    }
	}
	
	// 이전 패스워드 비교
	@Override
	public boolean checkPreviousPassword(String newPassword, int memberNo) {
		
		String checkPw = mapper.memberPwCheck(memberNo);
		
		if (bcrypt.matches(newPassword, checkPw)) {
			return true;
		} else {
			return false;
		}
		
	}
	
	// 1:1 문의 작성
	@Override
	public boolean inquiryWrite(Map<String, Object> paramMap, int memberNo) {
		paramMap.put("memberNo", memberNo);
		
		int count = mapper.inquiryWrite(paramMap);
		return count > 0;
	}
	
	// 문의 내역 목록 조회
	@Override
	public List<Inquiry> getInquiries(int memberNo, String searchType, String keyword, int offset, int limit) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		paramMap.put("memberNo", memberNo);
		paramMap.put("searchType", searchType);
		paramMap.put("keyword", keyword);
		paramMap.put("offset", offset);
		paramMap.put("limit", limit);
		
		return mapper.getInquiries(paramMap);
	}

	// 문의 내역 목록 개수 조회
	@Override
	public int getInquiryCount(int memberNo, String searchType, String keyword) {
		Map<String, Object> paramMap = new HashMap<>();
		
		paramMap.put("memberNo", memberNo);
		paramMap.put("searchType", searchType);
		paramMap.put("keyword", keyword);
		
		return mapper.getInquiryCount(paramMap);
	}

	// 문의 내역 상세 조회
	@Override
	public Inquiry getInquiryDetail(int inquiryNo) {
		return mapper.getInquiryDetail(inquiryNo);
	}
	
	// 해당 문의 사항 삭제
	@Override
	public int deleteInquiry(int inquiryNo, int memberNo) {
		Map<String, Object> paramMap = new HashMap<>();
		
		paramMap.put("inquiryNo", inquiryNo);
		paramMap.put("memberNo", memberNo);
		
		return mapper.deleteInquiry(paramMap);
	}

	/**
	 * 예매 내역 조회
	 * @author 나찬웅 
	 */
	@Override
	public List<ticketInfoDTO> getBookingHistory(int memberNo, String status, String bookingId, String startDate, String endDate) {
	    return mapper.selectBookingHistory(memberNo, status, bookingId, startDate, endDate);
	}

	

	/** 
	 * 예매 상세 내용 조회
	 * @author 나찬웅 
	 */
	@Override
	public ticketInfoDTO getBookingDetail(String bookingId, int memberNo) {
		return mapper.selectBookingDetail(bookingId, memberNo);
	}

	/**  
	 * 	예매 취소(결제, 예약정보, 예매 내역, 좌석)테이블 수정 및 삭제
	 *	@author 나찬웅 
	 */
	@Override
	public boolean cancelBooking(String bookingId, int memberNo) {
		try {
			// 1. TB_TICKET_SEAT에서 예약된 좌석 삭제
			int seatDeleteResult = mapper.deleteTicketSeat(bookingId);
			
			// 2. TB_PAYMENT의 결제 상태 업데이트
			int paymentUpdateResult = mapper.updatePaymentStatus(bookingId);
			
			// 3. TB_TICKET_BOOKING의 예약 상태 업데이트
			int bookingUpdateResult = mapper.updateBookingStatus(bookingId, memberNo);
			
			// 4. TB_BOOKING_HISTORY의 예매 내역 상태 업데이트
			int historyUpdateResult = mapper.updateHistoryStatus(bookingId);
			
			return seatDeleteResult > 0 && paymentUpdateResult > 0 &&
					bookingUpdateResult > 0 && historyUpdateResult > 0;
		} catch (Exception e) {
			log.error("예매 취소 처리 중 오류 발생 : ", e);
			throw new RuntimeException("예매 취소 실패");
		}
	}


	/**  기본 배송지 정보 조회
	 *	 @author 나찬웅 
	 */
	@Override
	public AddressDTO getDefaultAddress(int memberNo) {
		return mapper.selectDefaultAddress(memberNo);
	}

	
	
	/** 전화번호 중복 검사
	 *
	 */
	@Override
	public int checkTel(String userTel) {
		
		return mapper.checkTel(userTel);
	}
	
	

	
}
