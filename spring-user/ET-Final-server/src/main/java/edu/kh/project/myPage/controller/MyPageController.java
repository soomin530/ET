package edu.kh.project.myPage.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.email.model.service.EmailService;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;
import edu.kh.project.myPage.model.dto.ticketInfoDTO;
import edu.kh.project.myPage.service.MyPageService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@RequestMapping("mypage")
@Slf4j
@SessionAttributes({ "loginMember" })
public class MyPageController {

	private final EmailService emailService;
	private final MyPageService service;
	private final BCryptPasswordEncoder bcrypt;

	private final JwtTokenUtil jwtTokenUtil;

	@GetMapping("addressManagement")
	public String addressManagement() {
		return "mypage/addressManagement"; // View 이름 반환
	}

	/**
	 * 배송지 목록 조회(로드)
	 * 
	 * @param loginMember
	 * @return
	 */
	@GetMapping("addressList")
	@ResponseBody
	public ResponseEntity<List<AddressDTO>> getAddressList(@SessionAttribute("loginMember") Member loginMember) {
		List<AddressDTO> addressList = myPageService.getAddressList(loginMember.getMemberNo());
		return ResponseEntity.ok(addressList);
	}

	@Autowired
	private MyPageService myPageService;

	/**
	 * 배송지 등록 하기
	 * 
	 * @param addressDTO
	 * @param loginMember
	 * @return
	 */
	@PostMapping("addAddress")
	@ResponseBody
	public ResponseEntity<String> addAddress(@RequestBody AddressDTO addressDTO,
			@SessionAttribute("loginMember") Member loginMember) {
		addressDTO.setMemberNo(loginMember.getMemberNo()); // getMemberNo()로 회원 번호 설정

		// 주소 개수 체크
		int addressCount = myPageService.getAddressCount(loginMember.getMemberNo());
		if (addressCount >= 10) {
			return ResponseEntity.status(400).body("배송지는 최대 10개까지만 등록할 수 있습니다.");
		}

		// 중복 주소 체크
		boolean isDuplicated = myPageService.isAddressDuplicated(addressDTO, loginMember.getMemberNo());
		if (isDuplicated) {
			return ResponseEntity.status(400).body("이미 등록된 주소입니다.");
		}

		int result = myPageService.addAddress(addressDTO);
		if (result > 0) {
			return ResponseEntity.ok("배송지가 등록되었습니다.");
		} else {
			return ResponseEntity.status(500).body("배송지 등록에 실패했습니다.");
		}
	}

