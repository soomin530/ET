import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI.js";
import { useNavigate } from "react-router-dom";
import "./Quill.jsx";
import axios from "axios";

export default function InquiryManage() {
  const [inquiryList, setInquiryList] = useState([]);
  const [selectedValue, setSelectedValue] = useState("제목");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isReplied, setIsReplied] = useState(false); // 토글 상태 추가

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

  // 필요한 것들
  // 옵션 목록 (id, 이름)
  const options = [
    { id: 1, label: "제목" },
    { id: 2, label: "내용" },
    { id: 3, label: "등록날짜" },
  ];

  //----------------------------------------

  // Restore 컴포넌트가 처음 렌더링 될 때 실행될 함수들
  useEffect(() => {
    getInquiryList();
  }, []);

  // 공지사항 리스트를 위한 정보
  const getInquiryList = async () => {
    try {
      const replyStatus = isReplied ? "Y" : "N";
      const resp = await axiosApi.post("/inquiry/showInquiryList", {
        replyIs: replyStatus,
      });

      if (resp.status === 200) {
        console.log(resp.data);
        setInquiryList(resp.data);
      }
    } catch (error) {
      console.log("회원 : " + error);
    }
  };

  const handleToggle = () => {
    setIsReplied(!isReplied);
  };

  useEffect(() => {
    getInquiryList();
  }, [isReplied]);

  // 상태가 바뀔때마다 변경
  useEffect(() => {
    if (inquiryList != null) {
      setLoading(false);
    }
  }, [inquiryList]); // 요청을받아 상태가 업데이트 됐을 때

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue || inputValue.trim() === "") {
      alert("검색어를 입력해주세요");
      return;
    }
    const replyStatus = isReplied ? "Y" : "N";

    const formData = {
      selectedValue: selectedValue,
      inputValue: inputValue,
      replyIs: replyStatus,
    };

    try {
      const resp = await axiosApi.post(
        "/inquiry/searchInquiryList",
        formData
      );

      // 요청 성공 처리
      if (resp.status === 200) {
        const getData = resp.data;
        setInquiryList(getData);
      } else {
        throw new Error("서버 요청 실패");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --------------------- 출력 단 ----------------------------

  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div className="menu-box">
        <div className="main-title-container">
          <h4>문의내역</h4>
        </div>
        <div className="search-and-toggle-container">
          <div className="toggle-container">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isReplied}
                onChange={handleToggle}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">
              {isReplied ? "답변 완료" : "미답변"}
            </span>
          </div>
          <div className="search-container">
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
              ></i>
            </form>
          </div>
        </div>
        <div className="main-table-container">
          <AnnouncementList inquiryList={inquiryList} />
        </div>
        <div className="write-button-container">
          <button className="write-button" onClick={() => navigate("/quill")}>
            글쓰기
          </button>
        </div>
      </div>
    );
  }
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------

const AnnouncementList = ({ inquiryList }) => {
  const navigate = useNavigate();

  const handleDelete = async (e, inquiryNo) => {
    e.stopPropagation(); // 행 클릭 이벤트 전파 방지

    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        const response = await axios.post(
          `http://localhost:8081/inquiry/delete/${inquiryNo}`
        );
        if (response.data > 0) {
          alert("문의사항이 삭제되었습니다.");
          window.location.reload(); // 페이지 새로고침
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("삭제 중 에러 발생:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <section>
      {inquiryList.length === 0 ? (
        <p>문의사항이 없습니다.</p>
      ) : (
        <table className="table-border">
          <thead>
            <tr>
              <th>등록번호</th>
              <th>제목</th>
              <th>등록날짜</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {inquiryList.map((inquiry, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/inquiry/${inquiry.inquiryNo}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{inquiry.inquiryNo}</td>
                <td>{inquiry.inquiryTitle}</td>
                <td>{inquiry.inquiryDate}</td>
                <td>
                  <button
                    className="delete--button"
                    onClick={(e) => handleDelete(e, inquiry.inquiryNo)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
