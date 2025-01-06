package edu.kh.project.member.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.member.model.dto.Member;

public interface MemberService {

	/** 로그인 진행
	 * @param inputMember
	 * @return
	 */
	Member login(Member inputMember);

	/** 이메일 중복 체크
	 * @param memberEmail
	 * @return
	 */
	int checkEmail(String memberEmail);
	
	/** 아이디 중복 체크(비동기)
	 * @param memberId
	 * @return
	 */
	int checkId(String memberId);

	/** 이름 중복 체크(비동기)
	 * @param memberNickname
	 * @return
	 */
	int checkNickname(String memberNickname);

	/** 회원 가입
	 * @param inputMember
	 * @param memberAddress
	 * @return
	 */
	int signup(Member inputMember, String[] memberAddress);

	/** 네이버 로그인
	 * @param naverMember
	 */
	Member loginNaver(Member naverMember);
	
	/** 이메일로 회원 아이디 조회
	 * @param email
	 * @return
	 */
	Member findByEmail(String email);
	
	/** 이메일 아이디로 회원 정보 조회
	 * @param paramMap
	 * @return
	 */
	Member findByIdAndEmail(Map<String, Object> paramMap);
	
	/** 비밀번호 변경
	 * @param int1
	 * @param password
	 * @return
	 */
	int updatePassword(int memberNo, String password);
	
	void insertVenue(Map<String, Object> venue);

	void insertPerf(Map<String, Object> perfMap);

	void insertPerfTime(Map<String, Object> perfTime);

	void insertTicketInto(Map<String, Object> ticketInfo);

	List<Map<String, String>> performanceDetails();

	void insertVenueSeat(Map<String, Object> seat);


}
