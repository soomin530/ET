import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { axiosApi } from '../api/axoisAPI';
import ReactQuill from 'react-quill';


function Write() {
  const { announceNo } = useParams(); // URL에서 memberNo 가져오기
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태 추가


  useEffect(() => {
    axios
      .get(`http://localhost:8081/announcement/${announceNo}`)
      .then((response) => {
        console.log("API 응답 데이터:", response.data);
        // response.data[0]로 접근해야 함 (배열의 첫 번째 요소)
        const AnnounceData = response.data[0];  // 여기를 수정
        setFormData({
          title: AnnounceData.announceTitle || '',
          content: AnnounceData.announceContent || '',
        });
        setTitle(AnnounceData.announceTitle || ''); // title 업데이트
        setContent(AnnounceData.announceContent || ''); // content 업데이트
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [announceNo]);


  const modules = {
    toolbar: {
      container: [
        ["image"],
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "underline"],
      ],
    },
  };

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  console.log(content);
  
  const handleTitleChange = (e) => {
    setTitle(e.currentTarget.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    // announceNo를 문자열로 변환
    formData.append("announceNo", String(announceNo));
    
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios({
        url: 'http://localhost:8081/announcement/update',
        method: 'POST',
        data: formData,
        withCredentials: true,
      });
  
          // 서버에서 반환한 값이 1이면 새로고침, 0이면 실패 alert
    if (response.data === 1) {
      // 새로고침
      window.location.reload();
    } else {
      // 실패 alert
      alert('업데이트 실패');
    }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div>
        <label htmlFor="title">제목</label>
        <input id="title" type="text" value={title} onChange={handleTitleChange} />
      
        <ReactQuill
          style={{ width: "800px", height: "600px" }}
          modules={modules}
          value={content} 
          onChange={setContent}
        />
      </div>
      
      <div className='Btn-Box'>
      <button onClick={() => window.history.back()}>
        뒤로가기
      </button>
      <button style={{ marginTop: "10px" }} onClick={handleSubmit}>
        제출
      </button>
      </div>
      
    </>
  );
}

export default Write;
