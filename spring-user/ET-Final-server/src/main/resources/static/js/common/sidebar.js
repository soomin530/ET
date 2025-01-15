document.addEventListener('DOMContentLoaded', function() {
	// 비밀번호 검증이 필요한 페이지들
	const pagesNeedingVerification = ['updateInfo','changePw','addressManagement','membershipOut'];

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
				if (pagesNeedingVerification.includes(targetPage)) {
					// 비밀번호 검증 페이지로 이동
					const passwordInput = document.getElementById('mypage-side-password-input');
					if (passwordInput) passwordInput.focus();
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
