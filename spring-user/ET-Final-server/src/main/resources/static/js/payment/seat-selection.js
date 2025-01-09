document.addEventListener('DOMContentLoaded', async () => {

  const selectedSeats = new Set(); // 스크립트 상단에 선언
  const seatMap = document.getElementById('seatMap');
  const selectedSeatsElement = document.getElementById('seat-numbers');
  const totalPriceElement = document.getElementById('total-price');

  const currentStep = parseInt(document.body.dataset.step, 10) || 1; // 데이터 속성에서 단계 가져오기

  const urlParams = new URLSearchParams(window.location.search);
  const mt20id = urlParams.get('mt20id');
  const selectedDate = urlParams.get('selectedDate');
  const selectedTime = urlParams.get('selectedTime');
  const dayOfWeek = urlParams.get('dayOfWeek');



  // 진행 단계 표시 업데이트
  const steps = document.querySelectorAll('.progress-step');
  const progressBar = document.getElementById('progressBar');

  // 각 단계에 active 클래스 추가 또는 제거
  steps.forEach((step, index) => {
    if (index + 1 <= currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });


  try {
    await fetchSeatData(mt20id, selectedDate, selectedTime, dayOfWeek);
  } catch (error) {
    console.error('좌석 정보를 불러오는데 실패했습니다:', error);
    alert('좌석 정보를 불러오는데 실패했습니다.');
  }


  async function fetchSeatData(mt20id, selectedDate, selectedTime, dayOfWeek) {
    try {
      const response = await fetch(`/payment/seats?mt20id=${mt20id}&selectedDate=${selectedDate}&selectedTime=${selectedTime}&dayOfWeek=${dayOfWeek}`);
      if (!response.ok) throw new Error('좌석 정보 조회 실패');

      const rawData = await response.json();
      const seatData = parseData(rawData.seats || []); // seats 배열 처리
      const bookedSeats = rawData.bookedSeats || [];  // bookedSeats 배열 처리

      console.log("예약된 좌석 데이터 (bookedSeats):", bookedSeats);

      generateSeatsFromData(seatData);
      disableBookedSeats(bookedSeats);

    } catch (error) {
      console.error('좌석 데이터 로드 오류:', error);
      alert('좌석 데이터를 불러올 수 없습니다.');
    }
  }

  function parseData(rawData) {
    if (!Array.isArray(rawData)) {
      console.error("Data is not an array:", rawData);
      return [];
    }
    return rawData.map(item => {
      const parsedItem = {};
      Object.keys(item).forEach(key => {
        parsedItem[key] = item[key];
      });
      return parsedItem;
    });
  }


  function generateSeatsFromData(seatData) {
    const seatMap = document.getElementById('seatMap');
    seatMap.innerHTML = '';

    updateSeatGradeInfo(seatData); // `seat-grade-info` 업데이트

    console.log("좌석 데이터:", seatData); // 전체 좌석 데이터 출력

    seatData.forEach(data => {
      const gradeSection = document.createElement('div');
      gradeSection.classList.add('grade-section');

      const gradeLabel = document.createElement('div');
      gradeLabel.classList.add('grade-label');

      // 조건에 따라 석을 붙임
      const gradeName = data.GRADENAME === "전석" ? "전석" : `${data.GRADENAME}석`;

      gradeLabel.textContent = gradeName;
      gradeSection.appendChild(gradeLabel);

      let seatNumber = 1;
       // 한 줄당 좌석 수 설정 (20~30석 추천)
      const maxSeatsPerRow = data.TOTALSEATCOUNT <= 50 ? 10 : (data.TOTALSEATCOUNT > 200 ? 25 : 20);
      const rows = Math.ceil(data.TOTALSEATCOUNT / maxSeatsPerRow ); // 한 줄에 최대 20개 좌석

      for (let row = 1; row <= rows; row++) {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-container');

        for (let col = 1; col <= maxSeatsPerRow  && seatNumber <= data.TOTALSEATCOUNT; col++) {
          const seatElement = createSeatElement({
            gradeId: data.GRADEID,
            gradeName: data.GRADENAME,
            price: data.GRADEPRICE,
            status: data.seatStatus, // 각 좌석의 상태를 배열로 관리
            seatId: `${data.GRADENAME}-${row}-${col}`
          });
          rowContainer.appendChild(seatElement);
          seatNumber++;
        }
        gradeSection.appendChild(rowContainer);
      }

      seatMap.appendChild(gradeSection);
    });
  }

  function createSeatElement(seat) {
    const element = document.createElement('div');
    element.classList.add('seat', getSeatClass(seat.gradeId));
    element.textContent = seat.seatId.split('-').pop(); // 열 번호 표시

    // 중복된 mt20id 방지
    const seatIdParts = seat.seatId.split('-');
    if (seatIdParts[0] === mt20id) {
      element.dataset.seatId = seat.seatId; // 이미 포함되어 있으면 그대로 사용
    } else {
      element.dataset.seatId = `${mt20id}-${seat.seatId}`; // mt20id 포함
    }

    element.dataset.price = seat.price;
    element.dataset.gradeId = seat.gradeId; // GRADE_ID 추가

    // 예약된 좌석 처리
    if (seat.status === 'BOOKED') {
      element.classList.add('booked'); // BOOKED 상태 표시
      element.textContent = 'X'; // 예약된 좌석에 X 표시
      element.style.cursor = 'not-allowed'; // 클릭 불가 시각화
      return element; // 클릭 이벤트 추가하지 않고 반환
    }

    // 예약되지 않은 좌석만 클릭 이벤트 추가
    element.addEventListener('click', () => toggleSeat(element));
    return element;
  }

  function getSeatClass(gradeId) {
    const gradeClasses = {
      '1': 'vip',
      '2': 'r',
      '3': 's',
      '4': 'a',
      '5': 'b',
      '6': 'all'
    };
    return gradeClasses[gradeId] || 'normal';
  }

  // 좌석 선택/해제
  function toggleSeat(seatElement) {
    if (seatElement.classList.contains('booked')) {
      return; // BOOKED 상태인 경우 아무 작업도 수행하지 않음
    }
    const seatId = seatElement.dataset.seatId;

    if (seatElement.classList.contains('selected')) {
      seatElement.classList.remove('selected');
      selectedSeats.delete(seatId);
    } else {
      if (selectedSeats.size >= 2) {
        alert("최대 2석까지만 선택 가능합니다.");
        return;
      }
      seatElement.classList.add('selected');
      selectedSeats.add(seatId);
    }

    updateSelectedSeatsInfo();
  }

  // 선택된 좌석 정보 업데이트
  function updateSelectedSeatsInfo() {
    const seatNumbers = [...selectedSeats];
    let totalPrice = 0;

    const displaySeatNumbers = seatNumbers.map((seatId) => {
      const parts = seatId.split('-');
      return parts.slice(1).join('-'); // mt20id 제거 후 나머지 부분(등급-행-열) 합침
    });

    seatNumbers.forEach((seatId) => {
      const seat = document.querySelector(`[data-seat-id="${seatId}"]`);
      if (seat) {
        totalPrice += parseInt(seat.dataset.price, 10);
      }
    });

    selectedSeatsElement.textContent = displaySeatNumbers.length > 0 ? displaySeatNumbers.join(', ') : '없음';
    totalPriceElement.textContent = `${totalPrice.toLocaleString()} 원`;
  }

  // 좌석 등급별 클래스 설정
  function getSeatClass(gradeId) {
    const gradeClasses = {
      "1": "vip",
      "2": "r",
      "3": "s",
      "4": "a",
      "5": "b",
      "6": "all",
    };
    return gradeClasses[gradeId] || "normal";
  }

  // 좌석 비활성화
  function disableBookedSeats(bookedSeats) {
    bookedSeats.forEach(seat => {

      let seatId = seat.seatId;

      // 중복된 mt20id 제거
      if (seatId.startsWith(`${mt20id}-${mt20id}`)) {
        seatId = seatId.replace(`${mt20id}-`, '');
      }
      
      const seatElement = document.querySelector(`[data-seat-id="${seat.seatId}"]`);  // mt20id 포함된 seatId
      if (seatElement) {
        seatElement.classList.add('booked');
        seatElement.textContent = 'X'; // 예약된 좌석에 X 표시
        seatElement.style.cursor = 'not-allowed';
      }
    });
  }



  /* 공연 상세 정보 조회*/
  const performanceId = urlParams.get("mt20id"); // 'mt20id'를 'performanceId'로 매핑

  fetch(`/payment/performance-detail?performanceId=${performanceId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("공연 정보를 가져오는 데 실패했습니다.");
      }
      return response.json();
    })
    .then(data => {
      if (!data || Object.keys(data).length === 0) {
        throw new Error("공연 정보를 불러올 수 없습니다.");
      }
      // 공연 상세 정보 확인용 콘솔 출력
      console.log("공연 상세 정보:", data);

      // 공연 정보를 로컬스토리지에 저장
      localStorage.setItem("performanceId", data.mt20id);
      localStorage.setItem("facilityId", data.mt10id);

      renderPerformanceInfo(data);
    })
    .catch(error => {
      console.error(error);
      document.querySelector(".reservation-info").innerHTML = `
      <p style="color: red;">공연 정보를 불러올 수 없습니다. 다시 시도해 주세요.</p>
    `;
    });

  function renderPerformanceInfo(data) {
    const reservationInfo = document.querySelector(".reservation-info");

    if (!data) {
      reservationInfo.innerHTML = `<p style="color: red;">공연 정보를 불러올 수 없습니다.</p>`;
      return;
    }

    reservationInfo.innerHTML = `
    <img src="${data.poster}" alt="${data.prfnm}" />
    <div class="details">
      <h3>${data.prfnm}</h3>
      <p> ${data.prfpdfrom} ~ ${data.prfpdto}</p>
      <p> ${data.fcltynm}</p>
      <p> ${data.prfruntime}</p>
    </div>`
      ;
  }



  // 좌석 등급 정보 업데이트
  function updateSeatGradeInfo(seatData) {
    const seatGradeInfoContainer = document.getElementById("seat-grade-info");
    seatGradeInfoContainer.innerHTML = "";

    // 헤더 추가
    const gradeHeader = document.createElement("div");
    gradeHeader.classList.add("grade-header");
    gradeHeader.innerHTML = `<h3>좌석등급 / 잔여석</h3>`;

    seatGradeInfoContainer.appendChild(gradeHeader);

    seatData.forEach((data) => {
      const gradeItem = document.createElement("div");
      gradeItem.classList.add("grade-item");

      // 조건에 따라 석을 붙임
      const gradeName = data.GRADENAME === "전석" ? "전석" : `${data.GRADENAME}석`;

      // 색상 박스
      const colorBox = document.createElement("span");
      colorBox.classList.add("color-box");
      colorBox.style.backgroundColor = getGradeColor(data.GRADEID);

      // 등급 텍스트
      const gradeText = document.createElement("div");
      gradeText.classList.add("grade-text");
      gradeText.innerHTML = `
        <strong>${gradeName}</strong>
        <span class="seat-count"> ${data.AVAILABLESEATCOUNT}석</span>
      `;

      // 가격 텍스트
      const gradePrice = document.createElement("div");
      gradePrice.classList.add("grade-price");
      gradePrice.textContent = `${data.GRADEPRICE.toLocaleString()}원`;

      gradeItem.appendChild(colorBox);
      gradeItem.appendChild(gradeText);
      gradeItem.appendChild(gradePrice);

      seatGradeInfoContainer.appendChild(gradeItem);
    });
  }

  // 우측 컨테이너 정보 - 좌석 등급 색상 반환
  function getGradeColor(gradeId) {
    switch (gradeId.toString()) {
      case "1": return "#b19cd9"; // VIP석 색상
      case "2": return "#85c1e9"; // R석 색상
      case "3": return "#82e0aa"; // S석 색상
      case "4": return "#f5b041"; // A석 색상
      case "5": return "#ffcccb"; // B석 색상
      case "6": return "#d3d3d3"; // 전석 색상
      default: return "#e8e8e8"; // 기본 색상
    }
  }



  // 좌석 초기화 버튼 클릭 이벤트
  document.getElementById("reset-btn").addEventListener("click", () => {
    selectedSeats.clear();
    document.querySelectorAll(".seat.selected").forEach(seat => {
      seat.classList.remove("selected");
    });
    updateSelectedSeatsInfo();
  });


  // 좌석 선택 완료 버튼 이벤트
  document.getElementById("confirm-btn").addEventListener("click", () => {

    const accessToken = localStorage.getItem('accessToken');

    if(!accessToken) {
      alert("예약 정보를 확인 하려면 로그인이 필요합니다.");
      window.close();  // 창 닫기
    }

    if (selectedSeats.size === 0) {
      alert("좌석을 선택해주세요.");
      return;
    }
    const selectedSeatsArray = [...selectedSeats].map(seatId => {
      const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
      return {
        seatId: seatElement.dataset.seatId,
        gradeId: seatElement.dataset.gradeId // GRADE_ID 포함
      };
    });
    const totalPrice = totalPriceElement.textContent;

    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeatsArray));
    localStorage.setItem("totalPrice", totalPrice);

    // 필수 정보를 localStorage에 저장
    localStorage.setItem('performanceId', mt20id);
    localStorage.setItem('selectedDate', selectedDate);
    localStorage.setItem('selectedTime', selectedTime);
    localStorage.setItem('dayOfWeek', dayOfWeek);


    // 다음 단계로 이동
    window.location.href = "/payment/booking-info";
  });

});
