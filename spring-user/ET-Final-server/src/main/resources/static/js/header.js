// 페이지 로드 시 실행되는 코드
document.addEventListener('DOMContentLoaded', function() {
    // 임시 토큰 쿠키 확인 (네이버 로그인 처리용)
    const cookies = document.cookie.split(';');
    const tempTokenCookie = cookies.find(cookie => cookie.trim().startsWith('Temp-Access-Token='));
    
    if (tempTokenCookie) {
        // 쿠키에서 토큰 값 추출
        const accessToken = tempTokenCookie.split('=')[1];
        
        // localStorage에 저장
        localStorage.setItem('accessToken', accessToken);
        
        // 임시 토큰 쿠키 삭제
        document.cookie = 'Temp-Access-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
});

// 쿠키에서 매개변수로 전달받은 key가 일치하는 value 얻어오기 함수
const getCookie = (key) => {


	const cookies = document.cookie;
	const cookieList = cookies.split("; ")
		.map(el => el.split("="));

	const obj = {}; // 비어있는 객체 선언

	for (let i = 0; i < cookieList.length; i++) {
		const k = cookieList[i][0];
		const v = cookieList[i][1];
		obj[k] = v;
	}

	return obj[key];

}

// 다음 주소 API
function execDaumPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var addr = ''; // 주소 변수

			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				addr = data.roadAddress;
			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				addr = data.jibunAddress;
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementById('postcode').value = data.zonecode;
			document.getElementById("address").value = addr;
			// 커서를 상세주소 필드로 이동한다.
			document.getElementById("detailAddress").focus();
		}
	}).open();
}

// 주소 검색 버튼 클릭 시
document.querySelector("#searchAddress").addEventListener("click", execDaumPostcode);

// 필수 입력 항목의 유효성 검사 여부를 체크하기 위한 객체
// - true  == 해당 항목은 유효한 형식으로 작성됨
// - false == 해당 항목은 유효하지 않은 형식으로 작성됨
let checkObj = {
	"memberEmail": false,
	"memberId": false,
	"memberPw": false,
	"memberPwConfirm": false,
	"memberNickname": false,
	"memberTel": false,
	"authKey": false
};


// 로그인 버튼
const loginBtn = document.getElementById("login-Btn");

// id/pw
const memberLoginId = document.getElementById("memberLoginId");
const memberLoginPw = document.getElementById("memberLoginPw");

if (memberLoginId != null) {

	// 쿠키 중 key 값이 "saveId" 인 요소의 value 얻어오기
	const saveId = getCookie("saveId");

	// saveId 값이 있을 경우
	if (saveId != undefined) {
		memberLoginId.value = saveId;

		// 아이디 저장 체크박스에 체크해두기
		document.getElementById('saveIdCheckbox').checked = true;
	}

}

const performLogin = () => {
	// 입력 검증
	if (memberLoginId.value.length === 0) {
		alert("아이디를 입력해주세요.");
		memberLoginId.focus();
		return;
	}

	if (memberLoginPw.value.length === 0) {
		alert("비밀번호를 입력해주세요.");
		memberLoginPw.focus();
		return;
	}

	const form = new FormData();
	form.append('memberId', memberLoginId.value);
	form.append('memberPw', memberLoginPw.value);

	// saveId 체크박스가 있다면
	const saveIdCheckbox = document.getElementById('saveIdCheckbox');
	console.log(saveIdCheckbox);
	if (saveIdCheckbox && saveIdCheckbox.checked) {
		form.append('saveId', 'on');
	}

	fetch("/member/login", {
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

			// 페이지 리다이렉트
			if (window.location.pathname === '/member/find') {
				window.location.href = '/';
			} else {
				window.location.href = window.location.href;
			}
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
loginBtn.addEventListener("click", performLogin);

// id/pw 입력 필드에서 엔터키 누를 때 로그인 수행
memberLoginId.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {  // 엔터키가 눌렸을 때
		performLogin();
	}
});

memberLoginPw.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {  // 엔터키가 눌렸을 때
		performLogin();
	}
});

// JWT 토큰을 사용한 회원 로그아웃
function logoutSession() {
	fetch("/member/logout", {
		method: "POST"
	})
		.then(response => {
			// localStorage에서 토큰 제거
			localStorage.removeItem('accessToken');

			// 메인 페이지로 이동
			window.location.href = "/";
		})
		.catch(error => {
			console.error("로그아웃 중 오류 발생:", error);
			
			// 에러 발생시에도 토큰 제거
			localStorage.removeItem('accessToken');

			alert("로그아웃 중 문제가 발생했습니다.");
			window.location.href = "/";
		});
}

