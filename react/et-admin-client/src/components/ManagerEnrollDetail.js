import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/ManagerEnrollDetail.css'

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

  const handleAgree = () => {
    axios
      .post(`http://localhost:8081/manager/agree/${concertManagerNo}`)
      .then((response) => {
        alert('승인이 완료되었습니다.');
        window.history.back();
      })
      .catch((error) => {
        console.error(error);
        alert('승인 처리에 실패했습니다.');
      });
  };
  
  const handleDelete = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      axios
        .post(`http://localhost:8081/manager/delete/${concertManagerNo}`)
        .then((response) => {
          alert('삭제가 완료되었습니다.');
          window.history.back();
        })
        .catch((error) => {
          console.error(error);
          alert('삭제 처리에 실패했습니다.');
        });
    }
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
    <div className="manager-enroll-container">
      <div className="manager-enroll-form-wrapper">
        <h1 className="manager-enroll-title">회원 정보 수정</h1>
        <form onSubmit={handleSubmit} className="manager-enroll-form">
          <div className="form-group">
            <label className="form-label">닉네임:</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">전화번호:</label>
            <input
              type="text"
              name="tel"
              value={formData.tel || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">회사명:</label>
            <input
              type="text"
              name="company"
              value={formData.company || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">코멘트:</label>
            <input
              type="text"
              name="comment"
              value={formData.comment || ''}
              onChange={handleChange}
              className="form-input"
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">이메일:</label>
            <input
              type="text"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={() => window.history.back()} className="back-button">
              뒤로가기
            </button>
            <button type="button" onClick={handleAgree} className="submit-button">
              허가
            </button>
            <button type="button" onClick={handleDelete} className="delete-button" style={{ backgroundColor: '#dc3545' }}>
              삭제
            </button>
          </div>
        </form>
      </div>
    </div>
   );
  };

export default ManagerEnrollDetail;
