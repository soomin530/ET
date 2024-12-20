import React, { useContext } from 'react';
import '../css/DashBoard.css';
import Restore from './Restore.js';
import Manager from './Manager.js';
import Statistics from './Statistics.js';
import { AuthContext } from './AuthContext.js';

import { NavLink, Route, Routes } from 'react-router';



// react-router-dom 이용한 라우팅 방법
// react-router-dom : React 애플리케이션에서 라우팅을 구현하기 위해 사용하는 라이브러리
// 라우팅(router) : 사용자가 요청한 URL 경로에 따라 적절한 페이지 or 리소스 제공하는 과정
export default function DashBoard() {

  const globalState = useContext(AuthContext);

  return (
      <div className='dash-board-container'>
        <h1>관리자 페이지</h1>

        <div className='admin-info'>
          <p>현재 접속 관리자 : {globalState.user.memberNickname}</p>
          <button onClick={globalState.handleLogout}>로그아웃</button>
        </div>

        <div className='router-tab-box'>
          <NavLink to="/restore">복구</NavLink>
          <NavLink to="/statistics">통계</NavLink>
          <NavLink to="/manager">관리자</NavLink>
        </div>

        <Routes>
          <Route path='/' element={<h1>DashBoard 메인</h1>}/>
          <Route path='/restore' element={<Restore/>}/>
          <Route path='/statistics' element={<Statistics/>}/>
          <Route path='/manager' element={<Manager/>}/>
        </Routes>
      </div>
  )
}