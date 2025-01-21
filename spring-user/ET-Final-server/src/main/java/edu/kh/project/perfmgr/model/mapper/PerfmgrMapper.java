package edu.kh.project.perfmgr.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.perfmgr.model.dto.PerfMgr;
import edu.kh.project.performance.model.dto.Performance;

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
	
	/** 전화번호 중복검사
	 * @param concertManagerTel
	 * @return
	 */
	int checkTel(String concertManagerTel);

	/** 회원가입 서비스
	 * @param inputMember
	 * @return
	 */
	int signup(PerfMgr inputMember);
	
	/** 공연관리자가 등록한 공연 목록 조회 
	 * @param memberNo
	 * @return
	 * @author 우수민
	 */
	List<Performance> selectPerformancesByManager(int memberNo);

	/** 관리자 공연 상세페이지 조회
	 * @param mt20id
	 * @return
	 * @author 우수민
	 */
	Performance detail(String mt20id);

	/** 수정할 공연 정보 조회
	 * @param mt20id
	 * @return
	 */
	Performance selectModifyPerformance(String mt20id);

	/** 수정된 내용으로 상세페이지, DB 업데이트
	 * @param updateData
	 * @param params
	 * @return
	 */
	int updatePerformance(Performance updateData);

	/** 관리자 상세 정보 페이지에서 삭제 버튼 누를 시
     *  PERFORMANCE_DEL_FL 값을 'Y'로 업데이트
	 * @param mt20id
	 * @return
	 * @author 우수민
	 */
	boolean updatePerformanceDeleteFlag(String mt20id);


}
