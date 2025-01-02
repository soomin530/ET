// =========================================================================
// 전역 변수
// =========================================================================

// 메시지 상수
const MESSAGE = {
    EMPTY_PASSWORD: "비밀번호를 입력해주세요. (영어, 숫자, 특수문자 포함 6자 이상)",
    INVALID_PASSWORD: "특수문자(!, @, #, $, %, *)를 포함하여 6자 이상이어야 합니다.",
    VALID_PASSWORD: "사용 가능한 비밀번호입니다.",
    PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
    PASSWORD_MATCH: "비밀번호가 일치합니다.",
    CHANGE_SUCCESS: "비밀번호가 성공적으로 변경되었습니다.",
    CHANGE_FAIL: "비밀번호 변경에 실패했습니다.",
    CHANGE_ERROR: "비밀번호 변경 중 오류가 발생했습니다.",
    CONFIRM_EMPTY: "비밀번호 확인을 입력해주세요."
};

// findMemberCheckObj (유효성 검사 여부 확인용 객체)
const findMemberCheckObj = {
    "memberPw": false,
    "memberPwConfirm": false
};

// =========================================================================
// 요소 선택
// =========================================================================

const resetPasswordForm = document.getElementById('resetPasswordForm');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const newPasswordMessage = document.getElementById('newPasswordMessage');
const confirmPasswordMessage = document.getElementById('confirmPasswordMessage');

// =========================================================================
// 유틸리티 함수
// =========================================================================

// 메시지 표시
const showMessage = (element, message, isSuccess = false) => {
    element.innerText = message;
    element.classList.remove("confirm", "error");
    element.classList.add(isSuccess ? "confirm" : "error");
};

// =========================================================================
// 유효성 검사 함수
// =========================================================================

// 비밀번호 유효성 검사 및 일치 여부 검사
const validatePassword = () => {
    const password = newPassword.value;
    const confirmPw = confirmPassword.value;
    const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    // 비밀번호가 입력되지 않은 경우
    if (password.trim().length === 0) {
        showMessage(newPasswordMessage, MESSAGE.EMPTY_PASSWORD);
        findMemberCheckObj.memberPw = false;
    }
    // 유효성 검사
    else if (!regExp.test(password)) {
        showMessage(newPasswordMessage, MESSAGE.INVALID_PASSWORD);
        findMemberCheckObj.memberPw = false;
    }
    // 유효한 비밀번호
    else {
        showMessage(newPasswordMessage, MESSAGE.VALID_PASSWORD, true);
        findMemberCheckObj.memberPw = true;
    }

    // 비밀번호 확인이 입력되어 있는 경우
    // 비밀번호 일치 검사도 같이 진행
    if (confirmPw.trim().length > 0) {
        validatePasswordConfirm();
    }
};

// 비밀번호 확인 검사
const validatePasswordConfirm = () => {
    const password = newPassword.value;
    const confirmPw = confirmPassword.value;

    // 비밀번호가 유효하지 않은 경우
    if (!findMemberCheckObj.memberPw) {
        showMessage(confirmPasswordMessage, MESSAGE.EMPTY_PASSWORD);
        findMemberCheckObj.memberPwConfirm = false;
        return;
    }

    // 비밀번호 확인이 비어있는 경우
    if (confirmPw.trim().length === 0) {
        showMessage(confirmPasswordMessage, MESSAGE.CONFIRM_EMPTY);
        findMemberCheckObj.memberPwConfirm = false;
        return;
    }

    // 비밀번호 일치 여부 검사
    if (password === confirmPw) {
        showMessage(confirmPasswordMessage, MESSAGE.PASSWORD_MATCH, true);
        findMemberCheckObj.memberPwConfirm = true;
    } else {
        showMessage(confirmPasswordMessage, MESSAGE.PASSWORD_MISMATCH);
        findMemberCheckObj.memberPwConfirm = false;
    }
};

// =========================================================================
// 이벤트 핸들러
// =========================================================================

// 폼 제출 핸들러
const handleFormSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사 확인
    if (!findMemberCheckObj.memberPw || !findMemberCheckObj.memberPwConfirm) {
        alert("비밀번호를 다시 확인해주세요.");
        return;
    }

    try {
        const response = await fetch('/member/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: document.getElementById('resetToken').value,
                newPassword: newPassword.value
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(MESSAGE.CHANGE_SUCCESS);
            window.location.href = '/';
        } else {
            alert(result.message || MESSAGE.CHANGE_FAIL);
        }
    } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        alert(MESSAGE.CHANGE_ERROR);
    }
};

// =========================================================================
// 이벤트 리스너
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 비밀번호 입력시 실시간 유효성 검사
    newPassword.addEventListener('input', validatePassword);

    // 비밀번호 확인 입력시 실시간 검사
    confirmPassword.addEventListener('input', validatePasswordConfirm);

    // 폼 제출
    resetPasswordForm.addEventListener('submit', handleFormSubmit);
});