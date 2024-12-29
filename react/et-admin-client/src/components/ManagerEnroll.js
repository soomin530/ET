import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";


export default function ManagerEnroll() {
  const [enrollList,setEnrollList] = useState([])
  const [selectedValue, setSelectedValue] = useState('이름');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true); // 로딩 상태
  
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

  // 필요한 것들
  // 옵션 목록 (id, 이름)
  const options = [
    { id: 1, label: '이름' },
    { id: 2, label: '전화번호' },
    { id: 3, label: '신청날짜' },
  ];

  //----------------------------------------

  // Restore 컴포넌트가 처음 렌더링 될 때 실행될 함수들
  useEffect(() => {
    getEnrollList();
  }, []);

    // 유저 리스트를 위한 정보
  const getEnrollList = async() => {
      try {
        const resp = await axiosApi.get("/manager/managerEnrollList");
  
        if(resp.status === 200){
          setEnrollList(resp.data);
        }
      } catch (error) {
        console.log("회원 : " + error);
      }
  }

  // 상태가 바뀔때마다 변경
  useEffect(()=> {
    if(enrollList != null){
      setLoading(false);
    }
  }, [enrollList]); // 요청을받아 상태가 업데이트 됐을 때


  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!inputValue || inputValue.trim() === ''){
      alert("검색어를 입력해주세요")
      return;
    }

    const formData = {
      selectedValue: selectedValue,
      inputValue: inputValue  
    };
    
    try {
      const resp = await axiosApi.post("/manager/searchManagerEnrollList",formData);
  
      // 요청 성공 처리
      if (resp.status === 200) {
        const getData = resp.data;
        setEnrollList(getData);
      } else {
        throw new Error('서버 요청 실패');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --------------------- 출력 단 ----------------------------
  
  if(loading){  
    return <h1>Loading...</h1>
  } else {
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
        <div className="main-table-container">
          <ManagerEnrollList enrollList={enrollList} />
        </div>
      </div>
    );
  }
  
}




// -----------------------------------------------------------------------------------------------------------------------------------------------------




const ManagerEnrollList = ({ enrollList }) => {
  return (
    <section>
      {enrollList.length === 0 ? (
        <p>회원이 없습니다.</p>
      ) : (
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
            {enrollList.map((enroll, index) => (
              <tr
              key={index}
              onClick={() => window.location.href = `http://localhost:8081/performance/${enroll.concertManagerNo}`} 
              style={{ cursor: 'pointer' }}>
                <td>{enroll.concertManagerNo}</td>
                <td>{enroll.concertManagerNickname}</td>
                <td>{enroll.concertManagerTel}</td>
                <td>{enroll.concertManagerEnrollDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

