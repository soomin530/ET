package edu.kh.admin.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.admin.main.model.dto.BookedSeatManageDTO;
import edu.kh.admin.main.model.dto.Seat;

@Mapper
public interface BookedSeatManageMapper {

	/** 공연 목록 조회
	 * @return
	 */
	List<BookedSeatManageDTO> performanceList();
	
	/** 공연 목록 검색
	 * @param formData
	 * @return
	 */
	List<BookedSeatManageDTO> searchPerformanceList(Map<String, Object> formData);

	/** 공연 상세정보 조회
	 * @param mt20id
	 * @return
	 */
	BookedSeatManageDTO detail(String mt20id);

	/** 공연 위도, 경도 조회
	 * @param mt20id
	 * @return
	 */
	BookedSeatManageDTO selectPerformanceById(String mt20id);

	/** 스케줄 및 잔여 좌석 조회
	 * @param mt20id
	 * @return
	 */
	List<Map<String, Object>> getScheduleData(String mt20id);

	/** 특정 공연 좌석 정보 조회
	 * @param params
	 * @return
	 */
	List<Seat> selectSeatsByShow(Map<String, Object> params);

	/** 이미 예약된 좌석 조회
	 * @param params
	 * @return
	 */
	List<Seat> selectBookedSeats(Map<String, Object> params);

	/** 새로운 좌석이 이미 예약되어 있는지 확인
	 * @param params
	 * @return
	 */
	int countBookedSeat(Map<String, Object> params);

	/** 좌석 이동 처리
	 * @param params
	 * @return
	 */
	int updateSeatLocation(Map<String, Object> params);
	
	/** 등급명으로 gradeId조회
	 * @param gradeName
	 * @return
	 */
	Integer getGradeIdByName(String gradeName);

	/** 좌석을 비활성화하는 경우 - TB_TICKET_SEAT에 새로운 레코드 추가
	 * @param params
	 * @return
	 */
	int insertBlockedSeat(Map<String, Object> params);

	/** 좌석을 활성화하는 경우 - TB_TICKET_SEAT에서 해당 레코드 삭제
	 * @param params
	 * @return
	 */
	int removeBlockedSeat(Map<String, Object> params);

}
