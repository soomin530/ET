// 로그인 버튼
const perfmgrBtn = document.getElementById("perf-login-Btn");

// id/pw
const concertManagerLoginId = document.getElementById("concertManagerLoginId");
const concertManagerLoginPw = document.getElementById("concertManagerLoginPw");

// 로그인
const perfmgrLogin = () => {
	// 입력 검증
	if (concertManagerLoginId.value.length === 0) {
		alert("아이디를 입력해주세요.");
		concertManagerLoginId.focus();
		return;
	}

	if (concertManagerLoginPw.value.length === 0) {
		alert("비밀번호를 입력해주세요.");
		concertManagerLoginPw.focus();
		return;
	}

	const form = new FormData();
	form.append('concertManagerId', concertManagerLoginId.value);
	form.append('concertManagerPw', concertManagerLoginPw.value);

	fetch("/perfmgr/login", {
		method: "POST",
		body: form
	})
		.then(response => {
			if (response.status === 401) {
				throw new Error("인증 실패");
			}
			return response.json();
		})
		.then(data => {
			// 로컬 스토리지에 액세스 토큰 저장
			localStorage.setItem('accessToken', data.accessToken);
			localStorage.setItem('userType', 'perfmgr'); // 공연관리자 타입 저장

			// 성공시 페이지 리다이렉트
			window.location.href = '/';
		})
		.catch(error => {
			if (error.message === "인증 실패") {
				alert("아이디 또는 비밀번호가 일치하지 않습니다.");
			} else {
				console.error("로그인 에러:", error);
				alert("로그인 처리 중 오류가 발생했습니다.");
			}
		});
};

// 로그인 버튼 클릭 이벤트
perfmgrBtn.addEventListener("click", perfmgrLogin);

// id/pw 입력 필드에서 엔터키 누를 때 로그인 수행
concertManagerLoginId.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		perfmgrLogin();
	}
});

concertManagerLoginPw.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		perfmgrLogin();
	}
});

// JWT 토큰을 사용한 로그아웃
function perfLogoutSession() {
	fetch("/perfmgr/logout", {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
		}
	})
		.then(response => {
			// localStorage에서 토큰과 관련 정보 제거
			localStorage.removeItem('accessToken');
			localStorage.removeItem('userType');

			// 쿠키에서 관련 정보 제거
			document.cookie = 'Refresh-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			document.cookie = 'Access-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

			// 메인 페이지로 이동
			window.location.href = "/";
		})
		.catch(error => {
			console.error("로그아웃 중 오류 발생:", error);

			// 에러 발생시에도 토큰과 정보 제거
			localStorage.removeItem('accessToken');
			localStorage.removeItem('userType');
			document.cookie = 'Refresh-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			document.cookie = 'Access-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

			alert("로그아웃 중 문제가 발생했습니다.");
			window.location.href = "/";
		});
}

// 유효성 검사 여부를 기록할 객체
const managerCheckObj = {
	"managerAuthKey": false,
	"concertManagerEmail": false,
	"concertManagerId": false,
	"concertManagerPw": false,
	"concertManagerPwConfirm": false,
	"concertManagerNickname": false,
	"concertManagerTel": false,
	"concertManagerCompany": false,
	"concertManagerCompanyComment": false
};

// ---------------------------------
// 인증번호 관련 요소
const managerSendAuthKeyBtn = document.querySelector("#managerSendAuthKeyBtn");
const managerAuthKey = document.querySelector("#managerAuthKey");
const managerCheckAuthKeyBtn = document.querySelector("#managerCheckAuthKeyBtn");
const managerAuthKeyMessage = document.querySelector("#managerAuthKeyMessage");

/* 이메일 유효성 검사 */
const managerEmail = document.querySelector("#managerEmail");
const managerEmailMessage = document.querySelector("#managerEmailMessage");

