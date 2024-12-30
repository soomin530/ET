/**
 * 카카오맵 초기화
 */
function initializeKakaoMap() {
	const fcltla = document.getElementById('fcltla').value;
	const fcltlo = document.getElementById('fcltlo').value;

	const mapContainer = document.getElementById('map');
	const mapOption = {
		center: new kakao.maps.LatLng(fcltla, fcltlo),
		level: 3
	};

	const map = new kakao.maps.Map(mapContainer, mapOption);
	const marker = new kakao.maps.Marker({
		position: map.getCenter()
	});
	marker.setMap(map);

	kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
		const latlng = mouseEvent.latLng;
		marker.setPosition(latlng);

		const message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ' +
			'경도는 ' + latlng.getLng() + ' 입니다';

		const resultDiv = document.getElementById('clickLatlng');
		if (resultDiv) {
			resultDiv.innerHTML = message;
		}
	});
}

/**
 * 공연 예매를 위한 캘린더 클래스
 * 날짜 선택, 시간대 선택, 예매 기능을 제공합니다.
 */
class Calendar {
  /**
   * 캘린더 클래스의 생성자
   * 초기 설정 및 이벤트 리스너를 등록합니다.
   */
  constructor() {
    this.performance = performanceData; // 공연 데이터 저장
    this.startDate = new Date(performanceData.startDate); // 공연 시작일
    this.endDate = new Date(performanceData.endDate); // 공연 종료일

    // 시작 날짜의 월을 초기 날짜로 설정
    this.date = new Date(this.startDate);
    this.selectedDate = null; // 선택된 날짜를 저장할 변수
    this.initElements(); // DOM 요소 초기화
    this.renderCalendar(); // 캘린더 렌더링
    this.addEventListeners(); // 이벤트 리스너 등록
  }

  /**
   * 필요한 DOM 요소들을 초기화하는 메소드
   */
  initElements() {
    this.currentMonthElement = document.getElementById("currentMonth"); // 현재 월 표시 요소
    this.daysContainer = document.getElementById("calendar-days"); // 날짜 컨테이너 요소
  }

  /**
   * 이전/다음 월 버튼에 대한 이벤트 리스너를 등록하는 메소드
   */
  addEventListeners() {
    // 이전 월 버튼 클릭 이벤트
    document.getElementById("prevMonth").addEventListener("click", () => {
      this.date.setMonth(this.date.getMonth() - 1);
      this.renderCalendar();
    });

    // 다음 월 버튼 클릭 이벤트
    document.getElementById("nextMonth").addEventListener("click", () => {
      this.date.setMonth(this.date.getMonth() + 1);
      this.renderCalendar();
    });
  }

  /**
   * 날짜를 'YYYY. MM' 형식으로 포맷팅하는 메소드
   * @param {Date} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 날짜 문자열
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}. ${month}`;
  }

  /**
   * 해당 날짜에 공연이 있고 예약 가능한지 확인하는 메소드
   * @param {Date} date - 확인할 날짜
   * @returns {boolean} 예약 가능 여부
   */
  isDateAvailable(date) {
    // 오늘 날짜의 자정 시간으로 설정 (시간, 분, 초 제거)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 지난 날짜인지 확인
    if (date < today) {
      return false;
    }

    // 해당 요일에 공연이 있는지 확인
    const dayName = date.toLocaleDateString("ko-KR", { weekday: "long" });
    return this.performance.schedule[dayName] !== undefined;
  }

  /**
   * 날짜가 공연 기간 내에 있는지 확인하는 메소드
   * @param {Date} date - 확인할 날짜
   * @returns {boolean} 기간 내 포함 여부
   */
  isDateInRange(date) {
    return date >= this.startDate && date <= this.endDate;
  }

  /**
   * 캘린더를 화면에 렌더링하는 메소드
   * 현재 월의 모든 날짜를 표시하고 각 날짜에 대한 이벤트를 설정합니다.
   */
  renderCalendar() {
    this.currentMonthElement.textContent = this.formatDate(this.date);

    const firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    const lastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    );
    const startDay = firstDay.getDay(); // 월의 시작 요일
    const totalDays = lastDay.getDate(); // 월의 총 일수

    this.daysContainer.innerHTML = "";

    // 이전 달의 날짜들을 빈 칸으로 채움
    for (let i = 0; i < startDay; i++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day muted";
      dayElement.textContent = "";
      this.daysContainer.appendChild(dayElement);
    }

    // 현재 달의 날짜들을 생성하고 표시
    for (let day = 1; day <= totalDays; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = day;

      const currentDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        day
      );

      // 날짜가 공연 기간 내에 있는지 확인
      if (this.isDateInRange(currentDate)) {
        if (this.isDateAvailable(currentDate)) {
          // 공연이 있는 날짜는 선택 가능하도록 설정
          dayElement.classList.add("available");
          dayElement.addEventListener("click", () => {
            const prevSelected = this.daysContainer.querySelector(".selected");
            if (prevSelected) {
              prevSelected.classList.remove("selected");
            }
            dayElement.classList.add("selected");
            this.selectedDate = currentDate;
            this.handleDateSelection(currentDate);
          });
        } else {
          // 공연이 없는 날짜는 비활성화
          dayElement.classList.add("disabled");
        }
      } else {
        // 공연 기간 외의 날짜는 비활성화
        dayElement.classList.add("disabled");
      }

