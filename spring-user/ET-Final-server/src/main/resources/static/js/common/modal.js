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
		closeModal('noticeDetailModal');
		closeModal('findIdPwModal');
		
	} else if(event.target.classList.contains('noticeModal')) {
		closeModal('noticeDetailModal');
		
	}
	
}

function checkCapsLock(event) {
	// 이벤트가 발생한 입력창의 ID를 확인
	const inputId = event.target.id;
	let messageId;
	
	// 입력창 ID에 따라 메시지 div ID 결정
	if (inputId === 'memberLoginPw') {
			messageId = 'checkPwMessage';
	} else if (inputId === 'concertManagerLoginPw') {
			messageId = 'adminCheckPwMessage';
	}
	
	// 해당하는 메시지 div에 메시지 표시
	if (event.getModifierState("CapsLock")) {
			document.getElementById(messageId).innerText = "Caps Lock이 켜져있습니다.";
	} else {
			document.getElementById(messageId).innerText = "";
	}
}