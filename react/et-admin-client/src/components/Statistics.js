
import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";

export default function Statistics() {
  const [readCountData, setReadCountData] = useState(null);
  const [likeCountData, setLikeCountData] = useState(null);
  const [commentCountData, setCommentCountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 최대 조회 수 게시글 조회
  const getMaxReadCount = async() => {
    try {
      const response = await axiosApi.get("/admin/maxReadCount");
      if(response.status === 200){
        setReadCountData(response.data);
      }
      
    } catch (error) {
      console.log("최대 조회 수 게시글 조회 중 예외 발생 : " + error);
    }
  }

  // 최대 좋아요 수 게시글 조회
   const getMaxLikeCount = async() => {
    try {
      const response = await axiosApi.get("/admin/maxLikeCount");
      setLikeCountData(response.data); // 서버에서 받은 데이터로 상태 업데이트

    } catch (error) {
      console.log("최대 좋아요 수 게시글 조회 중 예외 발생 : " + error);
    }
  }

  // 최대 댓글 수 게시글 조회
  const getMaxCommentCount = async() => {
    try {
      const response = await axiosApi.get("/admin/maxCommentCount");
      setCommentCountData(response.data); // 서버에서 받은 데이터로 상태 업데이트

    } catch (error) {
      console.log("최대 댓글 수 게시글 조회 중 예외 발생 : " + error);
    }
  }


  // Statistics 컴포넌트가 처음 레더링될 때 콜백 함수 내용
  // -> 위에 만든 비동기 요청 함수 실행
  useEffect(() => {
    getMaxReadCount();
    getMaxLikeCount();
    getMaxCommentCount();
  }, []);

  // readCountData, likeCountData, commentCountData에 변화가 감지될 때 콜백함수 내ㅛㅇㅇ
  // -> isLoading 상태값을 false로 변경하기
  useEffect(() => {
    if(readCountData != null
      && likeCountData != null
      && commentCountData != null) {

        setIsLoading(false);
        
      }
  }, [readCountData, likeCountData, commentCountData]);


  if (isLoading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div>
        {/* 7일 이내 가입한 신규 회원 조회 */}
        <NewMembers/>

        <section className="statistics-section">
          <h2>가장 조회수 많은 게시글</h2>
          <p>게시판 종류 : {readCountData.boardName}</p>
          <p>게시글 번호/제목 : No.{readCountData.boardNo}  / {readCountData.boardTitle}</p>
          <p>게시글 조회 수 : {readCountData.readCount}</p>
          <p>작성자 닉네임 : {readCountData.memberNickname}</p>
        </section>

        <section className="statistics-section">
          <h2>가장 좋아요 많은 게시글</h2>
          <p>게시판 종류 : {likeCountData.boardName}</p>
          <p>게시글 번호/제목 : No.{likeCountData.boardNo}  / {likeCountData.boardTitle}</p>
          <p>게시글 좋아요 수 : {likeCountData.likeCount}</p>
          <p>작성자 닉네임 : {likeCountData.memberNickname}</p>
        </section>

        <section className="statistics-section">
          <h2>가장 댓글 많은 게시글</h2>
          <p>게시판 종류 : {commentCountData.boardName}</p>
          <p>게시글 번호/제목 : No.{commentCountData.boardNo}  / {commentCountData.boardTitle}</p>
          <p>게시글 댓글 수 : {commentCountData.commentCount}</p>
          <p>작성자 닉네임 : {commentCountData.memberNickname}</p>
        </section>
      </div>
    );
  }
}

// 신규 회원 조회
const NewMembers = () => {

  const[NewMembers, setNewMembers] = useState(null);

  useEffect(() => {
    const fetchNewMembers = async() => {
      try {
        const response = await axiosApi.get("/admin/newMember");

        if(response.status === 200){
          setNewMembers(response.data);
        }

      } catch (error) {
        console.log(error);
      }
    }

    fetchNewMembers();

  }, []); // 2번째 인자 빈 배열 -> 

  return(
    <div className="new-members">
      <h2>신규 가입 회원 ({NewMembers?.length}명)</h2>
      <h3>[ 7일 이내 가입 회원 ]</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>회원번호</th>
            <th>이메일</th>
            <th>닉네임</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {NewMembers?.map((member) => (
            <tr key={member.memberNo}>
              <td>{member.memberNo}</td>
              <td>{member.memberEmail}</td>
              <td>{member.memberNickname}</td>
              <td>{member.enrollDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

