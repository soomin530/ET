// 유효성 검사를 위한 객체
const mypageCheckObj = {
    //memberNickname: false,  // 닉네임은 현재 값이 유효하다고 초기화
    // memberEmail: false,     // 이메일도 현재 값이 유효하다고 초기화
     authKey: false,         // 이메일 인증 여부
     verificationEmail: false,
     userNickname: false,
     userTel: false,
     userGender: false

 };

// 페이지 로드 시 회원 정보 불러오기
 document.addEventListener("DOMContentLoaded", () => {
     loadUserInfo();
 });

// 회원 정보 불러오기
function loadUserInfo() {

	
    fetch("/mypage/info")
        .then(response => response.json())
        .then(data => {
			
			console.log("데이터", data);
			
            // 폼에 데이터 채우기
            document.getElementById("userId").value = data.memberId || "";
           
            document.getElementById("userTel").value = data.memberTel || "";
            document.getElementById("userNickname").value = data.memberNickname || "";
            document.getElementById("verificationEmail").value = data.memberEmail || "";
            
            // 성별 설정
            if (data.memberGender === "M") {
                document.getElementById("male").checked = true;
            } else if (data.memberGender === "F") {
                document.getElementById("female").checked = true;
            }
        })
        .catch(error => {
            console.error("회원 정보 로딩 실패:", error);
            alert("회원 정보를 불러오는데 실패했습니다.");
        });
}




// 인증번호 받기 버튼
const verificationBtn = document.querySelector("#verificationBtn");

// 인증번호 입력 input
const verificationCode = document.querySelector("#verificationCode");

// 인증번호 입력 후 확인 버튼
const verificationConfirmBtn = document.querySelector("#verificationConfirmBtn");

// 인증번호 관련 메시지 출력 span
const verificationMessage = document.querySelector("#verificationMessage");

let verificationTimer; 

const verificationMin = 4; // 타이머 초기값 (분)
const verificationSec = 59; // 타이머 초기값 (초)
const verificationTime = "05:00";

// 실제 줄어드는 시간을 저장할 변수
let minit = verificationMin;
let second = verificationSec;

/* 이메일 유효성 검사 */

// 이메일 유효성 검사에 사용될 요소 얻어오기
const verificationEmail = document.querySelector("#verificationEmail");
const verificationEmailMessage = document.querySelector("#verificationEmailMessage");

/* 이메일 중복 검사 로직 (input 에 입력 할때마다 중복검사 비동기 요청 보내기) */
verificationEmail.addEventListener("input", e => {
	// 작성된 이메일 값 얻어오기
	const verificationInputEmail = e.target.value;

	// 3) 입력된 이메일이 없을 경우
	if (verificationInputEmail.trim().length === 0) {
		verificationEmailMessage.innerText = "메일을 받을 수 있는 이메일을 입력해주세요.";

		// 메시지에 색상을 추가하는 클래스 모두 제거
		verificationEmailMessage.classList.remove('confirm', 'error');

		// 잘못 입력한 띄어쓰기가 있을 경우 없앰
		verificationEmail.value = "";

		return;
	}

    // (알맞은 형태로 작성했는지 검사)
	const vfRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // (알맞은 이메일 형태가 아닌 경우)
	if (!vfRegExp.test(verificationInputEmail)) {
		verificationEmailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요.";
		verificationEmailMessage.classList.add('error'); // 글자를 빨간색으로 변경
		verificationEmailMessage.classList.remove('confirm'); // 초록색 제거
		return;
	}

    // 중복 검사 수행
	// 비동기(ajax)
	fetch("/mypage/verifyEmail?verificationEmail=" + verificationInputEmail)
    .then(resp => resp.text())
    .then(count => {

        if (count == 1) { // 중복 O
            verificationEmailMessage.innerText = "이미 사용중인 이메일 입니다.";
            verificationEmailMessage.classList.add("error");
            verificationEmailMessage.classList.remove("confirm");
            mypageCheckObj.verificationEmail = false; // 중복은 유효하지 않은 상태다..
            return;
        }

        // 중복 X 경우
        verificationEmailMessage.innerText = "사용 가능한 이메일입니다.";
        verificationEmailMessage.classList.add("confirm");
        verificationEmailMessage.classList.remove("error");
        mypageCheckObj.verificationEmail = true;

    })
    .catch(error => {
        // fetch 수행 중 예외 발생 시 처리
        console.log(error); // 발생한 예외 출력
    });


});

