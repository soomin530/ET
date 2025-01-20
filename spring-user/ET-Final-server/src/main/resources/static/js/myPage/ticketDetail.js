// 페이지 로드 시 실행할 초기화 함수
document.addEventListener("DOMContentLoaded", initializeTicketDetail);

// 초기화 함수
function initializeTicketDetail() {
    const bookingId = getBookingIdFromUrl();
    if (bookingId) {
        loadTicketDetails(bookingId);
    } else {
        console.error('예매 번호를 찾을 수 없습니다.');
    }
}

// URL에서 예매 번호 추출
function getBookingIdFromUrl() {
    // URL 파라미터와 패스 파라미터 모두 체크
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIdFromParam = urlParams.get('bookingId');
    const bookingIdFromPath = window.location.pathname.split("/").pop();
    
    return bookingIdFromParam || bookingIdFromPath;
}

// loadTicketDetails 함수 수정
async function loadTicketDetails(bookingId) {
    try {
        showLoadingSpinner(true);
        
        const response = await fetch(`/mypage/ticketDetail/data/${bookingId}`);
        if (!response.ok) {
            throw new Error(`서버 응답 실패: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data) {
            updateTicketUI(data);
            // 전체 data 객체를 전달
            generateQRCode(data);  // 수정된 부분
        } else {
            throw new Error('데이터를 불러오지 못했습니다.');
        }
    } catch (error) {
        console.error('티켓 정보 로딩 중 오류:', error);
        alert('티켓 정보를 불러오는데 실패했습니다.');
    } finally {
        showLoadingSpinner(false);
    }
}

// UI 업데이트 함수
function updateTicketUI(data) {
    // 기본 정보 업데이트
    document.getElementById('bookingNumber').textContent = `예매번호: ${data.bookingId}`;
    document.getElementById('eventName').textContent = data.performanceName;
    document.getElementById('eventDateTime').textContent = data.showDateTime;
    document.getElementById('venue').textContent = data.fcltyName;
    document.getElementById('seatInfo').textContent = data.seatInfo;
    document.getElementById('ticketPrice').textContent = `${data.totalPaid.toLocaleString()}원`;

    // 포스터 이미지 업데이트
    const posterImg = document.getElementById('posterImage');
    posterImg.src = data.poster || '/img/default-poster.png';
    posterImg.alt = `${data.performanceName} 포스터`;

    // 상태 배너 업데이트
    updateStatusBanner(data.bookingStatus);

    // 취소 버튼 상태 업데이트
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.style.display = data.bookingStatus === 'CANCELED' ? 'none' : 'block';
    }
}

// QR 코드 생성 함수
function generateQRCode(data) {
    try {
        // QR 코드에 포함될 URL 생성 - 포스터 URL 직접 사용
        const viewerUrl = `${window.location.origin}/performance/poster?poster=${encodeURIComponent(data.poster)}&title=${encodeURIComponent(data.performanceName)}`;
        
        const qr = qrcode(0, 'M');
        qr.addData(viewerUrl);
        qr.make();
        
        const qrCodeElement = document.getElementById('qrCode');
        if (qrCodeElement) {
            qrCodeElement.innerHTML = qr.createImgTag(4, 0);
            
            const qrImage = qrCodeElement.querySelector('img');
            qrImage.style.margin = 'auto';
            qrImage.style.display = 'block';
        }
    } catch (error) {
        console.error('QR 코드 생성 중 오류:', error);
    }
}

// 예매 취소 함수
async function cancelBooking() {
    const bookingId = getBookingIdFromUrl();
    
    try {
        const response = await fetch(`/mypage/cancelBooking?bookingId=${bookingId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('예매가 취소되었습니다.');
            window.location.href = '/mypage/ticketInfo';
        } else {
            throw new Error('예매 취소에 실패했습니다.');
        }
    } catch (error) {
        console.error('예매 취소 중 오류:', error);
        alert('예매 취소에 실패했습니다.');
    }
}

// 상태 배너 업데이트 함수
function updateStatusBanner(status) {
    const banner = document.getElementById('statusBanner');
    const statusText = status === 'COMPLETE' ? '예매 완료' : '취소된 공연';
    banner.textContent = statusText;
    banner.className = `status-banner ${status.toLowerCase()}`;
}

// 로딩 스피너 표시/숨김 함수
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
    }
}