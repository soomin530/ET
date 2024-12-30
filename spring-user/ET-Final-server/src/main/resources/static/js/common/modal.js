// Updated Modal functionality with Naver Login initialization
function openModal(modalId) {
	const modal = document.getElementById(modalId);
	if (modal) {
		modal.style.display = 'flex';
		setTimeout(() => {
			modal.classList.add('show');
			// 로그인 모달이 열릴 때 네이버 로그인 초기화
			if (modalId === 'loginModal') {
				if (document.getElementById('naverIdLogin')) {
					initializeNaverLogin();
				}
			}
		}, 10);
	}
}

function closeModal(modalId) {
	const modal = document.getElementById(modalId);
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => {
			modal.style.display = 'none';
		}, 300);
	}
}

// Close modal when clicking outside
window.onclick = function(event) {
	if (event.target.classList.contains('modal')) {
		closeModal('loginModal');
		closeModal('adminLoginModal');
		closeModal('selectModal');
		closeModal('userSignupModal');
		closeModal('peradmSignupModal');
	}
}