      this.daysContainer.appendChild(dayElement);
    }
  }

  /**
   * 날짜가 선택되었을 때의 처리를 담당하는 메소드
   * 선택된 날짜의 공연 시간대를 표시합니다.
   * @param {Date} date - 선택된 날짜
   */
  handleDateSelection(date) {
    const dayName = date.toLocaleDateString("ko-KR", { weekday: "long" });
    document.getElementById(
      "selected-date"
    ).innerText = `선택된 날짜: ${this.formatDisplayDate(date)} (${dayName})`;

    const timeSlotsContainer = document.getElementById("time-slots");
    timeSlotsContainer.innerHTML = "";

    // 선택된 날짜의 공연 시간대 표시
    if (this.performance.schedule[dayName]) {
      this.performance.schedule[dayName].forEach((slot) => {
        const timeSlot = document.createElement("div");
        timeSlot.className = "time-slot";
        timeSlot.innerHTML = `
                    <div>
                        <div class="time">${slot.time}</div>
                    </div>
                    <span class="seat-info">(잔여: ${slot.seats}석)</span>
                `;
        timeSlot.onclick = () => this.selectTimeSlot(timeSlot, slot.time);
        timeSlotsContainer.appendChild(timeSlot);
      });
    } else {
      timeSlotsContainer.innerHTML = "<p>해당 날짜에는 공연이 없습니다.</p>";
    }

    // 새로운 날짜 선택 시 예매 버튼 비활성화
    document.getElementById("booking-btn").disabled = true;
  }

  /**
   * 날짜를 'YYYY.MM.DD' 형식으로 포맷팅하는 메소드
   * @param {Date} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 날짜 문자열
   */
  formatDisplayDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  /**
   * 시간대가 선택되었을 때의 처리를 담당하는 메소드
   * @param {HTMLElement} selectedSlot - 선택된 시간대 요소
   * @param {string} time - 선택된 시간
   */
  selectTimeSlot(selectedSlot, time) {
    // 모든 시간 슬롯에서 선택 표시 제거
    document.querySelectorAll(".time-slot").forEach((slot) => {
      slot.classList.remove("selected");
    });

    // 선택된 시간대 표시
    selectedSlot.classList.add("selected");

    // 선택된 시간과 회차 정보 저장
    this.selectedTime = time;

    // 예매 버튼 활성화
    document.getElementById("booking-btn").disabled = false;
  }
}

/**
 * 리뷰 관련 기능 초기화
 */
