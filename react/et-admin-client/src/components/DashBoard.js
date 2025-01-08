import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DashBoard.css";
import UserManage from "./UserManage.js";
import { axiosApi } from "../api/axoisAPI";
import PerformanceManage from "./PerformanceManage.js";
import BookedSeatDetail from "./BookedSeatDetail.js";
import BookedSeatManage from "./BookedSeatManage.js";
import SeatSelection from "./SeatSelection.js";
import AnnouncementManage from "./AnnouncementManage.js";
import ManagerEnroll from "./ManagerEnroll.js";
import UserManageDetail from "./UserManageDetail.js";
import AnnouncementDetail from "./AnnouncementDetail.js";
import PerformanceNew from "./PerformanceNew.js";
import PerformanceDetail from "./PerformanceDetail.js";
import { NavLink, Route, Routes } from "react-router";
import ManagerEnrollDetail from "./ManagerEnrollDetail.js";

export default function DashBoard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const response = await axiosApi.post(
          "/admin/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);

          // 토큰에서 이메일 추출
          const payload = JSON.parse(atob(newAccessToken.split(".")[1]));

          // memberEmail로 관리자 권한 확인 API 호출
          const adminCheckResponse = await axiosApi.get("/admin/check", {
            params: {
              memberEmail : payload.memberEmail,
              memberNo : payload.memberNo,
            },
          });

          if (adminCheckResponse.data.isAdmin) {
            setIsAdmin(true);
          } else {
            window.location.href = 'http://localhost:80'; // localhost:80으로 이동
          }
        } else {
          window.location.href = 'http://localhost:80'; // localhost:80으로 이동
        }
      } catch (error) {
        console.error("인증 실패:", error);
        window.location.href = 'http://localhost:80'; // localhost:80으로 이동
      }
    };

    verifyAdmin();
  }, [navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="dash-board-container">
      <h1>관리자 페이지</h1>

      <div className="main-show-container">
        {/* 라우터 탭 */}
        <div className="router-tab-box">
          <NavLink to="/UserManage">유저관리</NavLink>
          <NavLink to="/PerformanceManage">공연관리</NavLink>
          <NavLink to="/BookedSeatManage">예매 좌석 관리</NavLink>
          <NavLink to="/AnnouncementManage">공지사항 관리</NavLink>
          <NavLink to="/ManagerEnroll">업체계정 신청</NavLink>
          <NavLink to="/PerformanceNew">카카오맵 연습</NavLink>
        </div>

        {/* 라우터 콘텐츠 */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<h1>DashBoard 메인</h1>} />
            <Route path="/UserManage" element={<UserManage />} />
            <Route path="/PerformanceManage" element={<PerformanceManage />} />
            <Route path="/BookedSeatManage" element={<BookedSeatManage />} />
            <Route
              path="/AnnouncementManage"
              element={<AnnouncementManage />}
            />
            <Route path="/ManagerEnroll" element={<ManagerEnroll />} />
            <Route path="/member/:memberNo" element={<UserManageDetail />} />
            <Route
              path="/announcement/:announceNo"
              element={<AnnouncementDetail />}
            />
            <Route
              path="/manager/:concertManagerNo"
              element={<ManagerEnrollDetail />}
            />
            <Route
              path="/performance/:mt10ID"
              element={<PerformanceDetail />}
            />
            <Route path="/PerformanceNew" element={<PerformanceNew />} />
            <Route
              path="/seatManage/detail/:mt20id"
              element={<BookedSeatDetail />}
            />
            <Route path="/seatManage/bookingSeat" element={<SeatSelection />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
