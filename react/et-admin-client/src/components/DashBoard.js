import React, { useContext } from 'react';
import '../css/DashBoard.css';
import UserManage from './UserManage.js';
import PerformanceManage from './PerformanceManage.js';
import BookedSeatManage from './BookedSeatManage.js';
import AnnouncementManage from './AnnouncementManage.js';
import ManagerEnroll from './ManagerEnroll.js';
import MemberDetail from './MemberDetail.js';
import AnnouncementDetail from './AnnouncementDetail.js';
import Quill from './Quill.jsx';
import { AuthContext } from './AuthContext.js';

import { NavLink, Route, Routes } from 'react-router';
import ManagerEnrollDetail from './ManagerEnrollDetail.js';



// react-router-dom 이용한 라우팅 방법
// react-router-dom : React 애플리케이션에서 라우팅을 구현하기 위해 사용하는 라이브러리
// 라우팅(router) : 사용자가 요청한 URL 경로에 따라 적절한 페이지 or 리소스 제공하는 과정
export default function DashBoard() {

  const globalState = useContext(AuthContext);

  return (
      <div className='dash-board-container'>
          <h1>관리자 페이지</h1>

          {/* <div className='admin-info'>
            <p>현재 접속 관리자 : {globalState.user.memberNickname}</p>
            <button onClick={globalState.handleLogout}>로그아웃</button>
          </div> */}

          <div className='main-show-container'>
            <div className='router-tab-box'>
              <NavLink to="/UserManage">유저관리</NavLink>
              <NavLink to="/PerformanceManage">공연관리</NavLink>
              <NavLink to="/BookedSeatManage">예매 좌석 관리</NavLink>
              <NavLink to="/AnnouncementManage">공지사항 관리</NavLink>
              <NavLink to="/ManagerEnroll">업체계정 신청</NavLink>
              <NavLink to="/Quill">퀼 연습</NavLink>
            </div>

            
            <Routes>
              <Route path='/' element={<h1>DashBoard 메인</h1>}/>
              <Route path='/UserManage' element={<UserManage />}/>
              <Route path='/PerformanceManage' element={<PerformanceManage/>}/>
              <Route path='/BookedSeatManage' element={<BookedSeatManage/>}/>
              <Route path='/AnnouncementManage' element={<AnnouncementManage/>}/>
              <Route path='/ManagerEnroll' element={<ManagerEnroll/>}/>
              <Route path='/Quill' element={<Quill/>}/>
              <Route path="/member/:memberNo" element={<MemberDetail />} /> 
              <Route path="/announcement/:announceNo" element={<AnnouncementDetail />} /> 
              <Route path="/manager/:concertManagerNo" element={<ManagerEnrollDetail />} />
            </Routes>
          </div>
    </div>
  )
}