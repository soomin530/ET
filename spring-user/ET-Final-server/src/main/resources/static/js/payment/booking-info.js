



// 로컬스토리지에서 데이터 가져오기
const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')); 

if (!selectedSeats || selectedSeats.length === 0) {
    document.getElementById('seat-info').textContent = '선택된 좌석 없음';
} else {
    // 좌석 정보 생성
    const seatInfo = selectedSeats.map(seat => {
        const parts = seat.seatId.split('-');
        return parts.slice(1).join('-'); // mt20id 제거 후 나머지 정보 표시
    }).join(', ');

    // 좌석 정보 출력
    document.getElementById('seat-info').textContent = seatInfo;
}

const totalPrice = localStorage.getItem('totalPrice') || '0 원';
document.getElementById('total-price').textContent = totalPrice;


document.getElementById('prev-btn').addEventListener('click', () => {
    // localStorage에서 필수 정보를 가져옴
    const mt20id = localStorage.getItem('performanceId');
    const selectedDate = localStorage.getItem('selectedDate');
    const selectedTime = localStorage.getItem('selectedTime');
    const dayOfWeek = localStorage.getItem('dayOfWeek');

    if (!mt20id || !selectedDate || !selectedTime || !dayOfWeek) {
        alert("필수 정보가 누락되었습니다. 다시 시도해주세요.");
        return;
    }

    // 이전 단계로 이동 (필수 파라미터 포함)
    window.location.href = `/payment/seat-selection?mt20id=${mt20id}&selectedDate=${selectedDate}&selectedTime=${selectedTime}&dayOfWeek=${dayOfWeek}`;
});




// 전화번호 입력 시 자동으로 '-' 추가
const phoneInput = document.getElementById('phone');

// 서버에서 전달된 th:value 값을 가져와 포맷팅
let phoneValue = phoneInput.value.replace(/[^0-9]/g, ''); // 숫자만 남김
if (phoneValue.length === 11) {
    phoneValue = `${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 7)}-${phoneValue.slice(7)}`;
}

phoneInput.value = phoneValue; // 포맷팅된 값을 설정

phoneInput.addEventListener('input', () => {
    let value = phoneInput.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거

    // '010'로 시작하도록 강제
    if (!value.startsWith('010')) {
        value = '010' + value.slice(3); // '010' 유지
    }

    // 11자 이상 입력 방지
    if (value.length > 11) {
        value = value.slice(0, 11); // 11자리까지만 유지    
    }


    if (value.length > 3 && value.length <= 7) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
        value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    }

    phoneInput.value = value; // 입력값 업데이트
});

document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // 로컬스토리지에서 defaultAddress 가져오기
    const defaultAddress = JSON.parse(localStorage.getItem("defaultAddress"));
    if (!defaultAddress) {
        alert("배송지 정보가 없습니다. 배송지를 추가해 주세요.");
        // 현재 창 닫기 시도
        if (confirm("배송지 등록 페이지로 이동하시겠습니까?")) {
            window.open("/mypage/addressManagement", "_self"); // 같은 창에서 열기
            window.close(); // 창 닫기 시도 (브라우저에 따라 허용되지 않을 수 있음)
        }
        return;
    }

    const nickname = document.getElementById('nickname').value.trim(); // 닉네임
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();       // 이메일

    // 이름 유효성 검사 (최대 6글자, 특수문자 제외)
    const nameRegex = /^[가-힣a-zA-Z]{1,6}$/; // 한글 또는 영문 최대 6글자
    if (!nameRegex.test(name)) {
        alert("이름은 최대 6글자 입력 가능하며, 특수문자는 사용할 수 없습니다.");
        return;
    }

    // 유효성 검사
    if (!nickname || !phone || !email) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    // 전화번호 유효성 검사
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
        alert("연락처는 010-0000-0000 형식으로 입력해주세요.");
        return;
    }

   // 이메일 유효성 검사 (기본 이메일 형식 + 도메인 확장자 검사)
   const emailRegex = /^[^\s@]+@[^\s@]+\.(com|kr|net|org|co\.kr|edu|gov|io)$/i;
   if (!emailRegex.test(email)) {
       alert("올바른 이메일 형식을 입력해주세요. 예: example@domain.com");
       return;
   }

    const bookingInfo = { nickname, phone, email };
    // 예매자 정보 localStorage에 저장
    localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));

    // 결제 페이지로 이동
    window.location.href = "/payment/payment";
});