// 페이지 로드 시 실행되는 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
    const withdrawBtn = document.querySelector('.withdraw-btn');
    if (withdrawBtn) {
        withdrawBtn.disabled = true;
    }
});

// 체크박스 상태 변경 감지
document.getElementById('agreementCheck').addEventListener('change', function() {
    const withdrawBtn = document.querySelector('.withdraw-btn');
    withdrawBtn.disabled = !this.checked;
});

// 회원 탈퇴 확인 함수
async function confirmWithdrawal() {
    if (!document.getElementById('agreementCheck').checked) {
        alert('회원 탈퇴 동의사항을 확인해주세요.');
        return;
    }

    // 최종 확인
    if (!confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        return;
    }

    try {
        const memberOutPwInput = document.getElementById('memberOutPw');
        
        if (memberOutPwInput) {
            if (!memberOutPwInput.value) {
                alert('비밀번호를 입력해주세요.');
                memberOutPwInput.focus();
                return;
            }
        }

        const response = await fetch('/mypage/membershipOut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                memberOutPw: memberOutPwInput ? memberOutPwInput.value : null
            })
        });

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const result = await response.json();

        if (result > 0) {
            alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
            window.location.href = '/';
        } else if (result === -1) {
            document.querySelector('.error-message').style.display = 'block';
            memberOutPwInput.value = '';
            memberOutPwInput.focus();
        } else {
            alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('회원 탈퇴 처리 중 오류 발생:', error);
        alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
	// 비밀번호 검증이 필요한 페이지들
	const pagesNeedingVerification = ['changePw', 'membershipOut'];

	// 현재 활성화된 메뉴 설정
	const setActiveMenu = () => {
		const currentPath = window.location.pathname;
		document.querySelectorAll('.mypage-side-menu-link').forEach(link => {
			link.classList.toggle('active', currentPath.includes(link.dataset.page));
		});
	};


	// 이벤트 핸들러 설정
	const initializeEventHandlers = () => {
		document.querySelectorAll('.mypage-side-menu-link').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetPage = e.target.dataset.page;
				
				// 클릭된 페이지를 세션 스토리지에 저장
	           sessionStorage.setItem('targetPage', targetPage);
			   
				if (pagesNeedingVerification.includes(targetPage)) {
					// 비밀번호 검증 페이지로 이동
					window.location.href = `/mypage/checkPw`;
				} else {
					window.location.href = `/mypage/${targetPage}`;
				}
			});
		});
	};

	// 초기화
	setActiveMenu();
	initializeEventHandlers();
});