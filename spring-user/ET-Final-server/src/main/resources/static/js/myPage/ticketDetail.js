// 예매 상세 데이터 조회
async function fetchTicketDetail(bookingId) {
  try {
    const response = await fetch(`/mypage/ticketDetail/data/${bookingId}`);
    const data = await response.json();

    if (data) {
      document.getElementById("ticketDetail").innerHTML = `
        <h2>공연명: ${data.performanceName}</h2>
        <p>예매일: ${new Date(data.bookingDate).toLocaleDateString()}</p>
        <p>공연일시: ${data.showDateTime}</p>
        <p>좌석 정보: ${data.seatInfo}</p>
        <p>결제 금액: ${data.totalPaid.toLocaleString()}원</p>
        <p>상태: ${data.bookingStatus}</p>
      `;

      console.log(data); // 공연 정보 출력
    } else {
      document.getElementById("ticketDetail").innerText = "데이터를 불러오지 못했습니다.";
    }
  } catch (error) {
    console.error("상세 정보 조회 중 오류:", error);
    document.getElementById("ticketDetail").innerText = "조회 중 오류가 발생했습니다.";
  }
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  const bookingId = window.location.pathname.split("/").pop(); // URL에서 bookingId 추출
  fetchTicketDetail(bookingId);
});

async function cancelBooking() {
  const bookingId = window.location.pathname.split("/").pop();
  const response = await fetch(`/mypage/cancelBooking?bookingId=${bookingId}`, { method: "POST" });

  if (response.ok) {
      alert("예매가 취소되었습니다.");
      window.location.href = "/mypage/ticketInfo";
  } else {
      alert("예매 취소에 실패했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", loadTicketDetail);