managerEmail.addEventListener("input", e => {
	const inputEmail = e.target.value;

	if (inputEmail.trim().length === 0) {
		managerEmailMessage.innerText = "메일을 받을 수 있는 이메일을 입력해주세요.";
		managerEmailMessage.classList.remove('confirm', 'error');
		managerEmail.value = "";
		return;
	}

	const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	if (!regExp.test(inputEmail)) {
		managerEmailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요.";
		managerEmailMessage.classList.add('error');
		managerEmailMessage.classList.remove('confirm');
		return;
	}

	// 중복 검사
	fetch("/perfmgr/checkEmail?concertManagerEmail=" + inputEmail)
		.then(resp => resp.text())
		.then(count => {
			if (count == 1) {
				managerEmailMessage.innerText = "이미 사용중인 이메일 입니다.";
				managerEmailMessage.classList.add("error");
				managerEmailMessage.classList.remove("confirm");
				managerCheckObj.concertManagerEmail = false;
				return;
			}

			managerEmailMessage.innerText = "사용 가능한 이메일입니다.";
			managerEmailMessage.classList.add("confirm");
			managerEmailMessage.classList.remove("error");
			managerCheckObj.concertManagerEmail = true;
		})
		.catch(error => console.log(error));
});

// 인증번호 받기 버튼 클릭 시
managerSendAuthKeyBtn.addEventListener("click", () => {
	if (managerCheckObj.concertManagerEmail) {
		managerCheckObj.managerAuthKey = false;
		managerAuthKeyMessage.innerText = "";

		min = initMin;
		sec = initSec;
		clearInterval(authTimer);

		fetch("/email/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: managerEmail.value
		})
			.then(resp => resp.text())
			.then(result => {
				if (result == 1) {
					console.log("인증 번호 발송 성공");
				} else {
					console.log("인증 번호 발송 실패");
				}
			});

		managerAuthKeyMessage.innerText = initTime;
		managerAuthKeyMessage.classList.remove("confirm", "error");

		alert("인증번호가 발송되었습니다.");

		authTimer = setInterval(() => {
			managerAuthKeyMessage.innerText = `${addZero(min)}:${addZero(sec)}`;

			if (min == 0 && sec == 0) {
				managerCheckObj.managerAuthKey = false;
				clearInterval(authTimer);
				managerAuthKeyMessage.classList.add('error');
				managerAuthKeyMessage.classList.remove('confirm');
				return;
			}

			if (sec == 0) {
				sec = 60;
				min--;
			}

			sec--;
		}, 1000);
	} else {
		alert("이메일을 다시 확인해 주세요.");
		managerEmail.focus();
	}
});

// 전달받은 숫자가 10 미만인 경우 앞에 0을 붙여서 반환
function addZero(number) {
	return number < 10 ? "0" + number : number;
}

// 인증하기 버튼 클릭 시
managerCheckAuthKeyBtn.addEventListener("click", () => {
	if (min === 0 && sec === 0) {
		alert("인증번호 입력 제한시간을 초과하였습니다.");
		return;
	}

	if (managerAuthKey.value.length < 6) {
		alert("인증번호를 정확히 입력해 주세요.");
		return;
	}

	const obj = {
		"email": managerEmail.value,
		"authKey": managerAuthKey.value
	};

	fetch("/email/checkAuthKey", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(obj)
	})
		.then(resp => resp.text())
		.then(result => {
			if (result == 0) {
				alert("인증번호가 일치하지 않습니다!");
				managerCheckObj.managerAuthKey = false;
				return;
			}

			clearInterval(authTimer);

			$("#managerEmail").attr("readonly", true);
			$("#managerAuthKey").attr("readonly", true);

			managerAuthKeyMessage.innerText = "인증 되었습니다.";
			managerAuthKeyMessage.classList.remove("error");
			managerAuthKeyMessage.classList.add("confirm");

			managerCheckObj.managerAuthKey = true;
		});
});

/* ID 유효성 검사 */
const concertManagerId = document.querySelector("#concertManagerId");
const managerIdMessage = document.querySelector("#managerIdMessage");

