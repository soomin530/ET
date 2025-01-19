import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import "../css/BookedSeatManage.css";
import defaultPoster from "../images/default-poster.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

// 페이지네이션 스타일 컴포넌트
const PaginationContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 30px;
  padding: 20px 0;
`;

const PageButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.active ? "#ff7f27" : "#e0e0e0")};
  border-radius: 4px;
  background-color: ${(props) => (props.active ? "#ff7f27" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.active ? "#ff7f27" : "#fff3e0")};
    border-color: #ff7f27;
    color: ${(props) => (props.active ? "white" : "#ff7f27")};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ArrowButton = styled(PageButton)`
  width: 32px;
  font-size: 12px;
  font-weight: bold;
`;

const TitleContainer = styled.div`
  width: fit-content;
  margin: 20px auto;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff7f27 0%, #ff9f5b 100%);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(255, 127, 39, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;

  h4 {
    margin: 0;
    font-size: 24px;
    color: white;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
  }

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

// 페이지네이션 컴포넌트
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageRange = 5;
  const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  const endPage = Math.min(totalPages, startPage + pageRange - 1);

  // totalPages > 1 조건 제거
  return (
    <PaginationContainer>
      <ArrowButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        {"<<"}
      </ArrowButton>
      <ArrowButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </ArrowButton>

      {[...Array(endPage - startPage + 1)].map((_, index) => {
        const pageNumber = startPage + index;
        return (
          <PageButton
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            active={currentPage === pageNumber}
          >
            {pageNumber}
          </PageButton>
        );
      })}

      <ArrowButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </ArrowButton>
      <ArrowButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </ArrowButton>
    </PaginationContainer>
  );
};

// 메인 컴포넌트
const PerformanceList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [performances, setPerformances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(
    searchParams.get("selectedValue") || "공연명"
  );
  const [inputValue, setInputValue] = useState(
    searchParams.get("inputValue") || ""
  );
  const [loading, setLoading] = useState(true);

  // currentPage가 변경될 때마다 상단으로 스크롤
  useEffect(() => {
    const container = document.querySelector(".main-content");
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

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
          inputValue: input,
        },
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
      inputValue: inputValue,
    });

    await performSearch(selectedValue, inputValue);
  };

  if (loading) {
    return <div className="loading-spinner show"></div>;
  }

  return (
    <div className="menu-box">
      <TitleContainer
        onClick={() => {
          loadPerformances();
          setCurrentPage(1);
          setInputValue("");
          setSelectedValue("제목");
          setSearchParams({}); // 쿼리스트링 초기화 추가
        }}
      >
        <h4>예매좌석관리</h4>
      </TitleContainer>
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
      <ShowPerformanceList
        performances={performances}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

const ShowPerformanceList = ({ performances, currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemsPerPage = 12;

  const handlePerformanceClick = (mt20id) => {
    navigate(`/seatManage/detail/${mt20id}`);
  };

  // 현재 페이지에 해당하는 공연만 필터링하는 로직 추가
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPerformances = performances.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
          {currentPerformances.map((performance, index) => (
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
      <Pagination
        totalItems={performances.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PerformanceList;