function initializeReviews() {
	const mt20id = performanceData.id;
	const currentMemberNo = document.getElementById('currentMemberNo')?.value;

	function loadReviews() {
		$.get(`/performance/review/list/${mt20id}`, function(reviews) {
			const reviewList = $('#reviewList');
			reviewList.empty();

			if (reviews.length === 0) {
				reviewList.html(`
                    <div class="no-review">
                        <p>첫 번째 리뷰를 작성해보세요!</p>
                    </div>
                `);
				return;
			}

			reviews.forEach(review => {
				const stars = '★'.repeat(review.reviewStar) + '☆'.repeat(5 - review.reviewStar);
				const reviewHtml = `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="reviewer-info">
                                <span class="reviewer-name">${review.memberName}</span>
                                <span class="review-date">${new Date(review.createDate).toLocaleDateString()}</span>
                            </div>
                            <div class="review-stars">${stars}</div>
                        </div>
                        <div class="review-content">
                            ${review.reviewContent}
                        </div>
                        ${Number(review.memberNo) === Number(currentMemberNo) ? `
                            <div class="review-actions">
                                <button class="review-action-btn edit-review" data-review-no="${review.reviewNo}">수정</button>
                                <button class="review-action-btn delete-review" data-review-no="${review.reviewNo}">삭제</button>
                            </div>
                        ` : ''}
                    </div>
                `;
				reviewList.append(reviewHtml);
			});
		});
	}

	// 리뷰 등록
	$('#submitReview').click(function() {
		if (!currentMemberNo) {
			alert('로그인 후 이용해주세요.');
			return;
		}

		if (!$('input[name="rating"]:checked').val()) {
			alert('별점을 선택해주세요.');
			return;
		}

		if (!$('#reviewContent').val().trim()) {
			alert('리뷰 내용을 입력해주세요.');
			return;
		}

		const reviewData = {
			mt20id: mt20id,
			reviewStar: $('input[name="rating"]:checked').val(),
			reviewContent: $('#reviewContent').val()
		};

		$.ajax({
			url: '/performance/review/insert',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(reviewData),
			success: function(response) {
				if (response.success) {
					alert('리뷰가 등록되었습니다.');
					$('#reviewContent').val('');
					$('input[name="rating"]').prop('checked', false);
					loadReviews();
				} else {
					alert(response.message);
				}
			},
			error: function() {
				alert('리뷰 등록에 실패했습니다.');
			}
		});
	});

	// 리뷰 수정
	$(document).on('click', '.edit-review', function() {
		const reviewNo = $(this).data('review-no');
		const reviewItem = $(this).closest('.review-item');
		const content = reviewItem.find('.review-content').text().trim();

		reviewItem.find('.review-content').html(`
	           <textarea class="edit-content">${content}</textarea>
	           <div class="edit-actions">
	               <button class="review-action-btn save-edit" data-review-no="${reviewNo}">저장</button>
	               <button class="review-action-btn cancel-edit">취소</button>
	           </div>
	       `);
	});

	// 리뷰 수정 취소
	$(document).on('click', '.cancel-edit', function() {
		loadReviews();
	});

	// 리뷰 수정 저장
	$(document).on('click', '.save-edit', function() {
		const reviewNo = $(this).data('review-no');
		const newContent = $(this).closest('.review-item').find('.edit-content').val();

		if (!newContent.trim()) {
			alert('리뷰 내용을 입력해주세요.');
			return;
		}

		$.ajax({
			url: '/performance/review/update',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				reviewNo: reviewNo,
				reviewContent: newContent
			}),
			success: function(response) {
				if (response.success) {
					alert('리뷰가 수정되었습니다.');
					loadReviews();
				} else {
					alert(response.message);
				}
			},
			error: function() {
				alert('리뷰 수정 중 오류가 발생했습니다.');
			}
		});
	});

	// 리뷰 삭제
	$(document).on('click', '.delete-review', function() {
		if (!confirm('리뷰를 삭제하시겠습니까?')) return;

		const reviewNo = $(this).data('review-no');

		$.ajax({
			url: `/performance/review/delete/${reviewNo}`,
			type: 'POST',
			success: function(response) {
				if (response.success) {
					alert('리뷰가 삭제되었습니다.');
					loadReviews();
				} else {
					alert(response.message);
				}
			},
			error: function() {
				alert('리뷰 삭제 중 오류가 발생했습니다.');
			}
		});
	});

	// 초기 리뷰 로드
	loadReviews();
}

/**
* 페이지 초기화
*/
function initialize() {
	initializeKakaoMap();
	window.calendarInstance = new Calendar();
	initializeReviews();
}

// DOM 로드 완료 시 초기화
window.addEventListener('DOMContentLoaded', initialize);

// 기존의 예매 버튼 클릭 이벤트를 수정
document.getElementById("booking-btn").onclick = function () {
  const calendar = window.calendarInstance;
  if (calendar.selectedDate && calendar.selectedTime) {
		
    // mt20id 값 가져오기
    const mt20id = document.getElementById("mt20id")?.value;
    const selectedDate = calendar
      .formatDisplayDate(calendar.selectedDate)
      .replace(/\./g, "-"); // YYYY-MM-DD로 변환
    const selectedTime = calendar.selectedTime;

    if (!mt20id || !selectedDate || !selectedTime) {
      console.error("필수 파라미터가 누락되었습니다:", {
        mt20id,
        selectedDate,
        selectedTime,
      });
      alert("필수 정보가 누락되었습니다. 다시 선택해주세요.");
      return;
    }

    const url = `/payment/seat-selection?mt20id=${mt20id}&selectedDate=${selectedDate}&selectedTime=${selectedTime}`;

    const width = 1200; // 창 너비
    const height = 800; // 창 높이
    // 화면 중앙 좌표 계산
    const left = window.innerWidth / 2 - width / 2 + window.screenX;
    const top = window.innerHeight / 2 - height / 2 + window.screenY;

    // URL 확인
    console.log("요청 URL:", url);

    // 새 창 열기
    const newWindow = window.open(
      url, // Spring Controller에서 처리 가능한 URL
      "예매창", // 새 창 이름
      `width=${width}, height=${height}, top=${top}, left=${left}, resizable=yes, scrollbars=yes`
    );
    // 새 창 크기 강제로 고정
    if (newWindow) {
      // 새 창 크기 강제 설정
      newWindow.addEventListener("resize", function () {
        newWindow.resizeTo(width, height);
      });
    } else {
      alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.");
    }

    // Spring Controller 응답 확인
    fetch(url)
      .then((response) => {
        console.log("응답 상태:", response.status);
        if (!response.ok) {
          throw new Error("서버에서 실패 응답을 받았습니다.");
        }
        return response.text(); // HTML 응답 받기
      })
      .then((html) => console.log("서버 응답 HTML:", html))
      .catch((error) => console.error("새 창 요청 실패:", error));
  }
};

// 페이지 로드 완료 시 캘린더 인스턴스 생성
window.addEventListener("DOMContentLoaded", () => {
  window.calendarInstance = new Calendar();
});