// JWT 토큰을 사용한 네이버 로그아웃 수정
function naverLogoutSession() {
    fetch("/naver/logout", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => {
        // localStorage에서 토큰과 관련 정보 제거
        localStorage.removeItem('accessToken');
        
        // 쿠키에서 네이버 관련 정보 제거
        document.cookie = 'naverFl=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'Refresh-Token=; path=/api/auth/refresh; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // 메인 페이지로 이동
        window.location.href = "/";
    })
    .catch(error => {
        console.error("네이버 로그아웃 중 오류 발생:", error);
        
        // 에러 발생시에도 토큰과 정보 제거
        localStorage.removeItem('accessToken');
        
        // 쿠키도 삭제
        document.cookie = 'naverFl=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'Refresh-Token=; path=/api/auth/refresh; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        alert("로그아웃 중 문제가 발생했습니다.");
        window.location.href = "/";
    });
}


// ---------------------------------
// 인증번호 받기 버튼
const sendAuthKeyBtn = document.querySelector("#sendAuthKeyBtn");

// 인증번호 입력 input
const authKey = document.querySelector("#authKey");

// 인증번호 입력 후 확인 버튼
const checkAuthKeyBtn = document.querySelector("#checkAuthKeyBtn");

// 인증번호 관련 메시지 출력 span
const authKeyMessage = document.querySelector("#authKeyMessage");

let authTimer; // 타이머 역할을 할 setInterval을 저장할 변수

const initMin = 4; // 타이머 초기값 (분)
const initSec = 59; // 타이머 초기값 (초)
const initTime = "05:00";

// 실제 줄어드는 시간을 저장할 변수
let min = initMin;
let sec = initSec;

//---------------------------------------------------

/* 이메일 유효성 검사 */

// 1) 이메일 유효성 검사에 사용될 요소 얻어오기
const memberEmail = document.querySelector("#memberEmail");
const emailMessage = document.querySelector("#emailMessage");

// ------------------------------------------
/* 이메일 인증 */
memberEmail.addEventListener("input", e => {
	// 작성된 이메일 값 얻어오기
	const inputEmail = e.target.value;

	// 3) 입력된 이메일이 없을 경우
	if (inputEmail.trim().length === 0) {
		emailMessage.innerText = "메일을 받을 수 있는 이메일을 입력해주세요.";

		// 메시지에 색상을 추가하는 클래스 모두 제거
		emailMessage.classList.remove('confirm', 'error');

		// 잘못 입력한 띄어쓰기가 있을 경우 없앰
		memberEmail.value = "";

		return;
	}

	// (알맞은 형태로 작성했는지 검사)
	const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// (알맞은 이메일 형태가 아닌 경우)
	if (!regExp.test(inputEmail)) {
		emailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요.";
		emailMessage.classList.add('error'); // 글자를 빨간색으로 변경
		emailMessage.classList.remove('confirm'); // 초록색 제거
		return;
	}

	// 중복 검사 수행
	// 비동기(ajax)
	fetch("/member/checkEmail?memberEmail=" + inputEmail)
		.then(resp => resp.text())
		.then(count => {

			if (count == 1) { // 중복 O
				emailMessage.innerText = "이미 사용중인 이메일 입니다.";
				emailMessage.classList.add("error");
				emailMessage.classList.remove("confirm");
				checkObj.memberEmail = false; // 중복은 유효하지 않은 상태다..
				return;
			}

			// 중복 X 경우
			emailMessage.innerText = "사용 가능한 이메일입니다.";
			emailMessage.classList.add("confirm");
			emailMessage.classList.remove("error");
			checkObj.memberEmail = true;

		})
		.catch(error => {
			// fetch 수행 중 예외 발생 시 처리
			console.log(error); // 발생한 예외 출력
		});


});

