package edu.kh.project.perfmgr.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.perfmgr.model.dto.PerfMgr;

@Mapper
public interface PerfmgrMapper {

	/** 로그인 진행
	 * @param concertManagerId
	 * @return
	 */
	PerfMgr login(String concertManagerId);

	/** 이메일 중복 체크
	 * @param concertManagerEmail
	 * @return
	 */
	int checkEmail(String concertManagerEmail);

	/** 아이디 중복 체크
	 * @param concertManagerId
	 * @return
	 */
	int checkId(String concertManagerId);

	/** 닉네임 중복 체크
	 * @param concertManagerNickname
	 * @return
	 */
	int checkNickname(String concertManagerNickname);

	/** 회원가입 서비스
	 * @param inputMember
	 * @return
	 */
	int signup(PerfMgr inputMember);

}
