import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ManagerEnrollDetail = () => {
  const { concertManagerNo } = useParams(); // URL에서 memberNo 가져오기
  const [formData, setFormData] = useState({
    nickname: '',
    address: '',
    tel: '',
  });
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태 추가

  useEffect(() => {
    axios
      .get(`http://localhost:8081/manager/${concertManagerNo}`)
      .then((response) => {
        console.log("API 응답 데이터:", response.data);
        // response.data[0]로 접근해야 함 (배열의 첫 번째 요소)
        const memberData = response.data[0];  // 여기를 수정
        setFormData({
          nickname: memberData.concertManagerNickname || '',
          tel: memberData.concertManagerTel || '',
          company: memberData.concertManagerCompany || '',
          comment: memberData.concertManagerCompanyComment || '',
          email: memberData.concertManagerEmail || '',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [concertManagerNo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 서버 형식에 맞게 데이터 변환
    const serverFormData = {
      memberNickname: formData.nickname,
      memberAddress: formData.address,
      memberTel: formData.tel,
    };
    
    axios
      .post(`http://localhost:8081/manager/update/${concertManagerNo}`, serverFormData)
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert('회원 정보 수정에 실패했습니다.');
      });
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 로딩 메시지 출력
  }

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>닉네임:</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>전화번호:</label>
          <input
            type="text"
            name="address"
            value={formData.tel || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>회사명:</label>
          <input
            type="text"
            name="tel"
            value={formData.company || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>코멘트:</label>
          <input
            type="text"
            name="tel"
            value={formData.comment || ''}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="text"
            name="tel"
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={() => window.history.back()}>
        뒤로가기
        </button>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default ManagerEnrollDetail;
