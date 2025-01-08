// 예매 내역 조회 함수
async function fetchTicketInfo() {
  try {
    const response = await fetch(`/mypage/ticketInfo/data`); // API 호출
    const data = await response.json(); // JSON 데이터 파싱

    if (!Array.isArray(data)) {
      console.error("서버에서 잘못된 데이터를 반환했습니다.");
      document.getElementById(
        "ticketTableBody"
      ).innerHTML = `<tr><td colspan="11">데이터를 불러오지 못했습니다.</td></tr>`;
      return;
    }

    const tableBody = document.getElementById("ticketTableBody");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="11">예매 내역이 없습니다.</td></tr>`;
      return;
    }

    data.forEach((booking) => {
      const row = document.createElement("tr");
      const statusClass = booking.bookingStatus === "예매" ? "status-booked" : "status-canceled";
      const bookingDate = booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "정보 없음";

      const paidAt = booking.paidAt ? new Date(booking.paidAt.replace(' ', 'T')).toLocaleString() : "-";
      const cancelableUntil = booking.cancelableUntil ? new Date(booking.cancelableUntil.replace(' ', 'T')).toLocaleDateString() : "정보 없음";
      
      const showDateTime = booking.showDateTime || "미정";

      row.innerHTML = `
        <td>${bookingDate}</td>
        <td>${paidAt}</td>
        <td>${booking.bookingId || "없음"}</td>
        <td>${booking.performanceName || "공연명 없음"}</td>
        <td class="highlight-performance">${showDateTime}</td>
        <td class="highlight-ticket-count">${booking.ticketCount || "0"}매</td>
        <td>${cancelableUntil}</td>
        <td class="${statusClass}">${booking.bookingStatus || "상태 없음"}</td>
        <td>
          <a href="/mypage/ticketDetail/${booking.bookingId}">
            <button class="btn-detail">상세</button>
          </a>
        </td>
      `;
      tableBody.appendChild(row);

      console.log(booking);
    });
  } catch (error) {
    console.error("예매 내역 조회 중 오류 발생:", error);
    document.getElementById(
      "ticketTableBody"
    ).innerHTML = `<tr><td colspan="11">데이터 조회 중 오류가 발생했습니다.</td></tr>`;
  }
}

// 상세보기 버튼 클릭 시 상세 페이지 이동
function viewDetail(bookingId) {
  window.location.href = `/mypage/ticketDetail/${bookingId}`;
}

// 페이지 로드 시 예매 내역 불러오기
document.addEventListener("DOMContentLoaded", fetchTicketInfo);
