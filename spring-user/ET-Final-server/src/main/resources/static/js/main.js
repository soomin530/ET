// 쿠키 값 가져오기
const getCookie = (key) => {

	const cookies = document.cookie; // "K=V; K=V; ... "

	const cookieList = cookies.split("; ") // ["K=V", "K=V"...]
		.map(el => el.split("=")); // ["K", "V"]...


	const obj = {}; // 비어있는 객체 선언

	for (let i = 0; i < cookieList.length; i++) {
		const k = cookieList[i][0]; // key 값
		const v = cookieList[i][1]; // value 값
		obj[k] = v;
	}

	return obj[key]; // 매개변수로 전달받은 key와

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


// 로그인 버튼
const loginBtn = document.getElementById("login-Btn");

// id/pw
const memberId = document.getElementById("memberId");
const memberPw = document.getElementById("memberPw");

const performLogin = () => {

	if (memberId.value.length === 0) {
		alert("아이디를 입력해주세요.");
		memberId.focus();
		return;
	}

	if (memberPw.value.length === 0) {
		alert("비밀번호를 입력해주세요.");
		memberPw.focus();
		return;
	}

	const data = {
		memberId: memberId.value,
		memberPw: memberPw.value
	}

	fetch("/member/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
		.then(resp => resp.json())
		.then(data => {
			console.log("로그인 성공:", data);

			if (data.status === "success") {
				// 로그인 성공: redirectUrl로 이동
				window.location.href = data.redirectUrl;
			} else {
				// 로그인 실패: 메시지 표시
				alert(data.message);
			}
		});

};

// 로그인 버튼 클릭 이벤트
loginBtn.addEventListener("click", performLogin);

// id/pw 입력 필드에서 엔터키 누를 때 로그인 수행
memberId.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {  // 엔터키가 눌렸을 때
		performLogin();
	}
});

memberPw.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {  // 엔터키가 눌렸을 때
		performLogin();
	}
});

// 로그아웃
function logoutSession() {
	// 로그아웃 요청을 전송
	fetch("/member/logout", {
	})
		.then(response => {
			console.log(response)
			window.location.href = "/";
		})
		.catch(error => {
			console.error("로그아웃 중 오류 발생:", error);
			alert("로그아웃 중 문제가 발생했습니다.");
		});
}



function sendEmailVerification() {



}