// 인증번호 받기 버튼 클릭 시 
sendAuthKeyBtn.addEventListener("click", () => {

	if (checkObj.memberEmail) {

		checkObj.authKey = false;
		authKeyMessage.innerText = "";

		// 클릭 시 타이머 숫자 초기화
		min = initMin;
		sec = initSec;

		// 이전 동작중인 인터벌 클리어(없애기)
		clearInterval(authTimer);

		// 비동기로 서버에서 메일보내기 
		fetch("/email/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: memberEmail.value
		})
			.then(resp => resp.text())
			.then(result => {
				if (result == 1) {
					console.log("인증 번호 발송 성공");
				} else {
					console.log("인증 번호 발송 실패!!!!");
				}
			});


		// *************************************

		// 메일은 비동기로 서버에서 보내라고 하고
		// 화면에서는 타이머 시작하기

		authKeyMessage.innerText = initTime; // 05:00 세팅
		authKeyMessage.classList.remove("confirm", "error"); // 검정 글씨

		alert("인증번호가 발송되었습니다.");

		// 인증 시간 출력(1초 마다 동작)
		authTimer = setInterval(() => {

			authKeyMessage.innerText = `${addZero(min)}:${addZero(sec)}`;

			// 0분 0초인 경우 ("00:00" 출력 후)
			if (min == 0 && sec == 0) {
				checkObj.authKey = false; // 인증 못함
				clearInterval(authTimer); // interval 멈춤
				authKeyMessage.classList.add('error');
				authKeyMessage.classList.remove('confirm');
				return;
			}

			// 0초인 경우(0초를 출력한 후)
			if (sec == 0) {
				sec = 60;
				min--;
			}

			sec--; // 1초 감소

		}, 1000); // 1초 지연시간
	} else {
		alert("이메일을 다시 확인해 주세요.");
		memberEmail.focus();
	}
});


// 전달 받은 숫자가 10 미만인 경우(한자리) 앞에 0 붙여서 반환
function addZero(number) {
	if (number < 10) return "0" + number;
	else return number;
}


// -------------------------------------------------------------

// 인증하기 버튼 클릭 시
// 입력된 인증번호를 비동기로 서버에 전달
// -> 입력된 인증번호와 발급된 인증번호가 같은지 비교
//   같으면 1, 아니면 0반환
// 단, 타이머가 00:00초가 아닐 경우에만 수행

checkAuthKeyBtn.addEventListener("click", () => {

	if (min === 0 && sec === 0) { // 타이머가 00:00인 경우
		alert("인증번호 입력 제한시간을 초과하였습니다.");
		return;
	}

	if (authKey.value.length < 6) { // 인증번호가 제대로 입력 안된 경우(길이가 6미만인 경우)
		alert("인증번호를 정확히 입력해 주세요.");
		return;
	}

	// 문제 없는 경우(제한시간, 인증번호 길이 유효 시)
	// 입력받은 이메일, 인증번호로 객체 생성
	const obj = {
		"email": memberEmail.value,
		"authKey": authKey.value
	};

	// 인증번호 확인용 비동기 요청 보냄
	fetch("/email/checkAuthKey", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(obj) // obj JS 객체를 JSON 으로 변경
	})
		.then(resp => resp.text())
		.then(result => {
			// 1 or 0

			if (result == 0) {
				alert("인증번호가 일치하지 않습니다!");
				checkObj.authKey = false;
				return;
			}

			// 일치할 때
			clearInterval(authTimer); // 타이머 멈춤

			$("#memberEmail").attr("readonly", true);        // readonly 처리
			$("#authKey").attr("readonly", true);        // readonly 처리

			authKeyMessage.innerText = "인증 되었습니다.";
			authKeyMessage.classList.remove("error");
			authKeyMessage.classList.add("confirm");
			document.querySelector("#memberEmail").value = memberEmail.value;

			checkObj.authKey = true; // 인증번호 검사여부 true 변경
		});

});

// ----------------------------------------------------------------

/* 아이디 유효성 검사 */

// 1) 아이디 유효성 검사에 사용될 요소 얻어오기
const idMessage = document.querySelector("#idMessage");
const memberId = document.querySelector("#memberId");

