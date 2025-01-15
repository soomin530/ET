import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import { NavLink, Route, Routes } from "react-router-dom";
import UserManage from "./UserManage";
import BookedSeatManage from "./BookedSeatManage";
import InquiryManage from "./InquiryManage";
import ManagerEnroll from "./ManagerEnroll";

const StyledNavLink = styled(NavLink)`
  text-decoration: none; // 밑줄 제거
  color: inherit; // 링크 색상이 부모 요소의 색상에 따르도록 설정
`;

// 배경 그라데이션 애니메이션
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 구름 움직임 애니메이션
const floatAnimation = keyframes`
  0% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  100% { transform: translateX(-10px); }
`;

// 메인 컨테이너
const DashboardContainer = styled.div`
   min-height: 80vh;
  padding: 2rem;
  background: ${props => {
    const hour = props.hour;
    switch (true) {
      case hour >= 5 && hour < 7: // 새벽
        return 'linear-gradient(120deg, #646464 0%, #b5b5b5 50%, #f0d2a8 100%)';
      case hour >= 7 && hour < 12: // 아침
        return 'linear-gradient(120deg, #87CEEB 0%, #B2E2F2 50%, #E6F3F8 100%)';
      case hour >= 12 && hour < 16: // 점심
        return 'linear-gradient(120deg, #4B9CD3 0%, #87CEEB 50%, #B2E2F2 100%)';
      case hour >= 16 && hour < 19: // 오후
        return 'linear-gradient(120deg, #375D81 0%, #4B9CD3 50%, #87CEEB 100%)';
      case hour >= 19 && hour < 21: // 저녁
        return 'linear-gradient(120deg, #1E3F66 0%, #375D81 50%, #4B9CD3 100%)';
      default: // 밤
        return 'linear-gradient(120deg, #0A1F33 0%, #1E3F66 50%, #375D81 100%)';
    }
  }};
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
      const hour = props.hour;
      if (hour >= 19 || hour < 5) {
        return 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)';
      }
      return 'none';
    }};
    pointer-events: none;
  }
`;

// 추가적으로 시간대별 분위기를 더하기 위한 장식 요소
const SkyDecoration = styled.div`
  position: absolute;
  top: ${props => props.top || '10%'};
  left: ${props => props.left || '10%'};
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  opacity: ${props => props.opacity || '0.6'};
  border-radius: 50%;
  background: white;
  filter: blur(4px);
  animation: ${floatAnimation} ${props => props.duration || '3s'} ease-in-out infinite;
`;

// 시간 표시 컴포넌트
const TimeDisplay = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  color: white;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
`;

// 날짜 표시 컴포넌트
const DateDisplay = styled.div`
  font-size: 1.5rem;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

// 날씨 카드 컨테이너
const WeatherCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  color: white;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

// 날씨 아이콘
const WeatherIcon = styled.div`
  font-size: 6rem;
  margin: 1rem 0;
  animation: ${floatAnimation} 3s ease-in-out infinite;
`;

// 환영 메시지
const WelcomeMessage = styled.h1`
  font-size: 2rem;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeIn 1s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

// 인포 그리드
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

// 인포 카드
const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  color: white;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 2rem;
    font-weight: bold;
  }
`;

export default function Main() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("☀️");
  const [dataList, setDataList] = useState({});

  useEffect(() => {
    getDataList();
  }, []);

  // 공지사항 리스트를 위한 정보
  const getDataList = async () => {
    try {
      const resp = await axiosApi.get("/admin/data");

      if (resp.status === 200) {
        setDataList(resp.data[0]);
      }
    } catch (error) {
      console.log("회원 : " + error);
    }
  };

  // 시간 업데이트 효과
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 인사말 설정 효과
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour >= 7 && hour < 12) {
      setGreeting("좋은 아침입니다");
      setWeatherIcon("🌅");
    } else if (hour >= 12 && hour < 16) {
      setGreeting("좋은 오후입니다");
      setWeatherIcon("☀️");
    } else if (hour >= 16 && hour < 20) {
      setGreeting("좋은 저녁입니다");
      setWeatherIcon("🌇");
    } else {
      setGreeting("좋은 밤입니다");
      setWeatherIcon("🌙");
    }
  }, [currentTime]);

  return (
    <DashboardContainer hour={currentTime.getHours()}>
      {currentTime.getHours() >= 19 || currentTime.getHours() < 5 ? (
        // 밤에는 별들 추가
        <>
          <SkyDecoration top="15%" left="20%" size="3px" opacity="0.8" duration="4s" />
          <SkyDecoration top="45%" left="80%" size="2px" opacity="0.6" duration="5s" />
          <SkyDecoration top="75%" left="40%" size="4px" opacity="0.7" duration="6s" />
        </>
      ) : currentTime.getHours() >= 5 && currentTime.getHours() < 19 ? (
        // 낮에는 구름 효과 추가
        <>
          <SkyDecoration top="10%" left="30%" size="50px" opacity="0.3" duration="20s" />
          <SkyDecoration top="20%" left="70%" size="40px" opacity="0.2" duration="25s" />
        </>
      ) : null}
      <WelcomeMessage>{greeting}, 관리자님</WelcomeMessage>

      <TimeDisplay>
        {currentTime.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </TimeDisplay>

      <DateDisplay>
        {currentTime.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </DateDisplay>

      <WeatherCard>
        <WeatherIcon>{weatherIcon}</WeatherIcon>
      </WeatherCard>

      <InfoGrid>
        <StyledNavLink to="/UserManage">
          <InfoCard>
            <h3>총 회원 수</h3>
            <p>{dataList.totalMember}</p>
          </InfoCard>
        </StyledNavLink>

        <StyledNavLink to="/BookedSeatManage">
          <InfoCard>
            <h3>진행중인 공연</h3>
            <p>{dataList.performanceNow}</p>
          </InfoCard>
        </StyledNavLink>

        <StyledNavLink to="/InquiryManage">
          <InfoCard>
            <h3>신규 문의</h3>
            <p>{dataList.newInquiry}</p>
          </InfoCard>
        </StyledNavLink>

        <StyledNavLink to="/ManagerEnroll">
          <InfoCard>
            <h3>신규 업체 신청</h3>
            <p>{dataList.newEnroll}</p>
          </InfoCard>
        </StyledNavLink>
      </InfoGrid>
      <Routes>
        <Route path="UserManage" element={<UserManage />} />
        <Route path="BookedSeatManage" element={<BookedSeatManage />} />
        <Route path="InquiryManage" element={<InquiryManage />} />
        <Route path="ManagerEnroll" element={<ManagerEnroll />} />
      </Routes>
    </DashboardContainer>
  );
}
