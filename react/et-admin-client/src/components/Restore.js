import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";


export default function Restore() {
  const [selectedValue, setSelectedValue] = useState('');
  const [memberList,setMemberList] = useState([])
  const [withdrawMembers, setWithdrawMembers] = useState([]); // 탈퇴 회원 목록
  const [deleteBoards, setDeleteBoards] = useState([]); // 삭제 게시글 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  

  // 필요한 것들
    // 옵션 목록 (id, 이름)
    const options = [
      { id: 1, label: '회원이름' },
      { id: 2, label: '주소' },
      { id: 3, label: '전화번호' },
    ];
  // 유저관리 

  // 유저 리스트를 위한 정보
  const getShowMemberList = async() => {
    try {
      const resp = await axiosApi.get("/admin/showMemberList");

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

  // withdrawnMembers 또는 deleteboards 상태가 변경될 때마다 실행
  useEffect(()=> {
    if(withdrawMembers != null && deleteBoards != null){
      setLoading(false);
    }
  }, [withdrawMembers, deleteBoards]); // 요청을받아 상태가 업데이트 됐을 때


  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = {
      selectedValue: selectedValue,
    };
    try {
      const response = await fetch('http://localhost:8081/admin/searchShowMemberList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(formData), 
        credentials: 'include', 
      });
  
      // 요청 성공 처리
      if (response.ok) {
        const data = await response.json(); 
        console.log('서버 응답:', data);
        alert('서버에 데이터가 성공적으로 전송되었습니다.');
      } else {
        throw new Error('서버 요청 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('데이터 전송 중 오류가 발생했습니다.');
    }
  };

  if(loading){  
    return <h1>Loading...</h1>
  } else {
    return (
      <div className="menu-box">
        {/* <RestoreMember withdrawMembers={withdrawMembers} restoreMember={restoreMember}/> */}
         {/* <RestoreBoard deleteBoards={deleteBoards} restoreBoard={restoreBoard}/> */}
         <div className="main-title-container"><h1>header</h1></div>
         <div>
      <form>
        <select value={selectedValue} onChange={handleChange}>
          {options.map((option) => (
            <option key={option.id} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        <input />
        <i
          className="fas fa-search search-icon"
          onClick= {handleSubmit}
          style={{ cursor: 'pointer' }} // 클릭 시 커서 모양 변경
        ></i>
      </form>
    </div>
          <div className="main-table-container">
           <ShowMember memberList ={memberList}/>
          </div>
      </div>
    );
  }
  
}




// -----------------------------------------------------------------------------------------------------------------------------------------------------




const ShowMember = ({ memberList }) => {
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
              onClick={() => window.location.href = `http://localhost:8081/member/${member.memberNo}`} 
              style={{ cursor: 'pointer' }}>
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