// 2) 아이디 입력(input) 될 때 마다 유효성 검사 수행
memberId.addEventListener("input", e => {

	// 작성된 아이디 값 얻어오기
	const inputId = e.target.value;


	// 3) 입력된 아이디가 없을 경우
	if (inputId.trim().length === 0) {
		idMessage.innerText = "영어+숫자가 조합된 아이디를 입력해 주세요.";

		// 메시지에 색상을 추가하는 클래스 모두 제거
		idMessage.classList.remove('confirm', 'error');

		// 잘못 입력한 띄어쓰기가 있을 경우 없앰
		idMessage.value = "";

		return;
	}

	// 4) 입력된 아이디가 있을 경우 정규식 검사
	//    (알맞은 형태로 작성했는지 검사)
	const regExp = /^[a-zA-Z0-9._%+-]/;

	// 입력 받은 아이디가 정규식과 일치하지 않는 경우
	// (알맞은 아이디 형태가 아닌 경우)
	if (!regExp.test(inputId)) {
		idMessage.innerText = "알맞은 아이디 형식으로 작성해주세요.";
		idMessage.classList.add('error'); // 글자를 빨간색으로 변경
		idMessage.classList.remove('confirm'); // 초록색 제거
		checkObj.memberId = false; // 유효하지 않은 이메일임을 기록
		return;
	}

	// 5) 중복 검사 수행
	// 비동기(ajax)
	fetch("/member/checkId?memberId=" + inputId)
		.then(resp => resp.text())
		.then(count => {
			if (count == 1) { // 중복 O
				idMessage.innerText = "이미 사용중인 아이디 입니다.";
				idMessage.classList.add("error");
				idMessage.classList.remove("confirm");
				checkObj.memberId = false; // 중복은 유효하지 않은 상태다..
				return;
			}

			// 중복 X 경우
			idMessage.innerText = "사용 가능한 아이디입니다.";
			idMessage.classList.add("confirm");
			idMessage.classList.remove("error");
			checkObj.memberId = true; // 유효한 아이디

		})
		.catch(error => {
			// fetch 수행 중 예외 발생 시 처리
			console.log(error); // 발생한 예외 출력
		});

});



// -----------------------------------------------------

/* 비밀번호 / 비밀번호 확인 유효성 검사 */

// 1) 비밀번호 관련 요소 얻어오기
const memberPw = document.querySelector("#memberPw");
const memberPwConfirm = document.querySelector("#memberPwConfirm");
const pwMessage = document.querySelector("#pwMessage");
const confirmPwMessage = document.querySelector("#confirmPwMessage");

// 비밀번호 확인 검사 함수
const checkPw = () => {
	const inputPw = memberPw.value;
	const confirmPw = memberPwConfirm.value;

	// 비밀번호가 유효하지 않은 경우
	if (!checkObj.memberPw) {
		confirmPwMessage.innerText = "먼저 유효한 비밀번호를 입력해 주세요.";
		confirmPwMessage.classList.add("error");
		confirmPwMessage.classList.remove("confirm");
		checkObj.memberPwConfirm = false;
		return;
	}

	// 비밀번호 확인이 비어있는 경우
	if (confirmPw.trim().length === 0) {
		confirmPwMessage.innerText = "비밀번호 확인을 입력해 주세요.";
		confirmPwMessage.classList.remove("confirm", "error");
		checkObj.memberPwConfirm = false;
		return;
	}

	// 비밀번호와 비밀번호 확인이 일치하는지 검사
	if (inputPw === confirmPw) {
		confirmPwMessage.innerText = "비밀번호가 일치합니다.";
		confirmPwMessage.classList.add("confirm");
		confirmPwMessage.classList.remove("error");
		checkObj.memberPwConfirm = true;
	} else {
		confirmPwMessage.innerText = "비밀번호가 일치하지 않습니다.";
		confirmPwMessage.classList.add("error");
		confirmPwMessage.classList.remove("confirm");
		checkObj.memberPwConfirm = false;
	}
};

// 2) 비밀번호 유효성 검사
memberPw.addEventListener("input", e => {
	const inputPw = e.target.value;

	// 3) 비밀번호가 입력되지 않은 경우
	if (inputPw.trim().length === 0) {
		pwMessage.innerText = "비밀번호를 입력해주세요. (영어, 숫자, 특수문자 포함 6~20자)";
		pwMessage.classList.remove("confirm", "error");
		checkObj.memberPw = false;

		// 비밀번호가 비어있을 때 확인 메시지도 초기화
		if (memberPwConfirm.value.length > 0) {
			checkPw();
		}
		return;
	}

	// 4) 비밀번호 정규식 검사 (영문자, 숫자, 특수문자 포함 6~20자)
	const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/;

	if (!regExp.test(inputPw)) {
		pwMessage.innerText = "특수문자(!, @, #, $, %, *)를 포함하여 6~20자이어야 합니다.";
		pwMessage.classList.add("error");
		pwMessage.classList.remove("confirm");
		checkObj.memberPw = false;

		// 비밀번호가 유효하지 않을 때도 확인 메시지 업데이트
		if (memberPwConfirm.value.length > 0) {
			checkPw();
		}
		return;
	}

	// 5) 비밀번호가 유효한 경우
	pwMessage.innerText = "유효한 비밀번호입니다.";
	pwMessage.classList.add("confirm");
	pwMessage.classList.remove("error");
	checkObj.memberPw = true;

	// 비밀번호 확인이 작성된 경우 즉시 비밀번호 확인 검증
	if (memberPwConfirm.value.length > 0) {
		checkPw();
	}
});

