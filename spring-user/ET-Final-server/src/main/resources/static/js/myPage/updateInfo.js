// // 유효성 검사를 위한 객체
// const checkObj = {
//     memberNickname: true,  // 닉네임은 현재 값이 유효하다고 초기화
//     memberEmail: true,     // 이메일도 현재 값이 유효하다고 초기화
//     authKey: false         // 이메일 인증 여부
// };

// // 페이지 로드 시 회원 정보 불러오기
// document.addEventListener("DOMContentLoaded", () => {
//     loadUserInfo();
//     initializeValidation();
// });

// 회원 정보 불러오기
function loadUserInfo() {
    fetch("/api/member/info")
        .then(response => response.json())
        .then(data => {
            // 폼에 데이터 채우기
            document.getElementById("userId").value = data.memberId || "";
            document.getElementById("userName").value = data.memberName || "";
            document.getElementById("userPhone").value = data.memberTel || "";
            document.getElementById("userNickname").value = data.memberNickname || "";
            document.getElementById("userEmail").value = data.memberEmail || "";
            document.getElementById("userBirth").value = data.memberBirth || "";

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

// 유효성 검사 초기화
function initializeValidation() {
    // 닉네임 유효성 검사
    const memberNickname = document.getElementById("userNickname");
    const nickMessage = document.createElement("div");
    nickMessage.id = "nickMessage";
    memberNickname.parentElement.appendChild(nickMessage);

    memberNickname.addEventListener("input", (e) => {
        const inputNickname = e.target.value;
        
        if (inputNickname.trim().length === 0) {
            nickMessage.innerText = "한글,영어,숫자로만 2~10글자";
            nickMessage.className = "";
            checkObj.memberNickname = false;
            return;
        }

        const regExp = /^[가-힣\w\d]{2,10}$/;
        
        if (!regExp.test(inputNickname)) {
            nickMessage.innerText = "유효하지 않은 닉네임 형식입니다.";
            nickMessage.className = "error";
            checkObj.memberNickname = false;
            return;
        }

        // 중복 검사
        fetch(`/api/member/checkNickname?nickname=${inputNickname}`)
            .then(resp => resp.text())
            .then(count => {
                if (count == 1) {
                    nickMessage.innerText = "이미 사용중인 닉네임입니다.";
                    nickMessage.className = "error";
                    checkObj.memberNickname = false;
                } else {
                    nickMessage.innerText = "사용 가능한 닉네임입니다.";
                    nickMessage.className = "confirm";
                    checkObj.memberNickname = true;
                }
            })
            .catch(err => console.error(err));
    });

    // 이메일 인증 관련
    const authTimer = {
        id: null,
        time: 300,
        start() {
            if (this.id) clearInterval(this.id);
            this.time = 300;
            const timerDisplay = document.getElementById("timer");
            
            this.id = setInterval(() => {
                const minutes = Math.floor(this.time / 60);
                const seconds = this.time % 60;
                timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                if (--this.time < 0) {
                    clearInterval(this.id);
                    checkObj.authKey = false;
                    alert("인증 시간이 만료되었습니다.");
                    document.getElementById("emailVerificationSection").style.display = "none";
                }
            }, 1000);
        },
        stop() {
            if (this.id) clearInterval(this.id);
        }
    };

    // 이메일 인증 버튼 클릭 이벤트
    document.getElementById("sendVerificationBtn").addEventListener("click", () => {
        const email = document.getElementById("userEmail").value;
        
        fetch("/api/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("인증번호가 발송되었습니다.");
                document.getElementById("emailVerificationSection").style.display = "block";
                authTimer.start();
            } else {
                alert("인증번호 발송에 실패했습니다.");
            }
        })
        .catch(error => {
            console.error("이메일 발송 오류:", error);
            alert("이메일 발송 중 오류가 발생했습니다.");
        });
    });

    // 인증번호 확인 버튼 클릭 이벤트
    document.getElementById("verifyCodeBtn").addEventListener("click", () => {
        const code = document.getElementById("verificationCode").value;
        const email = document.getElementById("userEmail").value;

        fetch("/api/email/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("이메일 인증이 완료되었습니다.");
                checkObj.authKey = true;
                authTimer.stop();
                document.getElementById("emailVerificationSection").style.display = "none";
            } else {
                alert("잘못된 인증번호입니다.");
            }
        })
        .catch(error => {
            console.error("인증 확인 오류:", error);
            alert("인증 확인 중 오류가 발생했습니다.");
        });
    });
}

// 폼 제출 처리
document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // 유효성 검사 확인
    if (!checkObj.memberNickname) {
        alert("닉네임이 유효하지 않습니다.");
        document.getElementById("userNickname").focus();
        return;
    }

    if (!checkObj.memberEmail) {
        alert("이메일이 유효하지 않습니다.");
        document.getElementById("userEmail").focus();
        return;
    }

    // 수정된 회원 정보 수집
    const updatedInfo = {
        memberName: document.getElementById("userName").value,
        memberNickname: document.getElementById("userNickname").value,
        memberEmail: document.getElementById("userEmail").value,
        memberBirth: document.getElementById("userBirth").value,
        memberGender: document.querySelector('input[name="gender"]:checked')?.value
    };

    // 서버로 수정 요청 전송
    fetch("/api/member/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInfo)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("회원 정보가 성공적으로 수정되었습니다.");
            location.reload();
        } else {
            alert("회원 정보 수정에 실패했습니다.");
        }
    })
    .catch(error => {
        console.error("수정 요청 오류:", error);
        alert("회원 정보 수정 중 오류가 발생했습니다.");
    });
});

// 취소 버튼 클릭 시 이전 페이지로 이동
document.querySelector(".cancel-btn").addEventListener("click", () => {
    history.back();
});