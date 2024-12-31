// findMember.js

// =========================================================================
// 전역 변수
// =========================================================================

// 타이머 관련 상수
const TIMER = {
	INIT_MIN: 4,
	INIT_SEC: 59,
	INIT_TIME: "05:00"
};

// 타이머 상태 변수
let idTimerInfo = { min: TIMER.INIT_MIN, sec: TIMER.INIT_SEC };
let pwTimerInfo = { min: TIMER.INIT_MIN, sec: TIMER.INIT_SEC };
let idAuthTimer;
let pwAuthTimer;

// 메시지 상수
const MESSAGE = {
	EMPTY_EMAIL: "메일을 받을 수 있는 이메일을 입력해주세요.",
	INVALID_EMAIL: "알맞은 이메일 형식으로 작성해주세요.",
	VALID_EMAIL: "사용 가능한 이메일입니다.",
	AUTH_SENT: "인증번호가 발송되었습니다.",
	AUTH_VERIFIED: "인증이 완료되었습니다.",
	AUTH_FAILED: "인증번호가 일치하지 않습니다!",
	AUTH_TIMEOUT: "인증번호 입력 제한시간을 초과하였습니다.",
	AUTH_LENGTH: "인증번호를 정확히 입력해주세요.",
	FILL_ALL: "모든 필드를 입력해주세요.",
	SEND_ERROR: "인증번호 발송에 실패했습니다. 다시 시도해주세요."
};

// =========================================================================
// 요소 선택
// =========================================================================

// 폼 요소
const findIdForm = document.getElementById('findIdForm');
const findPwForm = document.getElementById('findPwForm');
const switchIdMode = document.getElementById('switchIdMode');
const switchPwMode = document.getElementById('switchPwMode');

// 이메일 입력 필드
const findIdEmail = document.getElementById('findIdEmail');
const findPwEmail = document.getElementById('findPwEmail');

// 이메일 메시지 요소
const findIdEmailMessage = document.getElementById('findIdEmailMessage');
const findPwEmailMessage = document.getElementById('findPwEmailMessage');

// 인증 메시지 요소
const findIdVerifyMessage = document.getElementById('findIdVerifyMessage');
const findPwVerifyMessage = document.getElementById('findPwVerifyMessage');

// =========================================================================
// 유틸리티 함수
// =========================================================================

const setEmailValidation = () => {
	// 아이디 찾기 이메일 유효성 검사
	if (findIdEmail) {
		findIdEmail.addEventListener('input', e => {
			const inputEmail = e.target.value.trim();
			validateEmailInput(inputEmail, findIdEmailMessage);
		});
	}

	// 비밀번호 찾기 이메일 유효성 검사
	if (findPwEmail) {
		findPwEmail.addEventListener('input', e => {
			const inputEmail = e.target.value.trim();
			validateEmailInput(inputEmail, findPwEmailMessage);
		});
	}
};

// 이메일 입력값 검증 함수
const validateEmailInput = (email, messageElement) => {
	if (email.length === 0) {
		showMessage(messageElement, MESSAGE.EMPTY_EMAIL);
		return false;
	}

	if (!validateEmail(email)) {
		showMessage(messageElement, MESSAGE.INVALID_EMAIL);
		return false;
	}

	showMessage(messageElement, MESSAGE.VALID_EMAIL, true);
	return true;
};


// 이메일 유효성 검사
const validateEmail = email => {
	const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regExp.test(email);
};

const showMessage = (element, message, isSuccess = false) => {
	element.innerText = message;
	element.classList.remove(isSuccess ? "error" : "confirm");
	element.classList.add(isSuccess ? "confirm" : "error");

	// 메시지 박스 강조 애니메이션 추가
	element.style.transition = "transform 0.3s ease";
	element.style.transform = "scale(1.1)";
	setTimeout(() => {
		element.style.transform = "scale(1)";
	}, 300);
};

const showNotification = (message, type = "success") => {
	const notification = document.createElement("div");
	notification.className = `notification ${type}`;
	notification.innerText = message;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.remove();
	}, 3000);
};

// =========================================================================
// 타이머 관리 함수
// =========================================================================

// 타이머 시작
const startTimer = (timerInfo, messageSpan, timer) => {
	return setInterval(() => {
		messageSpan.innerText = `${addZero(timerInfo.min)}:${addZero(timerInfo.sec)}`;

		if (timerInfo.min === 0 && timerInfo.sec === 0) {
			clearInterval(timer);
			messageSpan.classList.add('error');
			return;
		}

		if (timerInfo.sec === 0) {
			timerInfo.sec = 60;
			timerInfo.min--;
		}
		timerInfo.sec--;
	}, 1000);
};

// 타이머 초기화
const resetTimer = (formType) => {
	const timerInfo = formType === 'Id' ? idTimerInfo : pwTimerInfo;
	timerInfo.min = TIMER.INIT_MIN;
	timerInfo.sec = TIMER.INIT_SEC;
};

// =========================================================================
// 이벤트 핸들러 함수
// =========================================================================

// 탭 전환 처리
const handleTabSwitch = (mode) => {
	if (mode === 'id') {
		findIdForm.style.display = 'flex';
		findPwForm.style.display = 'none';
		switchIdMode.style.opacity = '1';
		switchPwMode.style.opacity = '0.7';

		// 입력 값들 초기화
		findPwId.value = '';
		findPwEmail.value = '';
		findPwEmailMessage.innerText = '';
		findPwVerificationCode.value = '';
		findPwVerifyMessage.innerText = '';

	} else {
		findIdForm.style.display = 'none';
		findPwForm.style.display = 'flex';
		switchIdMode.style.opacity = '0.7';
		switchPwMode.style.opacity = '1';

		// 입력 값들 초기화
		findIdEmail.value = '';
		findIdEmailMessage.innerText = '';
		findIdVerificationCode.value = '';
		findIdVerifyMessage.innerText = '';
	}
};

