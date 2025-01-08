import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/MemberDetail.css'

const MemberUpdate = () => {
  const { memberNo } = useParams();
  const [formData, setFormData] = useState({
    nickname: '',
    address: '',
    tel: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/member/${memberNo}`)
      .then((response) => {
        console.log("API 응답 데이터:", response.data);
        const memberData = response.data[0];
        setFormData({
          nickname: memberData.memberNickname || '',
          address: memberData.memberAddress || '',
          tel: memberData.memberTel || '',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [memberNo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`http://localhost:8081/member/delete/${memberNo}`);
      if (response.status === 200) {
        alert('회원이 삭제되었습니다.');
        window.history.back();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('회원 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const serverFormData = {
      memberNickname: formData.nickname,
      memberAddress: formData.address,
      memberTel: formData.tel,
    };
    
    axios
      .post(`http://localhost:8081/member/update/${memberNo}`, serverFormData)
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert('회원 정보 수정에 실패했습니다.');
      });
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="member-update-container">
      <div className="member-update-form-wrapper">
        <h1 className="member-update-title">회원 정보 수정</h1>
        <form onSubmit={handleSubmit} className="member-update-form">
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
            <label className="form-label">주소:</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
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
          <div className="button-group">
              <button type="button" onClick={() => window.history.back()} className="back-button">
                뒤로가기
              </button>
              <button type="submit" className="submit-button">
                수정하기
              </button>
              <button type="button" onClick={handleDelete} className="delete-button">
                회원삭제
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default MemberUpdate;