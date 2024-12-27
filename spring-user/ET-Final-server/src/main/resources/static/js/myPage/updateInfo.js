// 유효성 검사를 위한 객체
const checkObj = {
     memberNickname: true,  // 닉네임은 현재 값이 유효하다고 초기화
     memberEmail: true,     // 이메일도 현재 값이 유효하다고 초기화
     authKey: false         // 이메일 인증 여부
 };

// 페이지 로드 시 회원 정보 불러오기
 document.addEventListener("DOMContentLoaded", () => {
     loadUserInfo();
	 initializeValidation();
 });

// 회원 정보 불러오기
function loadUserInfo() {

	
    fetch("/mypage/info")
        .then(response => response.json())
        .then(data => {
			
			console.log("데이터", data);
			
            // 폼에 데이터 채우기
            document.getElementById("userId").value = data.memberId || "";
           
            document.getElementById("userPhone").value = data.memberTel || "";
            document.getElementById("userNickname").value = data.memberNickname || "";
            document.getElementById("userEmail").value = data.memberEmail || "";
            
            // 성별 설정
            if (data.memberGender === "M") {
                document.getElementById("male").checked = true;
            } else if (data.memberGender === "F") {
                document.getElementById("female").checked = true;
            }
        })
        .catch(error => {
            console.error("회원 정보 로딩 실패:", error);
            alert("회원 정보를 불러오는데 실패했습니다.");
        });
}



// 폼 제출 처리
document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // 유효성 검사 확인
    if (!checkObj.memberNickname) {
        alert("닉네임이 유효하지 않습니다.");
        document.getElementById("userNickname").focus();
        return;
    }

    if (!checkObj.memberEmail) {
        alert("이메일이 유효하지 않습니다.");
        document.getElementById("userEmail").focus();
        return;
    }

    // 수정된 회원 정보 수집
    const updatedInfo = {
        memberName: document.getElementById("userName").value,
        memberNickname: document.getElementById("userNickname").value,
        memberEmail: document.getElementById("userEmail").value,
        memberBirth: document.getElementById("userBirth").value,
        memberGender: document.querySelector('input[name="gender"]:checked')?.value
    };

    // 서버로 수정 요청 전송
    fetch("/api/member/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInfo)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("회원 정보가 성공적으로 수정되었습니다.");
            location.reload();
        } else {
            alert("회원 정보 수정에 실패했습니다.");
        }
    })
    .catch(error => {
        console.error("수정 요청 오류:", error);
        alert("회원 정보 수정 중 오류가 발생했습니다.");
    });
});

// 취소 버튼 클릭 시 이전 페이지로 이동
document.querySelector(".cancel-btn").addEventListener("click", () => {
    history.back();
});