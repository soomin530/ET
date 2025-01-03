package edu.kh.project.perfmgr.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.perfmgr.model.dto.PerfMgr;
import edu.kh.project.performance.model.dto.Performance;

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
	
	/** 공연관리자가 등록한 공연 목록 조회 
	 * @param memberNo
	 * @return
	 * @author 우수민
	 */
	List<Performance> getPerformancesByManager(int memberNo);
	
	/** 관리자 공연 상세페이지 조회
	 * @param mt20id
	 * @return
	 * @author 우수민
	 */
	Performance getPerformanceById(String mt20id);

	/** 수정할 공연 정보 조회
	 * @param mt20id
	 * @return
	 * @author 우수민
	 */
	Performance getPerformanceDetail(String mt20id);

	/** 수정된 내용으로 상세페이지, DB 업데이트
	 * @param mt20id
	 * @param params
	 * @return
	 * @author 우수민
	 */
	boolean modifyPerformanceUpdate(Performance updateData);

	/** 관리자 상세 정보 페이지에서 삭제 버튼 누를 시
     *  PERFORMANCE_DEL_FL 값을 'Y'로 업데이트
	 * @param mt20id
	 * @return
	 * @author 우수민
	 */
	boolean updatePerformanceDeleteFlag(String mt20id);

}
