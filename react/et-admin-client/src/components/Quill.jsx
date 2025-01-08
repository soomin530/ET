import ReactQuill from "react-quill";
import { useRef,useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import "../css/AnnouncementDetail.css"

function Write() {
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

  const handleTitleChange = (e) => {
    setTitle(e.currentTarget.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async () => {
    const date = new Date();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("date", date);
    if (file) {
      formData.append("file", file);
    }
    

    try {
      await axiosApi({
        url: '/announcement/upload',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data', // 자동으로 multipart/form-data로 설정됩니다
        },
        withCredentials: true, // 쿠키 포함 여부
      }).then((response) => {
        if(response.data > 0){
          alert("공지사항이 등록되었습니다")
          window.history.back();
        }
        else{
          alert("정보 수정이 실패하였습니다")
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="write-container">
      <div className="write-form-wrapper">
        <div className="input-group">
          <label className="form-label" htmlFor="title">제목</label>
          <input 
            id="title" 
            type="text" 
            onChange={handleTitleChange} 
            className="form-input"
          />
        </div>
        
        <div className="editor-wrapper">
          <ReactQuill
            className="quill-editor"
            modules={modules}
            onChange={setContent}
          />
        </div>

        <div className="button-group">
          <button 
            className="back-button"
            onClick={() => window.history.back()}
          >
            취소
          </button>
          <button 
            className="submit-button"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default Write;