	/**
	 * 기본 배송지 등록하기
	 * 
	 * @param addressNo
	 * @param loginMember
	 * @return
	 */
	@PostMapping("basicAddress")
	@ResponseBody
	public ResponseEntity<String> basicAddress(@RequestParam("addressNo") int addressNo,
			@SessionAttribute(value = "loginMember", required = true) Member loginMember) {

		try {
			// 디버깅을 위한 로그 추가
			System.out.println("Controller - addressNo: " + addressNo);
			System.out.println("Controller - memberNo: " + loginMember.getMemberNo());

			int result = myPageService.basicAddress(addressNo, loginMember.getMemberNo());

			if (result > 0) {
				return ResponseEntity.ok("기본 배송지가 변경되었습니다.");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("기본 배송지 변경에 실패했습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	/**
	 * 배송지 수정
	 * 
	 * @param addressDTO
	 * @return
	 */

	@PostMapping("/editAddress")
	@ResponseBody
	public ResponseEntity<String> updateAddress(@RequestBody AddressDTO addressDTO) {
		if (!isAddressDTOValid(addressDTO)) {
			return ResponseEntity.badRequest().body("필수 필드를 모두 입력해주세요.");
		}

		int result = myPageService.updateAddress(addressDTO);

		if (result > 0) {
			return ResponseEntity.ok("주소가 성공적으로 수정되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주소 수정에 실패했습니다.");
		}
	}

	// AddressDTO 유효성 검사
	private boolean isAddressDTOValid(AddressDTO addressDTO) {
		return addressDTO.getReceiverName() != null && !addressDTO.getReceiverName().isEmpty()
				&& addressDTO.getPostcode() != null && !addressDTO.getPostcode().isEmpty()
				&& addressDTO.getAddress() != null && !addressDTO.getAddress().isEmpty()
				&& addressDTO.getDetailAddress() != null && !addressDTO.getDetailAddress().isEmpty()
				&& addressDTO.getPhone() != null && !addressDTO.getPhone().isEmpty();
	}

	/**
	 * 배송지 데이터 가져오기 (수정 모달에 사용)
	 * 
	 * @param addressNo
	 * @return
	 */
	@GetMapping("/getAddress/{addressNo}")
	@ResponseBody
	public ResponseEntity<AddressDTO> getAddress(@PathVariable int addressNo) {
		AddressDTO address = myPageService.getAddress(addressNo);

		if (address != null) {
			return ResponseEntity.ok(address);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	/**
	 * 배송지 삭제
	 * 
	 * @param addressNo
	 * @param loginMember
	 * @return
	 */
	@DeleteMapping("/deleteAddress/{addressNo}")
	@ResponseBody
	public ResponseEntity<String> deleteAddress(@PathVariable("addressNo") int addressNo, // addressNo 명시적 지정
			@SessionAttribute("loginMember") Member loginMember) {
		try {
			int result = myPageService.deleteAddress(addressNo, loginMember.getMemberNo());

			if (result > 0) {
				return ResponseEntity.ok("배송지가 성공적으로 삭제되었습니다.");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("배송지 삭제에 실패했습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("배송지 삭제 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	// 닉네임 클릭 시 회원정보 페이지로 이동
	@GetMapping("memberInfo")
	public String memberInfo() {

		return "mypage/memberInfo";
	}

	// 비밀번호 검증
	@PostMapping("verifyPassword")
	@ResponseBody
	public int verifyPassword(@RequestParam("memberPw") String memberPw,
			@SessionAttribute("loginMember") Member loginMember, HttpServletResponse resp) {
		// 로그인 성공 처리
		String memberNo = String.valueOf(loginMember.getMemberNo());
		String memberEmail = loginMember.getMemberEmail();

		// 토큰 생성
		JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);

		// Access Token을 HttpOnly 쿠키에 저장
		Cookie accessTokenCookie = new Cookie("Access-Token", tokenInfo.accessToken());
		accessTokenCookie.setHttpOnly(false);
		accessTokenCookie.setSecure(false);
		accessTokenCookie.setPath("/");
		accessTokenCookie.setMaxAge((int) jwtTokenUtil.getAccessTokenValidityInMilliseconds() / 1000);
		resp.addCookie(accessTokenCookie);

		int result = service.verifyPassword(memberPw, loginMember.getMemberNo());

		return result;
	}

	// 회원 정보 조회
	@GetMapping("info")
	@ResponseBody
	public ResponseEntity<Member> getMemberInfo(@SessionAttribute("loginMember") Member loginMember) {
		Member member = service.getMemberInfo(loginMember.getMemberNo());
		return ResponseEntity.ok(member);
	}

	// 회원정보 수정 페이지로 이동
	@GetMapping("updateInfo")
	public String updateInfo() {

		return "mypage/updateInfo";
	}

	// 비밀번호 변경 페이지로 이동
	@GetMapping("changePw")
	public String ChangePw() {

		return "mypage/changePw";
	}

	// 회원탈퇴 페이지로 이동
	@GetMapping("membershipOut")
	public String membershipOut() {

		return "mypage/membershipOut";
	}

	// 비밀번호 변경 페이지로 이동
	@GetMapping("checkPw")
	public String CheckPw() {

		return "mypage/checkPw";
	}

	/**
	 * 이메일 중복검사 (비동기 요청)(수정)
	 * 
	 * @param verificationEmail
	 * @return
	 */
	@ResponseBody
	@GetMapping("verifyEmail")
	public int verifyEmail(@RequestParam("verificationEmail") String verificationEmail) {
		return service.verifyEmail(verificationEmail);
	}

	@ResponseBody
	@PostMapping("sendEmail")
	public int sendEmail(@RequestBody String email) {

		log.debug("email {}", email);

		String authKey = emailService.sendEmail("updateEmail", email);

		if (authKey != null) { // 인증번호가 반환되어 돌아옴
								// == 이메일 보내기 성공
			return 1;
		}

		// 이메일 보내기 실패
		return 0;
	}

	/**
	 * 닉네임 중복검사 (비동기 요청)(수정)
	 * 
	 * @param memberNickname
	 * @return
	 */
	@ResponseBody
	@GetMapping("updateNickname")
	public int updateNickname(@RequestParam("userNickname") String userNickname) {
		return service.updateNickname(userNickname);
	}

	@PostMapping("/updateInfo")
	@ResponseBody
	public int updateMember(@RequestBody Member member, @SessionAttribute("loginMember") Member loginMember) {

		// 로그 추가
		log.info("Received member update request: {}", member);

		// 현재 로그인한 회원의 번호를 설정
		member.setMemberNo(loginMember.getMemberNo());

		int result = service.updateMember(member);

		// 업데이트 성공 시 세션 정보도 업데이트
		if (result > 0) {
			loginMember.setMemberEmail(member.getMemberEmail());
			loginMember.setMemberNickname(member.getMemberNickname());
			loginMember.setMemberTel(member.getMemberTel());
			loginMember.setMemberGender(member.getMemberGender());
		}

		return result;
	}

	/**
	 * 1/6 나찬웅 작성
	 * 
	 * @return
	 */
	@GetMapping("mypageInfo")
	public String mypageInfo() {
		return "mypage/mypageInfo"; // (예매내역/찜목록) 관리 페이지 HTML 파일
	}

	/**
	 * 1/6 나찬웅 작성 마이페이지 -> 예매 내역
	 * 
	 * @return
	 */
	@GetMapping("ticketInfo")
	public String ticketInfo() {
		return "mypage/ticketInfo"; // 예매내역 페이지 HTML 파일
	}

	/**
	 * 예매 내역 조회
	 * 
	 * @param bookingId
	 * @param loginMember
	 * @return
	 */
	@GetMapping("/ticketInfo/data")
	public ResponseEntity<List<ticketInfoDTO>> getBookingHistory(@SessionAttribute("loginMember") Member loginMember) {
		List<ticketInfoDTO> bookingHistory = service.getBookingHistory(loginMember.getMemberNo());
		return ResponseEntity.ok(bookingHistory);
	}

	/**
	 * 1/6 나찬웅 작성 마이페이지 -> 예매 내역 -> 예매 상세 정보
	 * 
	 * @return
	 */
	/** 예매 상세 정보 페이지로 이동 */
	@GetMapping("ticketDetail/{bookingId}")
	public String ticketDetail(@PathVariable("bookingId") String bookingId) {
		return "mypage/ticketDetail"; // 예매 내역 상세 페이지 HTML
	}

	// 예매 상세 정보에서 데이터 조회
	@ResponseBody
	@GetMapping("ticketDetail/data/{bookingId}")
	public ResponseEntity<ticketInfoDTO> getTicketDetail(@PathVariable("bookingId") String bookingId,
			@SessionAttribute("loginMember") Member loginMember) {

		ticketInfoDTO detail = service.getBookingDetail(bookingId, loginMember.getMemberNo());
		return ResponseEntity.ok(detail);
	}

	/**
	 * 1/6 나찬웅 작성 마이페이지 -> 찜목록
	 * 
	 * @return
	 */
	@GetMapping("favList")
	public String favList() {
		return "mypage/favList"; // 찜목록 페이지 HTML 파일
	}
}
