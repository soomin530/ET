import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import "../css/BookedSeatManage.css";
import defaultPoster from "../images/default-poster.png";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

// 메인 컴포넌트
const PerformanceList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [performances, setPerformances] = useState([]);
  const [selectedValue, setSelectedValue] = useState(
    searchParams.get("selectedValue") || "공연명"
  );
  const [inputValue, setInputValue] = useState(
    searchParams.get("inputValue") || ""
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedParam = searchParams.get("selectedValue");
    const inputParam = searchParams.get("inputValue");

    if (selectedParam && inputParam) {
      performSearch(selectedParam, inputParam);
    } else {
      loadPerformances();
    }
  }, []);

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
  ];

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

  const performSearch = async (selected, input) => {
    try {
      const response = await axiosApi.get("/seatManage/searchPerformanceList", {
        params: {
          selectedValue: selected,
          inputValue: input
        }
      });
      
      if (response.status === 200) {
        setPerformances(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
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

    setLoading(true);
    // URL 파라미터 업데이트
    setSearchParams({
      selectedValue: selectedValue,
      inputValue: inputValue
    });
    
    await performSearch(selectedValue, inputValue);
  };

  if (loading) {
    return <div className="loading-spinner show"></div>;
  }

  return (
    <div className="menu-box">
      <div className="main-title-container">
        <h4>예매 좌석 관리</h4>
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
            placeholder="검색어를 입력하세요"
          />
          <i
            className="fas fa-search search-icon"
            onClick={handleSubmit}
            style={{ cursor: "pointer" }}
          ></i>
        </form>
      </div>
      <ShowPerformanceList performances={performances} />
    </div>
  );
};

const ShowPerformanceList = ({ performances }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePerformanceClick = (mt20id) => {
    navigate(`/seatManage/detail/${mt20id}`);
  };

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
              onClick={() => handlePerformanceClick(performance.mt20id)}
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