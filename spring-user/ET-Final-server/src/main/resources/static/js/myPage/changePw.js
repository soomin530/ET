// 공통 함수: 쿠키 가져오기
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// 필요한 DOM 요소들 선택
const newPasswordInput = document.querySelector("#newPassword");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const submitBtn = document.querySelector("#submitBtn");
const cancelBtn = document.querySelector(".cancel-btn");

const passwordNote = document.querySelector(".password-note");

// 유효성 검사 결과를 표시할 요소들
const passwordMessage = document.createElement("p");
const confirmPasswordMessage = document.createElement("p");
newPasswordInput.parentElement.append(passwordMessage);
confirmPasswordInput.parentElement.append(confirmPasswordMessage);

// 비밀번호 유효성 검사 함수
function validatePassword(password) {
	// 비밀번호 정규식 (영문자, 숫자, 특수문자 포함 8~12자)
	const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,12}$/;
	return regExp.test(password);
}

// 비밀번호 확인 유효성 검사 함수
function validatePasswordMatch() {
	const password = newPasswordInput.value;
	const confirmPassword = confirmPasswordInput.value;

	if (password !== confirmPassword) {
		confirmPasswordMessage.innerText = "비밀번호가 일치하지 않습니다.";
		confirmPasswordMessage.style.color = "red";
		return false;
	} else {
		confirmPasswordMessage.innerText = "비밀번호가 일치합니다.";
		confirmPasswordMessage.style.color = "green";
		return true;
	}
}

// 비밀번호 실시간 검사
newPasswordInput.addEventListener("input", (e) => {
	const password = e.target.value;

	if (password.trim().length === 0) {
		passwordMessage.innerText = "비밀번호를 입력해주세요. (영어, 숫자, 특수문자 포함 6~12자)";
		passwordMessage.style.color = "gray";
	} else if (!validatePassword(password)) {
		passwordMessage.innerText = "특수문자(!, @, #, $, %, *)를 포함하여 6~12자여야 합니다.";
		passwordMessage.style.color = "red";
	} else {
		passwordMessage.innerText = "유효한 비밀번호입니다.";
		passwordMessage.style.color = "green";
	}

	// 비밀번호 확인 유효성 검사
	validatePasswordMatch();
});

// 비밀번호 확인 실시간 검사
confirmPasswordInput.addEventListener("input", validatePasswordMatch);

// 취소 버튼 클릭 시 이전 페이지로 이동
cancelBtn.addEventListener("click", () => {
	window.history.back();
});

// 폼 제출 버튼 클릭 시
submitBtn.addEventListener("click", () => {
	const newPassword = newPasswordInput.value; // 비밀번호 입력값
	const confirmPassword = confirmPasswordInput.value; // 비밀번호 확인 입력값
	
	const naverFl = getCookie('naverFl');
	    
    if (naverFl === 'Y') {
        alert('네이버 로그인 사용자는 네이버에서 비밀번호를 변경해주세요.');
        window.location.href = '/mypage/memberInfo';
        return;
    }

	// 비밀번호 확인
	if (newPassword !== confirmPassword) {
		alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
		return;
	}

	// 서버로 비밀번호 변경 요청 보내기
	fetch('/mypage/changePw', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json' // 요청의 본문이 JSON 형식임을 서버에 알림
		},
		body: JSON.stringify({ newPassword: newPassword }) // 서버에 보내는 데이터
	})
		.then(response => response.text()) // 서버에서 응답을 텍스트로 받음
		.then(data => {
			if (data > 0) {
				alert('비밀번호가 변경되었습니다.');
				window.location.href = "/";
			} else {
				alert('서버 오류가 발생했습니다.');
			}
		})
		.catch(error => {
			console.error('Error:', error);
			alert('서버 오류가 발생했습니다.');
		});
});

document.addEventListener('DOMContentLoaded', function() {
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
