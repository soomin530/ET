document.addEventListener('DOMContentLoaded', function () {
    // "회원 정보 수정" 버튼 클릭 이벤트
    document.querySelector('.updateInfo').addEventListener('click', function (e) {

        // 비밀번호 인증 모달 표시
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'flex'; // 모달을 화면에 보이도록 설정
    });

    // "취소" 버튼 클릭 이벤트
    document.getElementById('closeModal').addEventListener('click', function () {
        closeModal();
    });

    // 비밀번호 입력 필드에서 엔터 키 이벤트
    document.getElementById('passwordInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    // 모달 배경을 클릭하면 모달 닫기
    document.getElementById('passwordModal').addEventListener('click', function () {
        closeModal();
    });

    // 모달 내부 클릭 시 닫히지 않도록 방지
    document.querySelector('.modal-content').addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // 모달 닫기 함수
    function closeModal() {
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'none'; // 모달을 숨김
        document.getElementById('passwordInput').value = ''; // 입력 필드 초기화
        document.getElementById('errorMsg').style.display = 'none'; // 오류 메시지 숨김
    }

    // 비밀번호 확인 함수
    function verifyPassword() {
        const password = document.getElementById('passwordInput').value;

        // 비밀번호 인증 요청 (예제용: 실제로는 서버에 요청)
        if (password === 'test1234') { // 비밀번호가 맞다면
            alert('비밀번호 인증 성공');
            closeModal();

            // 여기에서 페이지 이동 처리 (회원 정보 수정 페이지로 이동)
            window.location.href = '/mypage/updateInfo';
        } else { // 비밀번호가 틀리다면
            const errorMsg = document.getElementById('errorMsg');
            errorMsg.style.display = 'block'; // 오류 메시지 표시
        }
    }
});