concertManagerId.addEventListener("input", e => {
	const inputId = e.target.value;

	if (inputId.trim().length === 0) {
		managerIdMessage.innerText = "영어+숫자가 조합된 아이디를 입력해 주세요.";
		managerIdMessage.classList.remove('confirm', 'error');
		managerIdMessage.value = "";
		return;
	}

	const regExp = /^[a-zA-Z0-9._%+-]/;

	if (!regExp.test(inputId)) {
		managerIdMessage.innerText = "알맞은 아이디 형식으로 작성해주세요.";
		managerIdMessage.classList.add('error');
		managerIdMessage.classList.remove('confirm');
		managerCheckObj.concertManagerId = false;
		return;
	}

	fetch("/perfmgr/checkId?concertManagerId=" + inputId)
		.then(resp => resp.text())
		.then(count => {
			if (count == 1) {
				managerIdMessage.innerText = "이미 사용중인 아이디 입니다.";
				managerIdMessage.classList.add("error");
				managerIdMessage.classList.remove("confirm");
				managerCheckObj.concertManagerId = false;
				return;
			}

			managerIdMessage.innerText = "사용 가능한 아이디입니다.";
			managerIdMessage.classList.add("confirm");
			managerIdMessage.classList.remove("error");
			managerCheckObj.concertManagerId = true;
		})
		.catch(error => console.log(error));
});

/* 비밀번호 관련 유효성 검사 */
const concertManagerPw = document.querySelector("#concertManagerPw");
const concertManagerPwConfirm = document.querySelector("#concertManagerPwConfirm");
const managerPwMessage = document.querySelector("#managerPwMessage");
const managerConfirmPwMessage = document.querySelector("#managerConfirmPwMessage");

// 비밀번호 확인 검사 함수
const managerCheckPw = () => {
	const inputPw = concertManagerPw.value;
	const confirmPw = concertManagerPwConfirm.value;

	if (!managerCheckObj.concertManagerPw) {
		managerConfirmPwMessage.innerText = "먼저 유효한 비밀번호를 입력해 주세요.";
		managerConfirmPwMessage.classList.add("error");
		managerConfirmPwMessage.classList.remove("confirm");
		managerCheckObj.concertManagerPwConfirm = false;
		return;

	}

	if (confirmPw.trim().length === 0) {
		managerConfirmPwMessage.innerText = "비밀번호 확인을 입력해 주세요.";
		managerConfirmPwMessage.classList.remove("confirm", "error");
		managerCheckObj.concertManagerPwConfirm = false;
		return;

	}

	if (inputPw === confirmPw) {
		managerConfirmPwMessage.innerText = "비밀번호가 일치합니다.";
		managerConfirmPwMessage.classList.add("confirm");
		managerConfirmPwMessage.classList.remove("error");
		managerCheckObj.concertManagerPwConfirm = true;

	} else {
		managerConfirmPwMessage.innerText = "비밀번호가 일치하지 않습니다.";
		managerConfirmPwMessage.classList.add("error");
		managerConfirmPwMessage.classList.remove("confirm");
		managerCheckObj.concertManagerPwConfirm = false;

	}
};

concertManagerPw.addEventListener("input", e => {
	const inputPw = e.target.value;

	if (inputPw.trim().length === 0) {
		managerPwMessage.innerText = "비밀번호를 입력해주세요. (영어, 숫자, 특수문자 포함 6~20자)";
		managerPwMessage.classList.remove("confirm", "error");
		managerCheckObj.concertManagerPw = false;

		// 비밀번호가 비어있을 때 확인 메시지 업데이트
		if (concertManagerPwConfirm.value.length > 0) {
			managerConfirmPwMessage.innerText = "먼저 유효한 비밀번호를 입력해 주세요.";
			managerConfirmPwMessage.classList.add("error");
			managerConfirmPwMessage.classList.remove("confirm");
			managerCheckObj.concertManagerPwConfirm = false;
		}
		return;
	}

	const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/;

	if (!regExp.test(inputPw)) {
		managerPwMessage.innerText = "특수문자(!, @, #, $, %, *)를 포함하여 6~20자이어야 합니다.";
		managerPwMessage.classList.add("error");
		managerPwMessage.classList.remove("confirm");
		managerCheckObj.concertManagerPw = false;

		// 비밀번호가 유효하지 않을 때도 확인 메시지 업데이트
		if (concertManagerPwConfirm.value.length > 0) {
			managerConfirmPwMessage.innerText = "먼저 유효한 비밀번호를 입력해 주세요.";
			managerConfirmPwMessage.classList.add("error");
			managerConfirmPwMessage.classList.remove("confirm");
			managerCheckObj.concertManagerPwConfirm = false;
		}
		return;
	}

	managerPwMessage.innerText = "유효한 비밀번호입니다.";
	managerPwMessage.classList.add("confirm");
	managerPwMessage.classList.remove("error");
	managerCheckObj.concertManagerPw = true;

	// 비밀번호가 변경되었을 때 비밀번호 확인 검증 실행
	if (concertManagerPwConfirm.value.length > 0) {
		managerCheckPw();
	}
});

