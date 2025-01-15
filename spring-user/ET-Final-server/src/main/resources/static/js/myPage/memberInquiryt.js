document.getElementById('inquiryForm').addEventListener('submit', function(e) {
	e.preventDefault();

	// 입력값 검증
	const title = document.getElementById('inquiryTitle').value.trim();
	const content = document.getElementById('inquiryContent').value.trim();
	let isValid = true;

	if (title === '') {
		document.getElementById('titleError').style.display = 'block';
		isValid = false;
	} else {
		document.getElementById('titleError').style.display = 'none';
	}

	if (content === '') {
		document.getElementById('contentError').style.display = 'block';
		isValid = false;
	} else {
		document.getElementById('contentError').style.display = 'none';
	}

	if (isValid) {
		// FormData 객체 생성
		const formData = new FormData(this);

		// FormData를 객체로 변환
		const data = {};
		formData.forEach((value, key) => {
			data[key] = value;
		});

		fetch('/mypageApi/inquiryWrite', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					alert('문의가 정상적으로 등록되었습니다.');
					location.href = '/mypage/memberInquirytList';
				} else {
					alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
				}
			})
			.catch(error => {
				console.error('Error:', error);
				alert('문의 등록 중 오류가 발생했습니다.');
			});
	}
});

// 쿠키 가져오는 함수
function getNaverCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}


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

				// 쿠키에서 네이버 로그인 여부 확인
				const naverFl = getCookie('naverFl');

				// 네이버 로그인 사용자이거나, 비밀번호 검증이 필요없는 페이지인 경우 바로 이동
				if (naverFl === 'Y' || !pagesNeedingVerification.includes(targetPage)) {
					window.location.href = `/mypage/${targetPage}`;
					return;
				}

				// 그 외의 경우 비밀번호 검증 페이지로 이동
				sessionStorage.setItem('targetPage', targetPage);
				window.location.href = `/mypage/checkPw`;
			});
		});
	};

	// 초기화
	setActiveMenu();
	initializeEventHandlers();
});
