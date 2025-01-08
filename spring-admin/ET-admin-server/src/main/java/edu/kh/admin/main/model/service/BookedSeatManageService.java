package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import edu.kh.admin.main.model.dto.BookedSeatManageDTO;
import edu.kh.admin.main.model.dto.ScheduleInfo;
import edu.kh.admin.main.model.dto.Seat;

public interface BookedSeatManageService {

	/** 공연 목록 조회
	 * @return
	 */
	List<BookedSeatManageDTO> performanceList();

	/** 공연ID로 공연 정보 조회
	 * @param mt20id
	 * @return
	 */
	BookedSeatManageDTO getPerformanceById(String mt20id);

	/** 스케줄 및 잔여석 정보 조회
	 * @param mt20id
	 * @return
	 */
	Map<String, List<ScheduleInfo>> getScheduleWithAvailableSeats(String mt20id);
 
	/** 좌석 조회
	 * @param mt20id
	 * @param selectedDate
	 * @param selectedTime
	 * @param dayOfWeek
	 * @return
	 */
	List<Seat> getSeatsByPerformance(String mt20id, String selectedDate, String selectedTime, String dayOfWeek);

	/** 이미 예약된 좌석 조회
	 * @param mt20id
	 * @param selectedDate
	 * @param selectedTime
	 * @return
	 */
	List<Seat> getBookedSeats(String mt20id, String selectedDate, String selectedTime);

	/** 새로운 좌석이 이미 예약되어 있는지 확인
	 * @param newSeatId
	 * @param mt20id
	 * @param selectedDate
	 * @param selectedTime
	 * @return
	 */
	boolean isAlreadyBooked(String newSeatId, String mt20id, String selectedDate, String selectedTime);

	/** 좌석 이동 처리
	 * @param oldSeatId
	 * @param newSeatId
	 * @param mt20id
	 * @param selectedDate
	 * @param selectedTime
	 * @param memberNo
	 * @param gradeId
	 * @return
	 */
	boolean moveSeat(String oldSeatId, String newSeatId, String mt20id, String selectedDate, String selectedTime,
			Integer memberNo, Integer gradeId);

	/** 좌석을 비활성화하는 경우 - TB_TICKET_SEAT에 새로운 레코드 추가
	 * @param seatId
	 * @param mt20id
	 * @param selectedDate
	 * @param selectedTime
	 * @param gradeId
	 * @return
	 */
	boolean insertBlockedSeat(String seatId, String mt20id, String selectedDate, String selectedTime);

	/** 좌석을 활성화하는 경우 - TB_TICKET_SEAT에서 해당 레코드 삭제
	 * @param seatId
	 * @param mt20id
	 * @param selectedDate
	 * @param selectedTime
	 * @return
	 */
	boolean removeBlockedSeat(String seatId, String mt20id, String selectedDate, String selectedTime);


}
