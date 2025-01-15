package edu.kh.admin.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.admin.main.model.dto.Member;

/**
 * 
 */
@Mapper
public interface MemberMapper {

	/** 모든 유저 정보
	 * @return
	 */
	List<Member> showMemberList();

	/** 검색 정보 조회
	 * @param formdata
	 * @return
	 */
	List<Member> searchShowMemberList(Map<String, Object> formdata);

	/** 유저 상세 정보
	 * @param memberNo
	 * @return
	 */
	List<Member> memberDetail(int memberNo);

	/** 회원 강제 삭제
	 * @param memberNo
	 * @return
	 */
	int delete(int memberNo);


	/** 회원 정보 수정
	 * @param formdata
	 * @return
	 */
	int update(Map<String, Object> formdata);

	/** 이메일로 관리자 확인
	 * @param memberEmail
	 * @return
	 */
	Member findByEmail(Map<String, Object> paramMap);



}
