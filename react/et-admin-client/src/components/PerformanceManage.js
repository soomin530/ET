import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import { useNavigate } from "react-router-dom";
import "./PerformanceNew.js";
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

const TableContainer = styled.div`
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  table-layout: auto;
`;

const TableHeader = styled.th`
  padding: 15px;
  background-color: #ff7f27;
  color: white;
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  vertical-align: middle;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #fff3e0;
  }
  cursor: pointer;
  border-bottom: 1px solid #eeeeee;
  height: 50px;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  color: #333;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
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

  if (totalItems === 0) return null;

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

// PerformanceList 컴포넌트
const PerformanceList = ({
  performanceList,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = performanceList.slice(indexOfFirstItem, indexOfLastItem);

  // 전체 목록 기준 번호 생성 함수
  const getListNumber = (index) => {
    return indexOfFirstItem + index + 1;
  };

  return (
    <section>
      {performanceList.length === 0 ? (
        <p>등록된 공연장이 없습니다.</p>
      ) : (
        <>
          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader style={{ width: "10%" }}>번호</TableHeader>
                  <TableHeader style={{ width: "30%" }}>
                    공연 시설명
                  </TableHeader>
                  <TableHeader style={{ width: "40%" }}>주소</TableHeader>
                  <TableHeader style={{ width: "20%" }}>전화번호</TableHeader>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((performance, index) => (
                  <TableRow
                    key={performance.mt10ID}
                    onClick={() =>
                      navigate(`/performance/${performance.mt10ID}`)
                    }
                  >
                    <TableCell>{getListNumber(index)}</TableCell>
                    <TableCell>{performance.fcltynm}</TableCell>
                    <TableCell>{performance.adres}</TableCell>
                    <TableCell>{performance.telno}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </TableContainer>
          <Pagination
            totalItems={performanceList.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
};

// 메인 PerformanceManage 컴포넌트
export default function PerformanceManage() {
  const [performanceList, setPerformanceList] = useState([]);
  const [selectedValue, setSelectedValue] = useState("시설명");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();

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
    { id: 1, label: "시설명" },
    { id: 2, label: "주소" },
    { id: 3, label: "전화번호" },
  ];

  const getPerformanceList = async () => {
    try {
      const resp = await axiosApi.get("/performance/showPerformanceList");
      if (resp.status === 200) {
        setPerformanceList(resp.data);
      }
    } catch (error) {
      console.log("공연장 : " + error);
    }
  };

  useEffect(() => {
    getPerformanceList();
  }, []);

  useEffect(() => {
    if (performanceList != null) {
      setLoading(false);
    }
  }, [performanceList]);

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
      const resp = await axiosApi.post(
        "/performance/searchPerformanceList",
        formData
      );

      if (resp.status === 200) {
        const getData = resp.data;
        setPerformanceList(getData);
        setCurrentPage(1); // 검색 후 첫 페이지로 이동
      } else {
        throw new Error("서버 요청 실패");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="menu-box">
      <TitleContainer
        onClick={() => {
          getPerformanceList();
          setCurrentPage(1);
          setInputValue("");
          setSelectedValue("제목");
        }}
      >
        <h4>공연장관리</h4>
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
          />
          <i
            className="fas fa-search search-icon"
            onClick={handleSubmit}
            style={{ cursor: "pointer" }}
          />
        </form>
      </div>

      <div className="main-table-container" style={{ textAlign: "center" }}>
        <PerformanceList
          performanceList={performanceList}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="write-button-container">
        <button
          className="write-button"
          onClick={() => navigate("/PerformanceNew")}
        >
          신규등록
        </button>
      </div>
    </div>
  );
}