// 인증 번호 받기
const handleSendAuthCode = async (formType) => {
	const emailInput = document.getElementById(`find${formType}Email`);
	const messageSpan = document.getElementById(`find${formType}EmailMessage`);
	const sendButton = document.querySelector(`#find${formType}Form .get-code-btn`);
	const emailValue = emailInput.value.trim();

	// 이메일 입력 확인
	if (!emailValue) {
		showMessage(messageSpan, MESSAGE.EMPTY_EMAIL);
		emailInput.focus();
		return;
	}

	// 이메일 형식 확인
	if (!validateEmail(emailValue)) {
		showMessage(messageSpan, MESSAGE.INVALID_EMAIL);
		emailInput.focus();
		return;
	}

	try {
		// 로딩 상태 표시
		sendButton.disabled = true; // 버튼 비활성화
		sendButton.innerHTML = `<span class="spinner"></span> Sending...`; // 로딩 표시

		const response = await fetch("/email/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: emailValue,
		});

		const result = await response.text();

		if (result === "1") {
			resetTimer(formType);
			const timerInfo = formType === "Id" ? idTimerInfo : pwTimerInfo;
			const timerRef = formType === "Id" ? idAuthTimer : pwAuthTimer;

			clearInterval(timerRef);
			if (formType === "Id") {
				idAuthTimer = startTimer(timerInfo, messageSpan, idAuthTimer);
			} else {
				pwAuthTimer = startTimer(timerInfo, messageSpan, pwAuthTimer);
			}

			// 성공 메시지 표시
			showMessage(messageSpan, MESSAGE.AUTH_SENT, true);

			// 버튼 상태 업데이트
			sendButton.innerText = "Code Sent!";
			setTimeout(() => {
				sendButton.innerText = "Send Code";
				sendButton.disabled = false; // 버튼 다시 활성화
			}, 5000);
		} else {
			showMessage(messageSpan, MESSAGE.SEND_ERROR);
		}
	} catch (error) {
		console.error("인증번호 발송 중 오류:", error);
		showMessage(messageSpan, MESSAGE.SEND_ERROR);
	} finally {
		// 로딩 상태 해제
		if (sendButton.innerText !== "Code Sent!") {
			sendButton.disabled = false;
			sendButton.innerHTML = `Send Code`; // 버튼 텍스트 복원
		}
	}
};


// 인증번호 확인 처리
const handleVerifyAuthCode = async (formType) => {
	const emailInput = document.getElementById(`find${formType}Email`);
	const verifyInput = document.getElementById(`find${formType}VerificationCode`);
	const messageSpan = document.getElementById(`find${formType}VerifyMessage`);
	const timerInfo = formType === 'Id' ? idTimerInfo : pwTimerInfo;

	if (timerInfo.min === 0 && timerInfo.sec === 0) {
		alert(MESSAGE.AUTH_TIMEOUT);
		return;
	}

	if (verifyInput.value.length < 6) {
		alert(MESSAGE.AUTH_LENGTH);
		return;
	}

	try {
		const response = await fetch("/email/checkAuthKey", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: emailInput.value,
				authKey: verifyInput.value
			})
		});
		const result = await response.text();

		if (result === "1") {
			if (formType === 'Id') clearInterval(idAuthTimer);
			else clearInterval(pwAuthTimer);

			emailInput.readOnly = true;
			verifyInput.readOnly = true;
			showMessage(messageSpan, MESSAGE.AUTH_VERIFIED, true);
		} else {
			alert(MESSAGE.AUTH_FAILED);
		}
	} catch (error) {
		console.error("인증번호 확인 중 오류:", error);
		alert(MESSAGE.AUTH_FAILED);
	}
};

// 아이디/비밀번호 찾기 제출 처리
const handleFindSubmit = (formType) => {
	const data = formType === 'Id'
		? {
			email: document.getElementById('findIdEmail').value
		}
		: {
			id: document.getElementById('findPwId').value,
			email: document.getElementById('findPwEmail').value
		};

	if (Object.values(data).some(value => !value)) {
		alert(MESSAGE.FILL_ALL);
		return;
	}

	// TODO: API 호출 구현
	console.log(`${formType} 찾기 요청:`, data);
};

// =========================================================================
// 이벤트 리스너
// =========================================================================

document.addEventListener('DOMContentLoaded', function() {
	// 탭 전환 이벤트
	switchIdMode.addEventListener('click', () => handleTabSwitch('id'));
	switchPwMode.addEventListener('click', () => handleTabSwitch('pw'));

	// 이메일 유효성 검사 초기화
	setEmailValidation();

	// 인증번호 받기 버튼 이벤트
	document.querySelectorAll('.get-code-btn').forEach(button => {
		button.addEventListener('click', function() {
			const formType = this.closest('form').id.includes('Id') ? 'Id' : 'Pw';
			handleSendAuthCode(formType);
		});
	});

	// 인증번호 확인 버튼 이벤트
	document.querySelectorAll('.verify-code-btn').forEach(button => {
		button.addEventListener('click', function() {
			const formType = this.closest('form').id.includes('Id') ? 'Id' : 'Pw';
			handleVerifyAuthCode(formType);
		});
	});

	// 찾기 버튼 이벤트
	document.getElementById('findIdButton').addEventListener('click', () => handleFindSubmit('Id'));
	document.getElementById('findPwButton').addEventListener('click', () => handleFindSubmit('Pw'));

	// 폼 제출 방지
	[findIdForm, findPwForm].forEach(form => {
		form.addEventListener('submit', e => e.preventDefault());
	});
});