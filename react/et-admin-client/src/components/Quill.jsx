import ReactQuill from "react-quill";
import { useRef, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
 width: 100%;
 min-height: 100vh;
 background-color: #f3f4f6;
 padding: 2rem 1rem;
`;

const FormWrapper = styled.div`
 max-width: 1000px;
 margin: 0 auto;
 background-color: white;
 border-radius: 8px;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 padding: 2rem;

 @media (max-width: 768px) {
   padding: 1rem;
 }
`;

const InputGroup = styled.div`
 margin-bottom: 1.5rem;
`;

const Label = styled.label`
 display: block;
 font-size: 1rem;
 font-weight: 500;
 color: #374151;
 margin-bottom: 0.5rem;
`;

const Input = styled.input`
 width: 100%;
 padding: 0.75rem;
 border: 1px solid #d1d5db;
 border-radius: 4px;
 font-size: 1rem;
`;

const EditorWrapper = styled.div`
 margin-bottom: 2rem;

 .quill-editor {
   height: 600px;
   margin-bottom: 3rem;
 }

 @media (max-width: 768px) {
   .quill-editor {
     height: 400px;
   }
 }
`;

const ButtonGroup = styled.div`
 display: flex;
 gap: 1rem;
 justify-content: flex-end;
 margin-top: 2rem;

 @media (max-width: 768px) {
   flex-direction: column;
   margin-top: 1rem;
 }
`;

const Button = styled.button`
 padding: 0.75rem 1.5rem;
 border: none;
 border-radius: 4px;
 font-weight: 500;
 cursor: pointer;
 transition: background-color 0.2s;
 color: white;

 @media (max-width: 768px) {
   width: 100%;
 }
`;

const BackButton = styled(Button)`
 background-color: #4B5563;

 &:hover {
   background-color: #374151;
 }
`;

const SubmitButton = styled(Button)`
 background-color: #10B981; // 초록색으로 변경
 color: white;

 &:hover {
   background-color: #059669; // hover시 더 진한 초록색
 }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative; // 추가: 화살표의 절대 위치 기준점
  display: flex; // 추가: 화살표와 텍스트 정렬
  align-items: center;
  justify-content: center;
`;


const BackArrow = styled.i`
  position: absolute;
  left: 0;
  color: #ff7f27;
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(-5px);
  }
`;

function Write() {
 const modules = {
   toolbar: {
     container: [
       //["image"],
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
         'Content-Type': 'multipart/form-data',
       },
       withCredentials: true,
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
   <Container>
     <FormWrapper>
     <Title>
          <BackArrow
            className="fas fa-arrow-left"
            onClick={() => window.history.back()}
          />
          공연장 정보 수정
        </Title>

       <InputGroup>
         <Label htmlFor="title">제목</Label>
         <Input 
           id="title" 
           type="text" 
           onChange={handleTitleChange}
         />
       </InputGroup>
       
       <EditorWrapper>
         <ReactQuill
           className="quill-editor"
           modules={modules}
           onChange={setContent}
         />
       </EditorWrapper>

       <ButtonGroup>
         <BackButton onClick={() => window.history.back()}>
           취소
         </BackButton>
         <SubmitButton onClick={handleSubmit}>
           등록
         </SubmitButton>
       </ButtonGroup>
     </FormWrapper>
   </Container>
 );
}

export default Write;