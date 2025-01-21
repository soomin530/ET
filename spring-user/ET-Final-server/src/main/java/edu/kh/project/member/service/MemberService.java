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
	
	/** 전화번호 중복 체크
	 * @param memberTel
	 * @return
	 */
	int checkTel(String memberTel);

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
	
	/** 관리자 전용
	 * @param memberEmail
	 * @param valueOf
	 * @return
	 */
	Member findAdminByEmail(String memberEmail, String valueOf);

	/** 비밀번호 체크
	 * @param token
	 * @param newPassword
	 * @return
	 */
	boolean checkPreviousPassword(String memberNo, String newPassword);

}
