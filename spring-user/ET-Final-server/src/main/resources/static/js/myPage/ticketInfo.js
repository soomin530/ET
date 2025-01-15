document.addEventListener("DOMContentLoaded", () => {
  // 필터 버튼 및 라디오 버튼 이벤트 리스너 추가
  document.querySelectorAll("input[name='statusFilter']").forEach((radio) => {
    radio.addEventListener("change", fetchFilteredTicketInfo);
  });

  // 조회 버튼 클릭 시 데이터 조회
  document
    .getElementById("filterButton")
    .addEventListener("click", fetchFilteredTicketInfo);

  // 페이지 로드 시 초기 데이터 조회
  fetchFilteredTicketInfo();
});

// 예매 내역 조회 함수
async function fetchFilteredTicketInfo() {
  // 선택 상태에 따른 필터링(전체/예매/취소)
  const selectedStatus = document.querySelector(
    "input[name='statusFilter']:checked"
  ).value;

  const startDate = document.getElementById("startDateFilter").value;
  const endDate = document.getElementById("endDateFilter").value;

  // 종료일이 시작일보다 빠른 경우
  if (new Date(startDate) > new Date(endDate)) {
    alert("종료일은 시작일보다 빠를 수 없습니다.");
    return; // 함수 종료
  }

  console.log("시작일:", startDate);
  console.log("종료일:", endDate);

  // URL 구성
  let url = `/mypage/ticketInfo/data?status=${selectedStatus}`;
  if (startDate) {
    url += `&startDate=${startDate}`;
  }
  if (endDate) {
    url += `&endDate=${endDate}`;
  }

  try {
    const response = await fetch(url); // API 호출
    const data = await response.json(); // JSON 데이터 파싱

    if (!Array.isArray(data)) {
      console.error("서버에서 잘못된 데이터를 반환했습니다.");
      document.getElementById(
        "ticketTableBody"
      ).innerHTML = `<tr><td colspan="11">데이터를 불러오지 못했습니다.</td></tr>`;
      return;
    }

    renderTableData(data);
  } catch (error) {
    console.error("예매 내역 조회 중 오류 발생:", error);
    document.getElementById(
      "ticketTableBody"
    ).innerHTML = `<tr><td colspan="11">데이터 조회 중 오류가 발생했습니다.</td></tr>`;
  }
}

function renderTableData(data) {
  const tableBody = document.getElementById("ticketTableBody");
  tableBody.innerHTML = ""; // 기존 데이터 초기화

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="11">예매 내역이 없습니다.</td></tr>`;
    return;
  }

  data.forEach((booking) => {
    const row = document.createElement("tr");
    let statusClass = "";
    let statusText = booking.bookingStatus;

    // 상태 값 변환 및 클래스 설정
    switch (statusText) {
      case "CANCELED":
        statusText = "취소";
        statusClass = "status-canceled";
        break;
      case "예매":
        statusText = "예매";
        statusClass = "status-booked";
        break;
      case "EXPIRED":
        statusText = "종료";
        statusClass = "status-expired"; // 스타일링을 위해 추가 클래스
        break;
    }

    const bookingDate = booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "정보 없음";
    const paidAt = booking.paidAt ? new Date(booking.paidAt.replace(" ", "T")).toLocaleString() : "-";
    const cancelableUntil = booking.cancelableUntil ? new Date(booking.cancelableUntil.replace(" ", "T")).toLocaleDateString(): "정보 없음";
    const showDateTime = booking.showDateTime || "미정";


    // 취소된 예매일 경우 상세 버튼 제거
    const detailButtonHtml =
      booking.bookingStatus === "CANCELED" || booking.bookingStatus === "EXPIRED"
        ? `<td></td>` // 취소된 경우 빈 셀로 표시
        : `<td>
          <a href="/mypage/ticketDetail/${booking.bookingId}">
            <button class="btn-detail">상세</button>
          </a>
        </td>`;

    row.innerHTML = `
        <td>${bookingDate}</td>
        <td>${paidAt}</td>
        <td>${booking.bookingId || "없음"}</td>
        <td>${booking.performanceName || "공연명 없음"}</td>
        <td class="highlight-performance">${showDateTime}</td>
        <td class="highlight-ticket-count">${booking.ticketCount || "0"}매</td>
        <td>${cancelableUntil}</td>
        <td class="${statusClass}">${statusText || "상태 없음"}</td>
        ${detailButtonHtml}
      `;
    tableBody.appendChild(row);

    //console.log(booking);
  });
}

// 상세보기 버튼 클릭 시 상세 페이지 이동
function viewDetail(bookingId) {
  window.location.href = `/mypage/ticketDetail/${bookingId}`;
}

// 페이지 로드 시 예매 내역 불러오기
document.addEventListener("DOMContentLoaded", fetchFilteredTicketInfo);
