import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";


export default function AnnouncementManage() {
  const [announcementList,setAnnouncementList] = useState([])
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
    { id: 1, label: '제목' },
    { id: 2, label: '내용' },
    { id: 3, label: '등록날짜' },
  ];

  //----------------------------------------

  // Restore 컴포넌트가 처음 렌더링 될 때 실행될 함수들
  useEffect(() => {
    getAnnouncementList();
  }, []);

    // 공지사항 리스트를 위한 정보
  const getAnnouncementList = async() => {
      try {
        const resp = await axiosApi.get("/announcementDetail/showAnnouncementList");
  
        if(resp.status === 200){
          setAnnouncementList(resp.data);
          console.log(resp.data);
        }
      } catch (error) {
        console.log("회원 : " + error);
      }
  }

  // 상태가 바뀔때마다 변경
  useEffect(()=> {
    if(announcementList != null){
      setLoading(false);
    }
  }, [announcementList]); // 요청을받아 상태가 업데이트 됐을 때


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
      const resp = await axiosApi.post("/announcementDetail/searchAnnouncementList",formData);
  
      // 요청 성공 처리
      if (resp.status === 200) {
        const getData = resp.data;
        setAnnouncementList(getData);
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
          <h4>공지사항</h4>
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
          <AnnouncementList announcementList={announcementList} />
        </div>
      </div>
    );
  }
  
}




// -----------------------------------------------------------------------------------------------------------------------------------------------------




const AnnouncementList = ({ announcementList }) => {
  return (
    <section>
      {announcementList.length === 0 ? (
        <p>회원이 없습니다.</p>
      ) : (
        <table className="table-border">
          <thead>
            <tr>
              <th>등록번호</th>
              <th>제목</th>
              <th>등록날짜</th>
            </tr>
          </thead>
          <tbody>
            {announcementList.map((announcement, index) => (
              <tr
              key={index}
              onClick={() => window.location.href = `http://localhost:8081/announcementDetail/${announcement.announcementNo}`} 
              style={{ cursor: 'pointer' }}>
                <td>{announcement.announceNo}</td>
                <td>{announcement.announceTitle}</td>
                <td>{announcement.announceWriteDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