// 인증번호 받기 버튼 클릭 시 
verificationBtn.addEventListener("click", () => {

	if (mypageCheckObj.verificationEmail) {
        console.log("1 mypageCheckObj : ", mypageCheckObj);

		mypageCheckObj.authKey = false;
		verificationMessage.innerText = "";

		// 클릭 시 타이머 숫자 초기화
		minit = verificationMin;
		second = verificationSec;

        // 이전 동작중인 인터벌 클리어(없애기)
		clearInterval(verificationTimer);

        // 비동기로 서버에서 메일보내기 
		fetch("/mypage/sendEmail", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: verificationEmail.value
		})
			.then(resp => resp.text())
			.then(result => {
				if (result == 1) {
					console.log("인증 번호 발송 성공");
				} else {
					console.log("인증 번호 발송 실패!!!!");
				}
			});   

    // **********************************************************************        

    // 메일은 비동기로 서버에서 보내라고 하고
		// 화면에서는 타이머 시작하기

		verificationMessage.innerText = verificationTime; // 05:00 세팅
		verificationMessage.classList.remove("confirm", "error"); // 검정 글씨

		alert("인증번호가 발송되었습니다.");         

        // 인증 시간 출력(1초 마다 동작)
		verificationTimer = setInterval(() => {

			verificationMessage.innerText = `${addZero(minit)}:${addZero(second)}`;

			// 0분 0초인 경우 ("00:00" 출력 후)
			if (minit == 0 && second == 0) {
				mypageCheckObj.authKey = false; // 인증 못함
				clearInterval(verificationTimer); // interval 멈춤
				verificationMessage.classList.add('error');
				verificationMessage.classList.remove('confirm');
				return;
			}

			// 0초인 경우(0초를 출력한 후)
			if (second == 0) {
				second = 60;
				minit--;
			}

			second--; // 1초 감소

		}, 1000); // 1초 지연시간
	} else {
        console.log("2 mypageCheckObj : ", mypageCheckObj);
		alert("이메일을 다시 확인해 주세요.");
		verificationEmail.focus();
	}
});

// 전달 받은 숫자가 10 미만인 경우(한자리) 앞에 0 붙여서 반환
function addZero(number) {
	if (number < 10) return "0" + number;
	else return number;
}


// ------------------------------------------------------------------

// 인증하기 버튼 클릭 시
// 입력된 인증번호를 비동기로 서버에 전달
// -> 입력된 인증번호와 발급된 인증번호가 같은지 비교
//   같으면 1, 아니면 0반환
// 단, 타이머가 00:00초가 아닐 경우에만 수행

verificationConfirmBtn.addEventListener("click", () => {

	if (minit === 0 && second === 0) { // 타이머가 00:00인 경우
		alert("인증번호 입력 제한시간을 초과하였습니다.");
		return;
	}

	if (verificationCode.value.length < 6) { // 인증번호가 제대로 입력 안된 경우(길이가 6미만인 경우)
		alert("인증번호를 정확히 입력해 주세요.");
		return;
	}

	// 문제 없는 경우(제한시간, 인증번호 길이 유효 시)
	// 입력받은 이메일, 인증번호로 객체 생성
	const vfObj = {
		"email": verificationEmail.value,
		"authKey": verificationCode.value
	};

    // 인증번호 확인용 비동기 요청 보냄
	fetch("/email/checkAuthKey", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(vfObj) // obj JS 객체를 JSON 으로 변경
	})
		.then(resp => resp.text())
		.then(result => {
			// 1 or 0

			if (result == 0) {
				alert("인증번호가 일치하지 않습니다!");
				mypageCheckObj.authKey = false;
				return;
			}

            // 일치할 때
			clearInterval(verificationTimer); // 타이머 멈춤

			$("#verificationEmail").attr("readonly", true);        // readonly 처리
			$("#authKey").attr("readonly", true);        // readonly 처리

			verificationMessage.innerText = "인증 되었습니다.";
			verificationMessage.classList.remove("error");
			verificationMessage.classList.add("confirm");
			document.querySelector("#verificationEmail").value = verificationEmail.value;

			mypageCheckObj.authKey = true; // 인증번호 검사여부 true 변경
		});


});



//***********************************************

/* 닉네임 유효성 검사 */
const userNickname = document.querySelector("#userNickname");
const updateNickMessage = document.querySelector("#updateNickMessage");

