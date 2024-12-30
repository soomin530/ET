// 공통 함수: 쿠키 가져오기
const getCookie = (name) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
};

// 공통 함수: 페이지 접근 처리
const handlePageAccess = (targetPage) => {
	const accessToken = getCookie('Access-Token');
	if (accessToken) {
		window.location.href = `/mypage/${targetPage}`;
	} else {
		const modalvf = document.getElementById('passwordModal');
		modalvf.style.display = 'flex';
		// 현재 타겟 페이지를 저장
		sessionStorage.setItem('targetPage', targetPage);
	}
};

// 각 버튼 클릭 이벤트
document.querySelectorAll('.updateInfo, .changePw, .membershipOut').forEach(button => {
	button.addEventListener('click', (e) => {
		// e.target.classList[0]이 정의되어 있는지 확인
		const targetClass = e.target.classList[0];
		if (targetClass) {
			const pageType = targetClass.replace('.', '');
			if (pageType === 'changePw') {
				const modalvf = document.getElementById('passwordModal');
				modalvf.style.display = 'flex';
			}
			handlePageAccess(pageType);
		}
	});
});


// 모달 관련 이벤트
document.getElementById('clsModal').addEventListener('click', clsModal);
document.getElementById('passwordInput').addEventListener('keydown', e => {
	if (e.key === 'Enter') verifyPassword();
});
document.getElementById('passwordModal').addEventListener('click', () => {
	console.log("modal background clicked");
});
document.querySelector('.modalContent').addEventListener('click', e => e.stopPropagation());

// 모달 닫기 함수
function clsModal() {
	const modalvf = document.getElementById('passwordModal');
	modalvf.style.display = 'none';
	document.getElementById('passwordInput').value = '';
	document.getElementById('errorMsg').style.display = 'none';
	// 저장된 타겟 페이지 제거
	sessionStorage.removeItem('targetPage');
}

// 로딩 상태 표시
function showLoading(isLoading) {
	const loadingSpinner = document.getElementById('loadingSpinner');
	if (isLoading) {
		loadingSpinner.style.display = 'block'; // 로딩 스피너 보이기
	} else {
		loadingSpinner.style.display = 'none'; // 로딩 스피너 숨기기
	}
}

// 비밀번호 확인 함수
async function verifyPassword() {
	const passwordInput = document.getElementById('passwordInput');
	const errorMsg = document.getElementById('errorMsg');
	const password = passwordInput.value;

	if (!password) {
		errorMsg.textContent = '비밀번호를 입력해주세요.';
		errorMsg.style.display = 'block';
		return;
	}

	showLoading(true); // 로딩 시작

	try {
		const formData = new FormData();
		formData.append("memberPw", password);

		const response = await fetch('/mypage/verifyPassword', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (result === 1) {
			// 저장된 타겟 페이지로 이동
			const targetPage = sessionStorage.getItem('targetPage') || 'updateInfo';
			window.location.href = `/mypage/${targetPage}`;
		} else {
			errorMsg.textContent = '비밀번호가 일치하지 않습니다.';
			errorMsg.style.display = 'block';
			passwordInput.value = '';
			passwordInput.focus();
		}
	} catch (error) {
		console.error('비밀번호 확인 중 오류 발생:', error);
		errorMsg.textContent = '서버 통신 중 오류가 발생했습니다.';
		errorMsg.style.display = 'block';
	}
}