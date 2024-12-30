// 필요한 DOM 요소들 선택
const changePasswordForm = document.querySelector('form');
const newPasswordInput = document.querySelector('input[placeholder="새 비밀번호"]');
const confirmPasswordInput = document.querySelector('input[placeholder="새 비밀번호 확인"]');
const cancelBtn = document.querySelector('.cancel-btn');

// 비밀번호 유효성 검사 함수
function validatePassword(password) {
    // 8~12자 검사
    if (password.length < 8 || password.length > 12) return false;

    let containsLetter = /[a-zA-Z]/.test(password);
    let containsNumber = /[0-9]/.test(password);
    let containsSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // 3가지 조합 중 2가지 이상 포함 검사
    let combinationCount = 0;
    if (containsLetter) combinationCount++;
    if (containsNumber) combinationCount++;
    if (containsSpecial) combinationCount++;

    return combinationCount >= 2;
}

// 취소 버튼 클릭 이벤트
cancelBtn.addEventListener('click', () => {
    // 이전 페이지로 이동
    window.history.back();
});

// 폼 제출 이벤트
changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 비밀번호 일치 여부 확인
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
        confirmPasswordInput.focus();
        return;
    }

    // 비밀번호 유효성 검사
    if (!validatePassword(newPassword)) {
        alert('비밀번호는 8~12자 이내로 영문, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.');
        newPasswordInput.focus();
        return;
    }

    try {
        const response = await fetch('/mypage/changePw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: newPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            window.location.href = '/mypage/updateInfo'; // 변경 성공 시 이동할 페이지
        } else {
            alert(data.message || '비밀번호 변경에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
});

// 입력 필드 실시간 유효성 검사
let timer;
newPasswordInput.addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        const isValid = validatePassword(e.target.value);
        e.target.style.borderColor = isValid ? '#ddd' : '#ff4d4f';
    }, 500);
});

// 비밀번호 확인 실시간 검사
confirmPasswordInput.addEventListener('input', (e) => {
    if (newPasswordInput.value === e.target.value) {
        e.target.style.borderColor = '#ddd';
    } else {
        e.target.style.borderColor = '#ff4d4f';
    }
});

document.addEventListener('DOMContentLoaded', function() {
	console.log("마이페이지 사이드 메뉴 스크립트 로드됨");
	
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
				window.location.href = `/mypage/${targetPage}`;
			});
		});
	};

	// 초기화
	setActiveMenu();
	initializeEventHandlers();
});
