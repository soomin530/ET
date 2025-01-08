import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import "../css/BookedSeatManage.css";
import defaultPoster from "../images/default-poster.png";
import { useNavigate } from "react-router-dom";

// 메인 컴포넌트
const PerformanceList = () => {
  const [performances, setPerformances] = useState([]);
  const [selectedValue, setSelectedValue] = useState("이름");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const options = [
    { id: 1, label: "공연명" },
    { id: 2, label: "공연장" },
    { id: 3, label: "날짜" },
  ];

  useEffect(() => {
    loadPerformances();
  }, []);

  const loadPerformances = async () => {
    try {
      const response = await axiosApi.get(`/seatManage/performanceList`);

      if (response.status === 200) {
        setPerformances(response.data);
      }
    } catch (error) {
      console.error("공연 데이터 로드 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue || inputValue.trim() === "") {
      alert("검색어를 입력해주세요");
      return;
    }

    const formData = {
      selectedValue: selectedValue,
      inputValue: inputValue,
    };

    try {
      const response = await axiosApi.post(
        "/seatManage/searchPerformanceList",
        formData
      );

      if (response.status === 200) {
        setPerformances(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div className="loading-spinner show"></div>;
  }

  return (
    <div className="menu-box">
      <div className="main-title-container">
        <h4>업체계정신청</h4>
      </div>
      <div>
        <form>
          <select value={selectedValue} onChange={handleChange}>
            {options.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <i
            className="fas fa-search search-icon"
            onClick={handleSubmit}
            style={{ cursor: "pointer" }} // 클릭 시 커서 모양 변경
          ></i>
        </form>
      </div>
      <ShowPerformanceList performances={performances} />
    </div>
  );
};

// 공연 목록 표시 컴포넌트
const ShowPerformanceList = ({ performances }) => {
  const navigate = useNavigate();
  // 별점 표시 컴포넌트
  const StarRating = ({ rating }) => {
    const fullStars = "★".repeat(Math.floor(rating));
    const emptyStars = "☆".repeat(5 - Math.floor(rating));
    return (
      <div className="review-stars">
        <span className="static-stars">{fullStars + emptyStars}</span>
        <span className="numeric-rating">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="performance-container">
      {performances.length === 0 ? (
        <p>등록된 공연이 없습니다.</p>
      ) : (
        <div className="performance-grid">
          {performances.map((performance, index) => (
            <div
              key={`${performance.performanceNo}-${index}`}
              className="performance-item"
              onClick={() => navigate(`/seatManage/detail/${performance.mt20id}`)}
            >
              <div className="image-container">
                <img
                  src={performance.poster || defaultPoster}
                  alt={performance.prfnm}
                  className="performance-image"
                  onError={(e) => {
                    if (e.target.src !== defaultPoster) {
                      e.target.src = defaultPoster;
                    }
                  }}
                  onLoad={(e) => {
                    e.target.classList.add("loaded");
                  }}
                />
              </div>
              <div className="performance-info">
                <div className="performance-title">{performance.prfnm}</div>
                <div className="performance-date">
                  <span>{performance.prfpdfrom}</span> ~
                  <span>{performance.prfpdto}</span>
                </div>
                <div className="performance-venue">{performance.fcltynm}</div>
                {performance.prfreviewRank && (
                  <StarRating rating={performance.prfreviewRank} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceList;
