import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import { useNavigate} from "react-router-dom";

export default function UserManage() {
  const [selectedValue, setSelectedValue] = useState('회원이름');
  const [inputValue, setInputValue] = useState('');
  const [memberList,setMemberList] = useState([])
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
    { id: 1, label: '회원이름' },
    { id: 2, label: '주소' },
    { id: 3, label: '전화번호' },
  ];

  // 유저 리스트를 위한 정보
  const getShowMemberList = async() => {
    try {
      const resp = await axiosApi.get("/member/showMemberList");

      if(resp.status === 200){
        setMemberList(resp.data);
      }
    } catch (error) {
      console.log("회원 : " + error);
    }
  }


  //----------------------------------------


  // Restore 컴포넌트가 처음 렌더링 될 때 실행될 함수들
  useEffect(() => {
    getShowMemberList();
  }, []);


  // 상태가 바뀔때마다 변경
  useEffect(()=> {
    if(memberList != null){
      setLoading(false);
    }
  }, [memberList]); // 요청을받아 상태가 업데이트 됐을 때


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
      // const resp = await fetch('http://localhost:8081/admin/searchShowMemberList', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json', 
      //   },
      //   body: JSON.stringify(formData), 
      //   credentials: 'include', 
      // });
      // == axiosAPI가 이걸 줄여주는 거임
      const resp = await axiosApi.post("/member/searchShowMemberList",formData);
  
      // 요청 성공 처리
      if (resp.status === 200) {
        const getData = resp.data;

        //console.log('memberList:', memberList);
        setMemberList(getData);
      } else {
        throw new Error('서버 요청 실패');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if(loading){  
    return <h1>Loading...</h1>
  } else {
    return (
      <div className="menu-box">
        {/* <RestoreMember withdrawMembers={withdrawMembers} restoreMember={restoreMember}/> */}
        {/* <RestoreBoard deleteBoards={deleteBoards} restoreBoard={restoreBoard}/> */}
        <div className="main-title-container">
          <h4>유저관리</h4>
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
          <ShowMember memberList={memberList} />
        </div>
      </div>
    );
  }
  
}




// -----------------------------------------------------------------------------------------------------------------------------------------------------




const ShowMember = ({ memberList }) => {
  const navigate = useNavigate();
  return (
    <section>
      {memberList.length === 0 ? (
        <p>회원이 없습니다.</p>
      ) : (
        <table className="table-border">
          <thead>
            <tr>
              <th>회원번호</th>
              <th>회원 이름</th>
              <th>회원 주소</th>
              <th>전화번호</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, index) => (
              <tr
              key={index}
              onClick={() => navigate(`/member/${member.memberNo}`)}
              style={{ cursor: 'pointer' }}
            >
                <td>{member.memberNo}</td>
                <td>{member.memberNickname}</td>
                <td>{member.memberAddress}</td>
                <td>{member.memberTel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

