// 유효성 검사를 위한 객체
const mypageCheckObj = {
     memberNickname: false,  // 닉네임은 현재 값이 유효하다고 초기화
     memberEmail: false,     // 이메일도 현재 값이 유효하다고 초기화
     authKey: false         // 이메일 인증 여부
 };

// 페이지 로드 시 회원 정보 불러오기
 document.addEventListener("DOMContentLoaded", () => {
     loadUserInfo();
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
            document.getElementById("verificationEmail").value = data.memberEmail || "";
            
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


// 인증번호 받기 버튼
const verificationBtn = document.querySelector("#verificationBtn");

// 인증번호 입력 input
const verificationCode = document.querySelector("#verificationCode");

// 인증번호 입력 후 확인 버튼
const verificationConfirmBtn = document.querySelector("#verificationConfirmBtn");

// 인증번호 관련 메시지 출력 span
const verificationMessage = document.querySelector("#verificationMessage");

let verificationTimer; 

const verificationMin = 4; // 타이머 초기값 (분)
const verificationSec = 59; // 타이머 초기값 (초)
const verificationTime = "05:00";

// 실제 줄어드는 시간을 저장할 변수
let minit = verificationMin;
let second = verificationSec;

/* 이메일 유효성 검사 */

// 이메일 유효성 검사에 사용될 요소 얻어오기
const verificationEmail = document.querySelector("#verificationEmail");
const verificationEmailMessage = document.querySelector("#verificationEmailMessage");

/* 이메일 인증*/
verificationBtn.addEventListener("input", e => {
	// 작성된 이메일 값 얻어오기
	const verificationInputEmail = e.target.value;

	// 3) 입력된 이메일이 없을 경우
	if (verificationInputEmail.trim().length === 0) {
		verificationEmailMessage.innerText = "메일을 받을 수 있는 이메일을 입력해주세요.";

		// 메시지에 색상을 추가하는 클래스 모두 제거
		verificationEmailMessage.classList.remove('confirm', 'error');

		// 잘못 입력한 띄어쓰기가 있을 경우 없앰
		verificationEmail.value = "";

		return;
	}
});


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
       
        memberNickname: document.getElementById("userNickname").value,
        memberEmail: document.getElementById("userEmail").value,
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

document.addEventListener('DOMContentLoaded', function() {
	console.log("마이페이지 사이드 메뉴 스크립트 로드됨");

	// 비밀번호 검증이 필요한 페이지들
	const pagesNeedingVerification = ['changePw', 'membershipOut'];

	// 현재 활성화된 메뉴 설정
	const setActiveMenu = () => {
		const currentPath = window.location.pathname;
		document.querySelectorAll('.mypage-side-menu-link').forEach(link => {
			link.classList.toggle('active', currentPath.includes(link.dataset.page));
		});
	};


	// 이벤트 핸들러 설정
	const initializeEventHandlers = () => {
		document.querySelectorAll('.mypage-side-menu-link').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetPage = e.target.dataset.page;
				
				// 클릭된 페이지를 세션 스토리지에 저장
	           sessionStorage.setItem('targetPage', targetPage);
			   
				if (pagesNeedingVerification.includes(targetPage)) {
					// 비밀번호 검증 페이지로 이동
					window.location.href = `/mypage/checkPw`;
				} else {
					window.location.href = `/mypage/${targetPage}`;
				}
			});
		});
	};

	// 초기화
	setActiveMenu();
	initializeEventHandlers();
});
