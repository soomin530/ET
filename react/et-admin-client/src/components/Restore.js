import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";


export default function Restore() {
  const [withdrawMembers, setWithdrawMembers] = useState([]); // 탈퇴 회원 목록
  const [deleteBoards, setDeleteBoards] = useState([]); // 삭제 게시글 목록
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 필요한 것들?
  // 유저관리 

  // 유저 리스트를 위한 정보
  const getUserManagemnetList = async() => {
    try {
      
    } catch (error) {
      console.log("회원 : " + error);
    }
  }

  // 탈퇴한 회원 목록 조회용 비동기 요청 함수
  const getWithdrawnMemberList =  async() => {
    try {
      const resp = await axiosApi.get("/admin/withdrawnMemberList");

      console.log(resp.data);
      if(resp.status === 200){
        
        setWithdrawMembers(resp.data);
       
      }

    } catch(error){
      console.log("탈퇴회원 목록 중 예외 발생 :" + error);
    }
  }
  // 탈퇴한 회원 복구 비동기 요청 함수 
  const restoreMember = async(member) => {
    if(window.confirm(member.memberNickname + "님을 탈퇴 복구 시키겠습니까?")) {

      try {
        const response = await axiosApi.put("/admin/restoreMember", {memberNo : member.memberNo})

        console.log(response);
        if(response.status === 200)
          alert("복구되었습니다.");
          getWithdrawnMemberList();
      } catch (error) {
        console.log(error);
      }
    }
  }
  //----------------------------------------

  // 삭제한 게시글 목록 조회용 비동기 함수
  const getDeleteBoardList = async() => {

    try {
      const response = await axiosApi.get("/admin/deletedBoardList");
      if(response.status === 200){
        setDeleteBoards(response.data);

      }
    } catch (error) {
      console.log("삭제된 게시글 목록 중 예외 발생 :" + error);
    }
  }
  // 삭제한 게시글 복구 비동기 요청 함수
  const restoreBoard = async(board) => {
    if(window.confirm(board.boardNo + "게시글을 복구 시키겠습니까?")){
      try {
        const response = await axiosApi.put("/admin/restoreBoard", {boardNo : board.boardNo})

        console.log(response);
        if(response.status === 200)
          alert("복구되었습니다.");
          getDeleteBoardList();
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Restore 컴포넌트가 처음 렌더링 될 때 getWidthdrawnMemberList, getDeleteVBoardList 함수를 실행

  useEffect(() => {
    getWithdrawnMemberList();
    getDeleteBoardList();
  }, []);

  // withdrawnMembers 또는 deleteboards 상태가 변경될 때마다 실행
  useEffect(()=> {
    if(withdrawMembers != null && deleteBoards != null){
      setLoading(false);
    }
  }, [withdrawMembers, deleteBoards]); // 요청을받아 상태가 업데이트 됐을 때



  if(loading){  
    return <h1>Loading...</h1>
  } else {
    return (
      <div className="menu-box">
        {/* <RestoreMember withdrawMembers={withdrawMembers} restoreMember={restoreMember}/> */}
         {/* <RestoreBoard deleteBoards={deleteBoards} restoreBoard={restoreBoard}/> */}
         <div className="main-title-container"><h1>header</h1></div>
         <div className="main-select-container">
            <select>
              <option>넘버1</option>
              <option>넘버2</option>
              <option>넘버3</option>
              <option>넘버4</option>
            </select>
            <input></input>

         </div>
      </div>
    );
  }
  
}





// -----------------------------------------------------------------------------------------------------------------------------------------------------








const RestoreMember = ({withdrawMembers, restoreMember}) => {
  return (
    <section className="section-border">
        <h2>탈퇴 회원 복구</h2>

        <h3>탈퇴한 회원 목록</h3>
        
          {withdrawMembers.length === 0 ? (
          <p>탈퇴한 회원이 없습니다.</p>
        ) : (
              withdrawMembers.map((member, index) => {
                return (
                  <ul className="ul-border" key={index}>
                    <li>회원번호 : {member.memberNo}</li>
                    <li>회원 이메일 :{member.memberEmail}</li>
                    <li>회원 닉네임:{member.memberNickname}</li>
                    <button className="restoreBtn" onClick={()=> restoreMember(member)}>복구</button>
                  </ul>
                );
              })
            )}
        
      </section>
  );
};

const RestoreBoard = ({deleteBoards,restoreBoard}) => {
  return (
    <section className="section-border">
        <h2>삭제 게시글 복구</h2>

        <h3>삭제된 게시글 목록</h3>

        {deleteBoards.length === 0 ? (
          <p>삭제된 게시글이 없습니다.</p>
        ) : (
          deleteBoards.map((board,index) => {
            return (
              <ul className="ul-border" key={index}>
                <li>게시글 번호: {board.boardNo}</li>
                <li>게시글 카테고리 : {board.boardName}</li>
                <li>게시글 제목 : {board.boardTitle}</li>
                <li>작성자 닉네임 : {board.memberNickname}</li>
                <button className="restoreBtn" onClick={()=> restoreBoard(board)}>복구</button>
              </ul>
            );
          })

        )}

      </section>
  );
};

