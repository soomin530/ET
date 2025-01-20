import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../api/axoisAPI";
import "../css/BookedSeatDetail.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import defaultPoster from "../images/default-poster.png";

const PerformanceDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mt20id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [performance, setPerformance] = useState(
    location.state?.performance || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!performance) {
        setLoading(true);
        try {
          const response = await axiosApi.get(`/seatManage/detail/${mt20id}`);
          if (response.status === 200) {
            setPerformance(response.data);
          }
        } catch (error) {
          console.error("공연 상세 정보 로드 중 오류:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [mt20id, performance]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDayName = (date) => {
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return days[date.getDay()];
  };

  const handleDateSelect = (arg) => {
    const date = arg.date;
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    const dayName = getDayName(date);
    setSelectedTimes(performance.schedule[dayName] || []);
  };

  const handleTimeSelection = async (time) => {
    if (!selectedDate) return;

    const [year, month, day] = selectedDate.split("-");
    const dateObj = new Date(year, month - 1, day);
    const dayNumber = dateObj.getDay() === 0 ? 7 : dateObj.getDay();

    const seatManageData = {
      mt20id: mt20id,
      selectedDate: selectedDate,
      selectedTime: time,
      dayOfWeek: String(dayNumber),
    };

    try {
      const response = await axiosApi.post(
        "/seatManage/bookingSeat",
        seatManageData
      );

      if (response.status === 200) {
        navigate("/seatManage/bookingSeat", {
          state: {
            mt20id: mt20id,
            selectedDate: selectedDate,
            selectedTime: time,
            dayOfWeek: dayNumber,
          },
        });
      } else {
        alert("좌석 데이터를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("좌석 데이터를 불러오는 중 오류:", error);
      alert("좌석 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const dayCellClassNames = (arg) => {
    const date = arg.date;
    const formattedDate = formatDate(date);
    const dayName = getDayName(date);

    const currentDate = new Date(formattedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 제거하여 날짜만 비교
    const startDate = new Date(performance.prfpdfrom);
    const endDate = new Date(performance.prfpdto);

    // 오늘 이전 날짜이거나 공연 기간을 벗어난 경우
    if (
      currentDate < today ||
      currentDate < startDate ||
      currentDate > endDate
    ) {
      return "fc-day-disabled";
    }

    let classNames = formattedDate === selectedDate ? "selected-date" : "";

    if (performance.schedule[dayName]) {
      classNames += ` available-date`;
    }

    return classNames;
  };

  if (loading) {
    return <div className="loading-spinner show"></div>;
  }

  if (!performance) {
    return <div>공연 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="performance-detail-container">
      {/* Header를 detail-content 밖으로 이동 */}
      <div className="booked-detail-header">
        <h1 className="booked-detail-title">{performance.prfnm}</h1>
        <button onClick={handleBack} className="booked-back-button">
          <i className="fas fa-arrow-left"></i>
          <span>목록으로 돌아가기</span>
        </button>
      </div>

      <div className="detail-content">
        {/* Left side: Performance Info */}
        <div className="info-section">
          <div className="poster-container">
            <img
              src={performance.poster || defaultPoster}
              alt={performance.prfnm}
              className="poster-image"
              onError={(e) => {
                if (e.target.src !== defaultPoster) {
                  e.target.src = defaultPoster;
                }
              }}
            />
          </div>
          <div className="info-table-container">
            <div className="info-row">
              <div className="info-label">공연 기간</div>
              <div className="info-value period">
                {performance.prfpdfrom} ~ {performance.prfpdto}
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">공연 장소</div>
              <div className="info-value">{performance.fcltynm}</div>
            </div>
            <div className="info-row">
              <div className="info-label">공연 시간</div>
              <div className="info-value">{performance.prfruntime}</div>
            </div>
            <div className="info-row">
              <div className="info-label">출연진</div>
              <div className="info-value">{performance.prfcast}</div>
            </div>
            <div className="info-row">
              <div className="info-label">가격</div>
              <div className="info-value price">{performance.pcseguidance}</div>
            </div>
            <div className="info-row">
              <div className="info-label">주소</div>
              <div className="info-value address">{performance.adres}</div>
            </div>
          </div>
        </div>

        {/* Right side: Calendar and Time Selection */}
        <div className="booking-section">
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="ko"
              headerToolbar={{
                left: "prev",
                center: "title",
                right: "next",
              }}
              dateClick={handleDateSelect}
              validRange={{
                start: new Date(), // 오늘부터
                end: new Date(performance.prfpdto),
              }}
              dayCellClassNames={dayCellClassNames}
              height="auto"
            />
          </div>

          {selectedDate && (
            <div className="time-slots">
              <h3 className="time-slots-title">선택된 날짜: {selectedDate}</h3>
              <div className="time-slots-container">
                {selectedTimes.length > 0 ? (
                  selectedTimes.map((timeInfo, index) => (
                    <button
                      key={`${timeInfo.time}-${index}`}
                      onClick={() => handleTimeSelection(timeInfo.time)}
                      className="time-slot-button"
                    >
                      <div className="time-slot-info">
                        <span className="time-slot-time">{timeInfo.time}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="no-times-message">
                    해당 날짜에 공연이 없습니다.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDetail;
