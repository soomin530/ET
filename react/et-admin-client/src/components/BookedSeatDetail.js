import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { axiosApi } from "../api/axoisAPI";
import "../css/BookedSeatDetail.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom"; // <-- 추가

const PerformanceDetail = () => {
  const location = useLocation();
  const { mt20id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태 추가
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

  if (loading) {
    return <div className="loading-spinner show"></div>;
  }

  if (!performance) {
    return <div>공연 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side: Performance Info */}
        <div className="w-full lg:w-2/3">
          <img
            src={performance.poster || "/api/placeholder/400/600"}
            alt={performance.prfnm}
            className="w-full max-w-md rounded-lg mb-5"
            onError={(e) => {
              if (e.target.src !== "/api/placeholder/400/600") {
                e.target.src = "/api/placeholder/400/600";
              }
            }}
            style={{
              width: "45%", // 부모 컨테이너의 33%로 설정
            }}
          />
          <table className="w-full mb-5 border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="p-4 text-left">공연명</th>
                <td className="p-4">{performance.prfnm}</td>
              </tr>
              <tr className="border-b">
                <th className="p-4 text-left">장소</th>
                <td className="p-4">{performance.fcltynm}</td>
              </tr>
              <tr className="border-b">
                <th className="p-4 text-left">공연기간</th>
                <td className="p-4">
                  {performance.prfpdfrom} ~ {performance.prfpdto}
                </td>
              </tr>
              <tr className="border-b">
                <th className="p-4 text-left">공연시간</th>
                <td className="p-4">{performance.prfruntime}</td>
              </tr>
              <tr className="border-b">
                <th className="p-4 text-left">출연진</th>
                <td className="p-4">{performance.prfcast}</td>
              </tr>
              <tr className="border-b">
                <th className="p-4 text-left">가격</th>
                <td className="p-4">{performance.pcseguidance}</td>
              </tr>
              <tr className="border-b">
                <th className="p-4 text-left">주소</th>
                <td className="p-4">{performance.adres}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right side: Booking Section */}
        <div className="w-full lg:w-1/3">
          <BookingSection
            mt20id={mt20id}
            performance={performance}
            selectedDate={selectedDate} // selectedDate 상태 전달
            setSelectedDate={setSelectedDate} // 선택된 날짜를 업데이트하는 함수 전달
          />
        </div>
      </div>
    </div>
  );
};

const BookingSection = ({
  mt20id,
  performance,
  selectedDate,
  setSelectedDate,
}) => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const navigate = useNavigate();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // 형식을 YYYY-MM-DD로 변경
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
    const date = arg.date; // 선택된 날짜
    const formattedDate = formatDate(date); // yyyy.mm.dd 형식으로 변환
    setSelectedDate(formattedDate); // 선택된 날짜 상태 업데이트
    const dayName = getDayName(date); // 요일 이름
    setSelectedTimes(performance.schedule[dayName] || []); // 해당 요일의 공연 시간 업데이트
  };

  const handleTimeSelection = async (time, info) => {
    const [year, month, day] = selectedDate.split("-");
    const dateObj = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1 해줍니다.

    const dayNumber = dateObj.getDay() === 0 ? 7 : dateObj.getDay(); // 일요일일 경우 7로 변환

    const seatManageData = {
      mt20id: mt20id, // 공연 아이디
      selectedDate: String(selectedDate), // 선택한 날짜
      selectedTime: String(time), // 선택한 시간
      dayOfWeek: String(dayNumber), // 선택된 날짜의 요일 번호
    };

    try {
      const response = await axiosApi.post(
        "/seatManage/bookingSeat", // 백엔드 엔드포인트와 일치하도록 수정
        seatManageData
      );

      if (response.status === 200) {
        // state와 함께 navigate
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

  // dayCellClassNames 함수 수정
  const dayCellClassNames = (arg) => {
    const date = arg.date;
    const formattedDate = formatDate(date);
    const dayName = getDayName(date);

    // 날짜 비교를 위해 Date 객체로 변환
    const currentDate = new Date(formattedDate);
    const startDate = new Date(performance.prfpdfrom);
    const endDate = new Date(performance.prfpdto);

    if (currentDate < startDate || currentDate > endDate) {
      return "fc-day-disabled";
    }

    let classNames = formattedDate === selectedDate ? "selected-date" : "";

    if (performance.schedule[dayName]) {
      classNames += ` available-date`;
    }

    return classNames;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="calendar-container mb-6">
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
            start: new Date(performance.prfpdfrom),
            end: new Date(performance.prfpdto),
          }}
          dayCellClassNames={dayCellClassNames}
          height="auto"
        />
      </div>
      {/* 선택된 날짜와 공연 시간 */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            선택된 날짜: {selectedDate}
          </h3>
          <div className="space-y-2">
            {selectedTimes.length > 0 ? (
              selectedTimes.map((timeInfo, index) => (
                <button
                  key={`${timeInfo.time}-${index}`} // 고유한 key 추가
                  onClick={() =>
                    handleTimeSelection(timeInfo.time, selectedDate)
                  }
                  className="w-full p-3 text-left border rounded-lg transition-colors hover:bg-blue-100"
                >
                  <span className="font-medium">{timeInfo.time}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({timeInfo.seatStatus})
                  </span>
                </button>
              ))
            ) : (
              <p className="text-gray-500">해당 날짜에 공연이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDetail;
