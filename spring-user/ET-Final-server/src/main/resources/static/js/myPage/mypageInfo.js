// loginMember 정보를 전역 변수로 저장
let loginMember;

// 페이지 로드 시 회원 정보 가져오기
async function fetchMemberInfo() {
    try {
        const response = await fetch('/mypage/info');
        const data = await response.json();
        loginMember = data;
        
        // 네이버 로그인 사용자인 경우 UI 조정
        if(loginMember && loginMember.naverFl === 'Y') {
            // 비밀번호 변경 버튼 숨기기 등 필요한 UI 조정
            const pwChangeBtn = document.querySelector('.pw-change-btn');
            if(pwChangeBtn) pwChangeBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('회원 정보 조회 중 오류 발생:', error);
        // 인증 오류 시 로그인 페이지로 리다이렉트
        window.location.href = '/member/login';
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', fetchMemberInfo);

// 공통 함수: 페이지 접근 처리
const handlePageAccess = async (targetPage) => {
    // loginMember가 로드되지 않은 경우 처리
    if(!loginMember) {
        await fetchMemberInfo();
    }

    // 네이버 로그인 사용자는 바로 페이지 이동
    if(loginMember && loginMember.naverFl === 'Y') {
        window.location.href = `/mypage/${targetPage}`;
        return;
    }

    // 일반 사용자는 비밀번호 확인 모달 표시
    const modalvf = document.getElementById('passwordModal');
    modalvf.style.display = 'flex';
    sessionStorage.setItem('targetPage', targetPage);
};

// 모달 관련 이벤트
document.getElementById('clsModal').addEventListener('click', clsModal);

document.getElementById('passwordInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyPassword();
});

document.getElementById('passwordModal').addEventListener('click', () => {
    const modalvf = document.getElementById('passwordModal');
    modalvf.style.display = 'none';
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMsg').style.display = 'none';
    // 저장된 타겟 페이지 제거
    sessionStorage.removeItem('targetPage');
});

document.querySelector('.modalContent').addEventListener('click', e => e.stopPropagation());

// 모달 닫기 함수
function clsModal() {
    const modalvf = document.getElementById('passwordModal');
    modalvf.style.display = 'none';
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMsg').style.display = 'none';
    // 저장된 타겟 페이지 제거
    sessionStorage.removeItem('targetPage');
}

// 비밀번호 확인 함수
async function verifyPassword() {
    if(!loginMember) {
        await fetchMemberInfo();
    }

    if(loginMember && loginMember.naverFl === 'Y') {
        const targetPage = sessionStorage.getItem('targetPage') || 'mypageInfo';
        window.location.href = `/mypage/${targetPage}`;
        return;
    }

    const passwordInput = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('errorMsg');
    const password = passwordInput.value;

    if (!password) {
        errorMsg.textContent = '비밀번호를 입력해주세요.';
        errorMsg.style.display = 'block';
        return;
    }

    try {
        const formData = new FormData();
        formData.append("memberPw", password);

        const response = await fetch('/mypage/verifyPassword', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            // 세션이 만료되었거나 인증 오류
            window.location.href = '/member/login';
            return;
        }

        const result = await response.json();

        if (result === 1) {
            const targetPage = sessionStorage.getItem('targetPage') || 'mypageInfo';
            window.location.href = `/mypage/${targetPage}`;
        } else {
            errorMsg.textContent = '비밀번호가 일치하지 않습니다.';
            errorMsg.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('비밀번호 확인 중 오류 발생:', error);
        errorMsg.textContent = '서버 통신 중 오류가 발생했습니다.';
        errorMsg.style.display = 'block';
    }
}



// 필요한 경우 추가: 창이 닫힐 때 이벤트
window.addEventListener('unload', () => {
    sessionStorage.removeItem('targetPage');
});

function checkCapsLock(event)  {
    if (event.getModifierState("CapsLock")) {
        document.getElementById("mypagePwCheck").innerText 
            = "Caps Lock이 켜져있습니다."
    } else {
        document.getElementById("mypagePwCheck").innerText 
            = ""
    }
}