    // "회원 정보 수정" 버튼 클릭 이벤트
    document.querySelector('.updateInfo').addEventListener('click', function (e) {

        // 비밀번호 인증 모달 표시
        const modalvf = document.getElementById('passwordModal');
        modalvf.style.display = 'flex'; // 모달을 화면에 보이도록 설정
    });
	
	/*
    // "비밀번호" 버튼 클릭 이벤트
    document.querySelector('.changePw').addEventListener('click', function (e) {

        // 비밀번호 인증 모달 표시
        const modalvf = document.getElementById('passwordModal');
        modalvf.style.display = 'flex'; // 모달을 화면에 보이도록 설정
    });

    // "회원탈퇴" 버튼 클릭 이벤트
    document.querySelector('.membershipOut').addEventListener('click', function (e) {

        // 비밀번호 인증 모달 표시
        const modalvf = document.getElementById('passwordModal');
        modalvf.style.display = 'flex'; // 모달을 화면에 보이도록 설정
    });  */



    // "취소" 버튼 클릭 이벤트
    document.getElementById('clsModal').addEventListener('click', function () {
        clsModal();
    });

    // 비밀번호 입력 필드에서 엔터 키 이벤트
    document.getElementById('passwordInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    // 모달 배경을 클릭하면 모달 닫기
    document.getElementById('passwordModal').addEventListener('click', function () {
		console.log("ehla");
        //closeModal();
    });

    // 모달 내부 클릭 시 닫히지 않도록 방지
    document.querySelector('.modalContent').addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // 모달 닫기 함수
    function clsModal() {
        const modalvf = document.getElementById('passwordModal');
        modalvf.style.display = 'none'; // 모달을 숨김
        document.getElementById('passwordInput').value = ''; // 입력 필드 초기화
        document.getElementById('errorMsg').style.display = 'none'; // 오류 메시지 숨김
    }

    // 비밀번호 확인 함수
	async function verifyPassword() {
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

	        const result = await response.json();
	        
	        if (result === 1) {
	            // 비밀번호 일치
	            window.location.href = '/mypage/updateInfo';
				
				/*
                window.location.href = '/mypage/changePw';
                window.location.href = '/mypage/membershipOut'; */
			
	        } else {
	            // 비밀번호 불일치
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