userNickname.addEventListener("input", (e) => {

	const inputNickname = e.target.value;

	// 1) 입력 안한 경우
	if (inputNickname.trim().length === 0) {
		updateNickMessage.innerText = "한글,영어,숫자로만 2~10글자";
		updateNickMessage.classList.remove("confirm", "error");
		mypageCheckObj.userNickname = false;
		userNickname.value = "";
		return;
	}

	// 2) 정규식 검사
	const regExp = /^[가-힣\w\d]{2,10}$/;

	if (!regExp.test(inputNickname)) { // 유효 X
		updateNickMessage.innerText = "유효하지 않은 닉네임 형식입니다.";
		updateNickMessage.classList.add("error");
		updateNickMessage.classList.remove("confirm");
		mypageCheckObj.userNickname = false;
		return;
	}

	// 3) 중복 검사 (유효한 경우)
	fetch("/mypage/updateNickname?userNickname=" + inputNickname)
		.then(resp => resp.text())
		.then(count => {

			if (count == 1) { // 중복 O
				updateNickMessage.innerText = "이미 사용중인 닉네임 입니다.";
				updateNickMessage.classList.add("error");
				updateNickMessage.classList.remove("confirm");
				mypageCheckObj.userNickname = false;
				return;
			}

			updateNickMessage.innerText = "사용 가능한 닉네임 입니다.";
			updateNickMessage.classList.add("confirm");
			updateNickMessage.classList.remove("error");
			mypageCheckObj.userNickname = true;
		})
		.catch(err => console.log(err));

});


// ***************************************************************************

/* 전화번호(휴대폰번호) 유효성 검사 */
const userTel = document.querySelector("#userTel");
const updateTelMessage = document.querySelector("#updateTelMessage");

userTel.addEventListener("input", e => {

	const inputTel = e.target.value;

	if (inputTel.trim().length === 0) {
		updateTelMessage.innerText = "전화번호를 입력해주세요.(- 제외)";
		updateTelMessage.classList.remove("confirm", "error");
		mypageCheckObj.userTel = false;
		userTel.value = "";
		return;
	}

	const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

	if (!regExp.test(inputTel)) {
		updateTelMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
		updateTelMessage.classList.add("error");
		updateTelMessage.classList.remove("confirm");
		mypageCheckObj.userTel = false;
		return;
	}

	updateTelMessage.innerText = "유효한 전화번호 형식입니다.";
	updateTelMessage.classList.add("confirm");
	updateTelMessage.classList.remove("error");
	mypageCheckObj.userTel = true;

});


// ***************************************************************************

/* 성별 선택 */
const maleRadio = document.getElementById('male');
const femaleRadio = document.getElementById('female');

// 성별 선택 시 유효성 검사 객체 업데이트
[maleRadio, femaleRadio].forEach(radio => {
    radio.addEventListener('change', () => {
        mypageCheckObj.userGender = true;
    });
});


// *****************************************************************************

// (최종)
// 수정 버튼 클릭 시 전체 유효성 검사 여부 확인

const updateForm = document.querySelector("#updateForm");

updateForm.addEventListener("submit", e => {
    e.preventDefault(); // 기본 제출 동작 방지

    // 모든 필드의 유효성 검사
    for (let key in mypageCheckObj) {
        if (!mypageCheckObj[key]) {
            let str;
            switch (key) {
                case "authKey":
                    str = "이메일이 인증되지 않았습니다"; break;
                case "userNickname":
                    str = "닉네임이 유효하지 않습니다"; break;
                case "userTel":
                    str = "전화번호가 유효하지 않습니다"; break;
                case "verificationEmail":
                    str = "이메일이 유효하지 않습니다"; break;
                case "userGender":
                    str = "성별이 선택되지 않았습니다"; break;
            }
            alert(str);
            document.getElementById(key)?.focus();
            return;
        }
    }

    // 모든 유효성 검사가 통과되면 데이터 수집
    const formData = {
        memberEmail: document.getElementById("verificationEmail").value,
        memberNickname: document.getElementById("userNickname").value,
        memberTel: document.getElementById("userTel").value,
        memberGender: document.querySelector('input[name="gender"]:checked').id === 'male' ? 'M' : 'F'
    };

    // 서버로 데이터 전송
    fetch("/mypage/updateInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(result => {
        if (result > 0) {
            alert("회원 정보가 성공적으로 수정되었습니다.");
            location.reload(); // 페이지 새로고침
        } else {
            alert("회원 정보 수정에 실패했습니다. 다시 시도해주세요.");
        }
    })
    .catch(error => {
        console.error("회원 정보 수정 중 오류 발생:", error);
        alert("회원 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    });
});


// // 취소 버튼 클릭 시 이전 페이지로 이동
// document.querySelector(".cancelBtn").addEventListener("click", () => {
//     history.back();
// });






