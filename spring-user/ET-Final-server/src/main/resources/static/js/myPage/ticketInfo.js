 // 예매 내역 조회 함수
 async function fetchTicketInfo() {
  try {
      const response = await fetch('/mypage/ticketInfo/data');  // API 호출
      const data = await response.json();  // JSON 데이터 파싱
      const tableBody = document.getElementById('ticketTableBody');

      tableBody.innerHTML = "";  // 기존 데이터 초기화

      if (data.length === 0) {
          tableBody.innerHTML = `<tr><td colspan="11">예매 내역이 없습니다.</td></tr>`;
          return;
      }

      data.forEach(booking => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${new Date(booking.bookingDate).toLocaleDateString()}</td>
              <td>${new Date(booking.paidAt).toLocaleString()}</td>
              <td>${booking.bookingId}</td>
              <td>${booking.performanceName}</td>
              <td>${booking.showDateTime}</td>
              <td>${booking.ticketCount}매</td>
              <td>${booking.seatInfo}</td>
              <td>${new Date(booking.cancelableUntil).toLocaleString()}</td>
              <td>${booking.bookingStatus}</td>
              <td>${booking.totalPaid.toLocaleString()}원</td>
              <td><button onclick="viewDetail('${booking.bookingId}')">상세</button></td>
          `;
          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error("예매 내역 조회 중 오류 발생:", error);
  }
}

// 상세보기 버튼 클릭 시 상세 페이지 이동
function viewDetail(bookingId) {
  window.location.href = `/mypage/ticketDetail/${bookingId}`;
}

// 페이지 로드 시 예매 내역 불러오기
document.addEventListener('DOMContentLoaded', fetchTicketInfo);