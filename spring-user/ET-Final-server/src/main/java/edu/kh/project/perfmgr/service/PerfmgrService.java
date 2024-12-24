package edu.kh.project.perfmgr.service;

import edu.kh.project.perfmgr.model.dto.PerfMgr;

public interface PerfmgrService {

	/** 로그인 진행
	 * @param inputMember
	 * @return
	 */
	PerfMgr login(PerfMgr inputMember);

	/** 이메일 중복 체크
	 * @param concertManagerEmail
	 * @return
	 */
	int checkEmail(String concertManagerEmail);

	/** 아이디 중복 체크
	 * @param memberId
	 * @return
	 */
	int checkId(String concertManagerId);

	/** 닉네임 중복 체크
	 * @param memberNickname
	 * @return
	 */
	int checkNickname(String concertManagerNickname);

	/** 회원 가입
	 * @param inputMember
	 * @return
	 */
	int signup(PerfMgr inputMember);

}
