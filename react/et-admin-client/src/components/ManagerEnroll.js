import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

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
  border: 1px solid ${props => props.active ? '#ff7f27' : '#e0e0e0'};
  border-radius: 4px;
  background-color: ${props => props.active ? '#ff7f27' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? '0.5' : '1'};
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${props => props.active ? '#ff7f27' : '#fff3e0'};
    border-color: #ff7f27;
    color: ${props => props.active ? 'white' : '#ff7f27'};
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
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const pageRange = 5;
  const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  const endPage = Math.min(totalPages, startPage + pageRange - 1);

  return (
    <PaginationContainer>
      <ArrowButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        {'<<'}
      </ArrowButton>
      <ArrowButton 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
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
        {'>'}
      </ArrowButton>
      <ArrowButton 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {'>>'}
      </ArrowButton>
    </PaginationContainer>
  );
};

// ManagerEnrollList 컴포넌트
const ManagerEnrollList = ({ enrollList, currentPage, itemsPerPage, onPageChange }) => {
  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = enrollList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      {enrollList.length === 0 ? (
        <p>신청 내역이 없습니다.</p>
      ) : (
        <>
          <table className="table-border">
            <thead>
              <tr>
                <th>신청번호</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>신청날짜</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((enroll) => (
                <tr
                  key={enroll.concertManagerNo}
                  onClick={() => navigate(`/manager/${enroll.concertManagerNo}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{enroll.concertManagerNo}</td>
                  <td>{enroll.concertManagerNickname}</td>
                  <td>{enroll.concertManagerTel}</td>
                  <td>{enroll.concertManagerEnrollDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalItems={enrollList.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
};

// 메인 ManagerEnroll 컴포넌트
export default function ManagerEnroll() {
  const [enrollList, setEnrollList] = useState([]);
  const [selectedValue, setSelectedValue] = useState('이름');
  const [inputValue, setInputValue] = useState('');
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
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const options = [
    { id: 1, label: '이름' },
    { id: 2, label: '전화번호' },
    { id: 3, label: '신청날짜' },
  ];

  const getEnrollList = async () => {
    try {
      const resp = await axiosApi.get("/manager/managerEnrollList");
      if (resp.status === 200) {
        setEnrollList(resp.data);
      }
    } catch (error) {
      console.log("회원 : " + error);
    }
  };

  useEffect(() => {
    getEnrollList();
  }, []);

  useEffect(() => {
    if (enrollList != null) {
      setLoading(false);
    }
  }, [enrollList]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue || inputValue.trim() === '') {
      alert("검색어를 입력해주세요");
      return;
    }

    const formData = {
      selectedValue: selectedValue,
      inputValue: inputValue
    };

    try {
      const resp = await axiosApi.post("/manager/searchManagerEnrollList", formData);

      if (resp.status === 200) {
        const getData = resp.data;
        setEnrollList(getData);
        setCurrentPage(1); // 검색 후 첫 페이지로 이동
      } else {
        throw new Error('서버 요청 실패');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="menu-box">
      <TitleContainer onClick={() => {
        getEnrollList();
        setCurrentPage(1);
        setInputValue('');
        setSelectedValue('이름');
      }}>
        <h4>업체계정신청</h4>
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

      <div className="main-table-container" style={{ textAlign: 'center' }}>
        <ManagerEnrollList
          enrollList={enrollList}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}