// 6) 비밀번호 확인 유효성 검사
memberPwConfirm.addEventListener("input", checkPw);




/* 닉네임 유효성 검사 */
const memberNickname = document.querySelector("#memberNickname");
const nickMessage = document.querySelector("#nickMessage");

memberNickname.addEventListener("input", (e) => {

	const inputNickname = e.target.value;

	// 1) 입력 안한 경우
	if (inputNickname.trim().length === 0) {
		nickMessage.innerText = "한글,영어,숫자로만 2~10글자";
		nickMessage.classList.remove("confirm", "error");
		checkObj.memberNickname = false;
		memberNickname.value = "";
		return;
	}

	// 2) 정규식 검사
	const regExp = /^[가-힣\w\d]{2,10}$/;

	if (!regExp.test(inputNickname)) { // 유효 X
		nickMessage.innerText = "유효하지 않은 닉네임 형식입니다.";
		nickMessage.classList.add("error");
		nickMessage.classList.remove("confirm");
		checkObj.memberNickname = false;
		return;
	}

	// 3) 중복 검사 (유효한 경우)
	fetch("/member/checkNickname?memberNickname=" + inputNickname)
		.then(resp => resp.text())
		.then(count => {

			if (count == 1) { // 중복 O
				nickMessage.innerText = "이미 사용중인 닉네임 입니다.";
				nickMessage.classList.add("error");
				nickMessage.classList.remove("confirm");
				checkObj.memberNickname = false;
				return;
			}

			nickMessage.innerText = "사용 가능한 닉네임 입니다.";
			nickMessage.classList.add("confirm");
			nickMessage.classList.remove("error");
			checkObj.memberNickname = true;
		})
		.catch(err => console.log(err));

});

// --------------------------------------

// 휴대폰 번호 정규 표현식
// const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

/* 전화번호(휴대폰번호) 유효성 검사 */
const memberTel = document.querySelector("#memberTel");
const telMessage = document.querySelector("#telMessage");

memberTel.addEventListener("input", e => {

	const inputTel = e.target.value;

	if (inputTel.trim().length === 0) {
		telMessage.innerText = "전화번호를 입력해주세요.(- 제외)";
		telMessage.classList.remove("confirm", "error");
		checkObj.memberTel = false;
		memberTel.value = "";
		return;
	}

	const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

	if (!regExp.test(inputTel)) {
		telMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
		telMessage.classList.add("error");
		telMessage.classList.remove("confirm");
		checkObj.memberTel = false;
		return;
	}

	telMessage.innerText = "유효한 전화번호 형식입니다.";
	telMessage.classList.add("confirm");
	telMessage.classList.remove("error");
	checkObj.memberTel = true;

});

// -----------------------------------

// (최종)
// 회원 가입 버튼 클릭 시 전체 유효성 검사 여부 확인

const signUpForm = document.querySelector("#signUpForm");

// 회원 가입 폼 제출 시
signUpForm.addEventListener("submit", e => {
	// for ~ in (객체 전용 향상된 for 문)
	for (let key in checkObj) { // checkObj 요소의 key 값을 순서대로 꺼내옴

		if (!checkObj[key]) { // 현재 접근중인 checkObj[key]의 value 값이 false 인 경우 (유효하지 않음)

			let str; // 출력할 메시지를 저장할 변수

			switch (key) {
				case "authKey":
					str = "이메일이 인증되지 않았습니다"; break;

				case "memberPw":
					str = "비밀번호가 유효하지 않습니다"; break;

				case "memberPwConfirm":
					str = "비밀번호가 일치하지 않습니다"; break;

				case "memberNickname":
					str = "닉네임이 유효하지 않습니다"; break;

				case "memberTel":
					str = "전화번호가 유효하지 않습니다"; break;

				case "memberEmail":
					str = "이메일이 유효하지 않습니다"; break;
			}

			alert(str);

			document.getElementById(key).focus(); // 초점 이동

			e.preventDefault(); // form 태그 기본 이벤트(제출) 막기
			return;
		}
	}
});