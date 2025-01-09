// 예매 상세 데이터 조회
async function fetchTicketDetail(bookingId) {
  try {
    const response = await fetch(`/mypage/ticketDetail/data/${bookingId}`);
    const data = await response.json();

    if (data) {
      document.getElementById("bookingNumber").innerText = `예매번호: ${data.bookingId}`;
      document.getElementById("eventName").innerText = data.performanceName;
      document.getElementById("eventDateTime").innerText = data.showDateTime;
      document.getElementById("venue").innerText = data.fcltyName;
      document.getElementById("seatInfo").innerText = data.seatInfo;
      document.getElementById("ticketPrice").innerText = `${data.totalPaid.toLocaleString()}원`;

      const statusText = data.bookingStatus === "예매" ? "예매 완료" : "취소된 공연";
      document.getElementById("statusBanner").innerText = statusText;


      // 포스터 이미지 삽입
      const posterImage = document.getElementById("posterImage");
      posterImage.src = data.poster || "/img/default-poster.png";  // 이미지가 없을 경우 기본 이미지 경로
      posterImage.alt = `${data.performanceName} 포스터`;

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

  console.log(`Received bookingId: ${bookingId}`); // 로그 출력

  const response = await fetch(`/mypage/cancelBooking?bookingId=${bookingId}`, {
    method: "POST",
  });

  if (response.ok) {
      alert("예매가 취소되었습니다.");
      window.location.href = "/mypage/ticketInfo";
  } else {
      alert("예매 취소에 실패했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", loadTicketDetail);
