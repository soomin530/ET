import ReactQuill from "react-quill";
import { useRef,useState } from "react";
import { axiosApi } from "../api/axoisAPI";

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
        url: '/announcementDetail/upload',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data', // 자동으로 multipart/form-data로 설정됩니다
        },
        withCredentials: true, // 쿠키 포함 여부
      }).then((res) => console.log(res));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <label htmlFor="title">제목</label>
        <input id="title" type="text" onChange={handleTitleChange} />
      
        <ReactQuill
          style={{ width: "800px", height: "600px" }}
          modules={modules}
          onChange={setContent}
        />
      </div>
      
      <button style={{ marginTop: "50px" }} onClick={handleSubmit}>
        제출
      </button>
    </>
  );
}

export default Write;
