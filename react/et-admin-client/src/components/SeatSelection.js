import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/SeatSelection.css";
import { axiosApi } from "../api/axoisAPI";

const SeatManagement = () => {
  const location = useLocation();
  const { mt20id, selectedDate, selectedTime, dayOfWeek } =
    location.state || {};
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatData, setSeatData] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isMovingMode, setIsMovingMode] = useState(false);
  const [selectedBookedSeat, setSelectedBookedSeat] = useState(null);

  useEffect(() => {
    if (mt20id && selectedDate && selectedTime) {
      fetchSeatData();
    }
  }, [mt20id, selectedDate, selectedTime]);

  const fetchSeatData = async () => {
    try {
      const response = await axiosApi.get("/seatManage/seats", {
        params: {
          mt20id,
          selectedDate,
          selectedTime,
          dayOfWeek,
        },
      });

      if (response.status === 200) {
        const allSeats = parseData(response.data.seats || []);
        const bookedAndBlockedSeats = response.data.bookedSeats || [];

        console.log(allSeats);

        setSeatData(allSeats);

        // BOOKED와 BLOCKED 상태를 나누어 저장
        const bookedSeats = bookedAndBlockedSeats.filter(
          (seat) => seat.seatStatus === "BOOKED"
        );
        const blockedSeats = bookedAndBlockedSeats.filter(
          (seat) => seat.seatStatus === "BLOCKED"
        );

        setBookedSeats(bookedSeats);
        setBlockedSeats(blockedSeats); // BLOCKED 상태 저장
      }
    } catch (error) {
      console.error("좌석 데이터를 불러오는 데 실패했습니다:", error);
    }
  };

  const parseData = (rawData) => {
    return rawData.map((item) => ({
      ...item,
    }));
  };

  const handleSeatStatusChange = async (seatId, currentStatus) => {
    // 예약된 좌석인지 확인
    const isBooked = bookedSeats.some(
      (bookedSeat) => bookedSeat.seatId === seatId
    );

    // 예약된 좌석을 클릭한 경우
    if (isBooked) {
      const confirmMove = window.confirm(
        "예약된 좌석입니다. 이 좌석을 이동하시겠습니까?"
      );
      if (confirmMove) {
        setIsMovingMode(true);
        setSelectedBookedSeat(
          bookedSeats.find((seat) => seat.seatId === seatId)
        );
        return;
      }
      return;
    }

    // 좌석 이동 모드에서 새로운 좌석을 선택한 경우
    if (isMovingMode && selectedBookedSeat) {
      try {
        // 같은 등급의 좌석인지 확인
        const oldSeatGrade = selectedBookedSeat.seatId.split("-")[1];
        const newSeatGrade = seatId.split("-")[1];

        if (oldSeatGrade !== newSeatGrade) {
          alert("같은 등급의 좌석으로만 이동할 수 있습니다.");
          return;
        }

        // 좌석 이동 API 호출
        const response = await axiosApi.put("/seatManage/move-seat", {
          oldSeatId: selectedBookedSeat.seatId,
          newSeatId: seatId,
          mt20id,
          selectedDate,
          selectedTime,
          memberNo: selectedBookedSeat.memberNo,
          gradeId: seatData.find(
            (section) => section.GRADENAME === newSeatGrade
          )?.GRADEID,
        });

        if (response.status === 200) {
          alert("좌석이 성공적으로 이동되었습니다.");
          setIsMovingMode(false);
          setSelectedBookedSeat(null);
          fetchSeatData(); // 좌석 데이터 새로고침
        }
      } catch (error) {
        console.error("좌석 이동 실패:", error);
        alert(
          "좌석 이동에 실패했습니다. " + error.response?.data?.message || ""
        );
      }
      return;
    }

    if (currentStatus === "BLOCKED") {
      const confirmUnblock = window.confirm(
        "비활성화된 좌석입니다. 이 좌석을 활성화하시겠습니까?"
      );
      if (!confirmUnblock) return;

      // 비활성화 해제 로직 실행
      const newStatus = "AVAILABLE";
      try {
        const seatGrade = seatId.split("-")[1];
        const gradeId = seatData.find(
          (section) => section.GRADENAME === seatGrade
        )?.GRADEID;

        const response = await axiosApi.put("/seatManage/update-seat-status", {
          mt20id,
          seatId,
          selectedDate,
          selectedTime,
          status: newStatus,
          gradeId,
        });

        if (response.status === 200) {
          alert("좌석이 활성화되었습니다.");
          fetchSeatData(); // 상태 업데이트
        }
      } catch (error) {
        console.error("좌석 상태 업데이트 실패:", error);
      }
      return;
    }

    // 일반 좌석 상태 변경 (예: 비활성화)
    const newStatus = getNextStatus(currentStatus);
    try {
      const confirmBlock = window.confirm(
        "해당 좌석을 비활성화 하시겠습니까?"
      );
      if (!confirmBlock) return;

      // 좌석 등급 ID 찾기
      const seatGrade = seatId.split("-")[1];
      const gradeId = seatData.find(
        (section) => section.GRADENAME === seatGrade
      )?.GRADEID;
      const response = await axiosApi.put("/seatManage/update-seat-status", {
        mt20id,
        seatId,
        selectedDate,
        selectedTime,
        status: newStatus,
        gradeId, // 등급 ID 추가
      });

      if (response.status === 200) {
        // API 성공 시 데이터를 다시 가져와 업데이트
        fetchSeatData();

        // 상태에 따른 알림 메시지
        if (newStatus === "BLOCKED") {
          alert("좌석이 비활성화되었습니다.");
        } else if (newStatus === "AVAILABLE") {
          alert("좌석이 활성화되었습니다.");
        }
      }
    } catch (error) {
      console.error("좌석 상태 업데이트 실패:", error);
    }
  };

  // getNextStatus 함수 수정 (비활성화/활성화만 토글)
  const getNextStatus = (currentStatus) => {
    const statusCycle = {
      AVAILABLE: "BLOCKED",
      BLOCKED: "AVAILABLE",
      BOOKED: "BOOKED", // 예약된 좌석은 상태 변경 불가
    };
    return statusCycle[currentStatus] || "AVAILABLE";
  };

  const cancelSeatMove = () => {
    setIsMovingMode(false);
    setSelectedBookedSeat(null);
  };

  const renderSeats = () => {
    return seatData.map((gradeSection) => {
      let seatNumber = 1;
      // 한 줄당 좌석 수 설정 (20~30석 추천)
      const maxSeatsPerRow =
        gradeSection.TOTALSEATCOUNT <= 50
          ? 10
          : gradeSection.TOTALSEATCOUNT > 200
          ? 25
          : 20;
      const rows = Math.ceil(gradeSection.TOTALSEATCOUNT / maxSeatsPerRow);

      return (
        <div key={gradeSection.GRADEID} className="seat-section">
          <div className="grade-title">
            {gradeSection.GRADENAME === "전석"
              ? "전석"
              : `${gradeSection.GRADENAME}석`}
          </div>
          <div className="seat-grid">
            {Array.from({ length: rows }).map((_, rowIndex) => {
              const row = rowIndex + 1;

              return (
                <div key={`row-${row}`} className="row-container">
                  {Array.from({ length: maxSeatsPerRow }).map((_, colIndex) => {
                    const col = colIndex + 1;

                    // 총 좌석 수를 초과하면 렌더링하지 않음
                    if (seatNumber > gradeSection.TOTALSEATCOUNT) {
                      return null;
                    }

                    const seatId = `${mt20id}-${gradeSection.GRADENAME}-${row}-${col}`;

                    const isBooked = bookedSeats.some(
                      (bookedSeat) => bookedSeat.seatId === seatId
                    );

                    const isBlocked = blockedSeats.some(
                      (blockedSeats) => blockedSeats.seatId === seatId
                    );

                    const isSelected = selectedBookedSeat?.seatId === seatId;

                    seatNumber++; // 좌석 번호 증가

                    return (
                      <div
                        key={seatId}
                        className={`seat ${
                          isBooked
                            ? "seat-reserved"
                            : isBlocked
                            ? "seat-blocked"
                            : "seat-available"
                        } ${isSelected ? "selected-seat" : ""}`}
                        onClick={() =>
                          handleSeatStatusChange(
                            seatId,
                            isBooked
                              ? "BOOKED"
                              : isBlocked
                              ? "BLOCKED"
                              : "AVAILABLE"
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {col}
                        <div className="seat-tooltip">
                          {`${row}행 ${col}열 ${
                            isBooked
                              ? "(예약됨)"
                              : isBlocked
                              ? "(비활성화)"
                              : ""
                          }`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="admin-seat-container">
      {performanceData && (
        <div className="performance-header">
          <h2>{performanceData.prfnm}</h2>
          <div className="performance-info">
            <p>날짜: {selectedDate}</p>
            <p>시간: {selectedTime}</p>
            <p>장소: {performanceData.fcltynm}</p>
          </div>
        </div>
      )}

      <div className="legend-container">
        <div className="legend-item">
          <div className="legend-color seat-available"></div>
          <span>사용 가능</span>
        </div>
        <div className="legend-item">
          <div className="legend-color seat-reserved"></div>
          <span>예약됨</span>
        </div>
        <div className="legend-item">
          <div className="legend-color seat-blocked"></div>
          <span>비활성화</span>
        </div>
      </div>

      {isMovingMode && (
        <div
          className="moving-mode-info"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "8px",
            border: "2px solid #0066cc",
          }}
        >
          <p style={{ color: "#0066cc", marginBottom: "10px" }}>
            <strong>좌석 이동 모드</strong> -{" "}
            {selectedBookedSeat?.seatId.split("-").slice(2).join("-")} 좌석을
            새로운 위치로 이동합니다.
          </p>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
            이동 가능한 좌석을 선택해주세요 (같은 등급의 빈 좌석만 선택 가능)
          </p>
          <button
            onClick={cancelSeatMove}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            이동 취소
          </button>
        </div>
      )}

      <div className="stage">STAGE</div>

      <div className="seat-section">{renderSeats()}</div>

      <div className="statistics-container">
        <h3 className="statistics-title">좌석 현황</h3>
        {seatData.map((section) => (
          <div key={section.GRADEID} className="statistics-row">
            <span>{section.GRADENAME}</span>
            <span>
              예약:{" "}
              {section.TOTALSEATCOUNT - section.AVAILABLESEATCOUNT - section.BLOCKEDSEATCOUNT}{" "}
              / 
              비활성화{" "}
              {section.BLOCKEDSEATCOUNT}{" "}
              /
              전체:{" "}
              {section.TOTALSEATCOUNT}

            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatManagement;
