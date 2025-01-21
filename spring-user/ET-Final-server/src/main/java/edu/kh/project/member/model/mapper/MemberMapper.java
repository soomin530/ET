package edu.kh.project.member.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	/** 로그인 진행
	 * @param memberId
	 * @return
	 */
	Member login(String memberId);

	/** 이메일 중복 체크
	 * @param memberEmail
	 * @return
	 */
	int checkEmail(String memberEmail);

	/** 아이디 중복 체크
	 * @param memberId
	 * @return
	 */
	int checkId(String memberId);

	/** 닉네임 중복 체크
	 * @param memberNickname
	 * @return
	 */
	int checkNickname(String memberNickname);
	
	/** 전화번호 중복체크
	 * @param memberTel
	 * @return
	 */
	int checkTel(String memberTel);

	/** 회원가입 서비스
	 * @param inputMember
	 * @return
	 */
	int signup(Member inputMember);
	
	/** 기존 네이버 회원 조회
	 * @param memberId
	 * @return
	 */
	Member selectNaverMember(String memberId);

	/** 신규 네이버 회원 등록
	 * @param naverMember
	 */
	void insertNaverMember(Member naverMember);

	/** 네이버 회원 수정
	 * @param naverMember
	 */
	void updateNaverMember(Member naverMember);
	
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
	 * @param paramMap
	 * @return
	 */
	int updatePassword(Map<String, Object> paramMap);
	
	/** 이메일로 관리자 확인
	 * @param memberEmail
	 * @return
	 */
	Member findAdminByEmail(Map<String, Object> paramMap);

	/** 이전 비밀번호 조회
	 * @param memberNo
	 * @return
	 */
	String selectPreviousPasswords(String memberNo);


}