concertManagerPwConfirm.addEventListener("input", managerCheckPw);

/* 닉네임 유효성 검사 */
const concertManagerNickname = document.querySelector("#concertManagerNickname");
const managerNickMessage = document.querySelector("#managerNickMessage");

concertManagerNickname.addEventListener("input", (e) => {
	const inputNickname = e.target.value;

	if (inputNickname.trim().length === 0) {
		managerNickMessage.innerText = "한글,영어,숫자로만 2~10글자";
		managerNickMessage.classList.remove("confirm", "error");
		managerCheckObj.concertManagerNickname = false;
		concertManagerNickname.value = "";
		return;
	}

	const regExp = /^[가-힣\w\d]{2,10}$/;

	if (!regExp.test(inputNickname)) {
		managerNickMessage.innerText = "유효하지 않은 닉네임 형식입니다.";
		managerNickMessage.classList.add("error");
		managerNickMessage.classList.remove("confirm");
		managerCheckObj.concertManagerNickname = false;
		return;
	}

	fetch("/perfmgr/checkNickname?concertManagerNickname=" + inputNickname)
		.then(resp => resp.text())
		.then(count => {
			if (count == 1) {
				managerNickMessage.innerText = "이미 사용중인 닉네임 입니다.";
				managerNickMessage.classList.add("error");
				managerNickMessage.classList.remove("confirm");
				managerCheckObj.concertManagerNickname = false;
				return;
			}

			managerNickMessage.innerText = "사용 가능한 닉네임 입니다.";
			managerNickMessage.classList.add("confirm");
			managerNickMessage.classList.remove("error");
			managerCheckObj.concertManagerNickname = true;
		})
		.catch(err => console.log(err));
});

/* 전화번호 유효성 검사 */
const concertManagerTel = document.querySelector("#concertManagerTel");
const managerTelMessage = document.querySelector("#managerTelMessage");

concertManagerTel.addEventListener("input", e => {
	const inputTel = e.target.value;
	const cleanNumber = inputTel.replace(/-/g, '');

	if (cleanNumber.trim().length === 0) {
		managerTelMessage.innerText = "전화번호를 입력해주세요.";
		managerTelMessage.classList.remove("confirm", "error");
		managerCheckObj.concertManagerTel = false;
		return;
	}

	// 전화번호 정규식 (01로 시작하는 10-11자리 숫자)
	const regExp = /^01[0-9]{8,9}$/;

	if (!regExp.test(cleanNumber)) {
		managerTelMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
		managerTelMessage.classList.add("error");
		managerTelMessage.classList.remove("confirm");
		managerCheckObj.concertManagerTel = false;
		return;
	}

	// 중복 검사 - cleanNumber 사용
	fetch("/perfmgr/checkTel?concertManagerTel=" + encodeURIComponent(cleanNumber))
		.then(resp => {
			if (!resp.ok) {
				throw new Error('서버 응답 오류: ' + resp.status);
			}
			return resp.json();  // ResponseEntity로 감싸져 있으므로 json으로 파싱
		})
		.then(data => {
			console.log("서버 응답:", data);  // 디버깅용 로그
			if (data >= 1) {
				managerTelMessage.innerText = "이미 사용중인 전화번호입니다.";
				managerTelMessage.classList.add("error");
				managerTelMessage.classList.remove("confirm");
				managerCheckObj.concertManagerTel = false;
			} else {
				managerTelMessage.innerText = "사용 가능한 전화번호입니다.";
				managerTelMessage.classList.add("confirm");
				managerTelMessage.classList.remove("error");
				managerCheckObj.concertManagerTel = true;
			}
		})
		.catch(error => {
			console.error("전화번호 중복 검사 중 오류:", error);
			managerTelMessage.innerText = "중복 검사 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
			managerTelMessage.classList.add("error");
			managerTelMessage.classList.remove("confirm");
			managerCheckObj.concertManagerTel = false;
		});
});

/* 사업체명 유효성 검사 */
const concertManagerCompany = document.querySelector("#concertManagerCompany");
const companyMessage = document.querySelector("#managerCompanyMessage");

concertManagerCompany.addEventListener("input", e => {
	const inputCompany = e.target.value;

	if (inputCompany.trim().length === 0) {
		companyMessage.innerText = "사업체명을 입력해주세요.";
		companyMessage.classList.remove("confirm", "error");
		managerCheckObj.concertManagerCompany = false;
		return;
	}

	// 사업체명은 2글자 이상으로 제한
	if (inputCompany.trim().length < 2) {
		companyMessage.innerText = "사업체명은 2글자 이상이어야 합니다.";
		companyMessage.classList.add("error");
		companyMessage.classList.remove("confirm");
		managerCheckObj.concertManagerCompany = false;
		return;
	}

	companyMessage.innerText = "유효한 사업체명입니다.";
	companyMessage.classList.add("confirm");
	companyMessage.classList.remove("error");
	managerCheckObj.concertManagerCompany = true;
});

/* 사업체 소개 유효성 검사 */
const concertManagerCompanyComment = document.querySelector("#concertManagerCompanyComment");
const companyCommentMessage = document.querySelector("#managerCompanyCommentMessage");

concertManagerCompanyComment.addEventListener("input", e => {
	const inputComment = e.target.value;

	if (inputComment.trim().length === 0) {
		companyCommentMessage.innerText = "사업체 소개를 입력해주세요.";
		companyCommentMessage.classList.remove("confirm", "error");
		managerCheckObj.concertManagerCompanyComment = false;
		return;
	}

	// 최소 10글자 이상, 최대 500글자 제한
	if (inputComment.trim().length < 10) {
		companyCommentMessage.innerText = "사업체 소개는 최소 10글자 이상 작성해주세요.";
		companyCommentMessage.classList.add("error");
		companyCommentMessage.classList.remove("confirm");
		managerCheckObj.concertManagerCompanyComment = false;
		return;
	}

	if (inputComment.trim().length > 500) {
		companyCommentMessage.innerText = "사업체 소개는 최대 500글자까지 작성 가능합니다.";
		companyCommentMessage.classList.add("error");
		companyCommentMessage.classList.remove("confirm");
		managerCheckObj.concertManagerCompanyComment = false;
		return;
	}

	companyCommentMessage.innerText = "유효한 사업체 소개입니다.";
	companyCommentMessage.classList.add("confirm");
	companyCommentMessage.classList.remove("error");
	managerCheckObj.concertManagerCompanyComment = true;
});

// 회원 가입 폼 제출 시 유효성 검사
const managerSignUpForm = document.querySelector("#managerSignUpForm");

managerSignUpForm.addEventListener("submit", e => {
	for (let key in managerCheckObj) {
		if (!managerCheckObj[key]) {
			let str;

			switch (key) {
				case "managerAuthKey":
					str = "이메일이 인증되지 않았습니다"; break;
				case "concertManagerEmail":
					str = "이메일이 유효하지 않습니다"; break;
				case "concertManagerId":
					str = "아이디가 유효하지 않습니다"; break;
				case "concertManagerPw":
					str = "비밀번호가 유효하지 않습니다"; break;
				case "concertManagerPwConfirm":
					str = "비밀번호가 일치하지 않습니다"; break;
				case "concertManagerNickname":
					str = "닉네임이 유효하지 않습니다"; break;
				case "concertManagerTel":
					str = "전화번호가 유효하지 않습니다"; break;
				case "concertManagerCompany":
					str = "사업체명이 유효하지 않습니다"; break;
				case "concertManagerCompanyComment":
					str = "사업체 소개가 유효하지 않습니다"; break;
			}

			alert(str);
			document.getElementById(key).focus();
			e.preventDefault();
			return;
		}
	}
});