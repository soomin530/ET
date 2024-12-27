
class Calendar {
	constructor() {
        this.date = new Date();
        this.selectedDate = null;
		this.performance = performanceData;
        this.startDate = new Date(performanceData.startDate);
        this.endDate = new Date(performanceData.endDate);
        this.initElements();
        this.renderCalendar();
        this.addEventListeners();
	}

	initElements() {
		this.currentMonthElement = document.getElementById('currentMonth');
		this.daysContainer = document.getElementById('calendar-days');
	}

	addEventListeners() {
		document.getElementById('prevMonth').addEventListener('click', () => {
			this.date.setMonth(this.date.getMonth() - 1);
			this.renderCalendar();
		});

		document.getElementById('nextMonth').addEventListener('click', () => {
			this.date.setMonth(this.date.getMonth() + 1);
			this.renderCalendar();
		});
	}

	formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		return `${year}. ${month}`;
	}

	isDateAvailable(date) {
		const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
		return this.performance.schedule[dayName] !== undefined;
	}

	isDateInRange(date) {
		return date >= this.startDate && date <= this.endDate;
	}

	renderCalendar() {
		this.currentMonthElement.textContent = this.formatDate(this.date);

		const firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
		const lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
		const startDay = firstDay.getDay();
		const totalDays = lastDay.getDate();

		this.daysContainer.innerHTML = '';

		// 이전 달의 날짜들
		for (let i = 0; i < startDay; i++) {
			const dayElement = document.createElement('div');
			dayElement.className = 'day muted';
			dayElement.textContent = '';
			this.daysContainer.appendChild(dayElement);
		}

		// 현재 달의 날짜들
		for (let day = 1; day <= totalDays; day++) {
			const dayElement = document.createElement('div');
			dayElement.className = 'day';
			dayElement.textContent = day;

			const currentDate = new Date(this.date.getFullYear(), this.date.getMonth(), day);

			if (this.isDateInRange(currentDate)) {
				if (this.isDateAvailable(currentDate)) {
					dayElement.classList.add('available');
					dayElement.addEventListener('click', () => {
						const prevSelected = this.daysContainer.querySelector('.selected');
						if (prevSelected) {
							prevSelected.classList.remove('selected');
						}
						dayElement.classList.add('selected');
						this.selectedDate = currentDate;
						this.handleDateSelection(currentDate);
					});
				} else {
					dayElement.classList.add('disabled');
				}
			} else {
				dayElement.classList.add('disabled');
			}

			this.daysContainer.appendChild(dayElement);
		}
	}

	handleDateSelection(date) {
		const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
		document.getElementById('selected-date').innerText =
			`선택된 날짜: ${this.formatDisplayDate(date)} (${dayName})`;

		const timeSlotsContainer = document.getElementById('time-slots');
		timeSlotsContainer.innerHTML = '';

		if (this.performance.schedule[dayName]) {
			this.performance.schedule[dayName].forEach(slot => {
				const timeSlot = document.createElement('div');
				timeSlot.className = 'time-slot';
				timeSlot.innerHTML = `
                  <div>
                      <div class="time">${slot.time}</div>
                      <div class="round">${slot.round}</div>
                  </div>
                  <span class="seat-info">(잔여: ${slot.seats}석)</span>
              `;
				timeSlot.onclick = () => this.selectTimeSlot(timeSlot, slot.time, slot.round);
				timeSlotsContainer.appendChild(timeSlot);
			});
		} else {
			timeSlotsContainer.innerHTML = '<p>해당 날짜에는 공연이 없습니다.</p>';
		}

		// 예매 버튼 비활성화
		document.getElementById('booking-btn').disabled = true;
	}

	formatDisplayDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}.${month}.${day}`;
	}

	selectTimeSlot(selectedSlot, time, round) {
		// 모든 시간 슬롯에서 선택 클래스 제거
		document.querySelectorAll('.time-slot').forEach(slot => {
			slot.classList.remove('selected');
		});

		// 선택된 슬롯에 선택 클래스 추가
		selectedSlot.classList.add('selected');

		// 선택된 시간과 회차 저장
		this.selectedTime = time;
		this.selectedRound = round;

		// 예매 버튼 활성화
		document.getElementById('booking-btn').disabled = false;
	}
}


// 기존의 예매 버튼 클릭 이벤트를 수정
document.getElementById('booking-btn').onclick = function() {
	const calendar = window.calendarInstance;
	if (calendar.selectedDate && calendar.selectedTime && calendar.selectedRound) {
		
		// mt20id 값 가져오기
    const mt20id = document.getElementById('mt20id')?.value;
    if (!mt20id) {
        console.error("mt20id 값이 누락되었습니다.");
        alert("공연 정보를 불러오는 데 문제가 발생했습니다. 다시 시도해주세요.");
        return;
    }
    const selectedDate = calendar.formatDisplayDate(calendar.selectedDate);
    const selectedTime = calendar.selectedTime;

		if (!mt20id || !selectedDate || !selectedTime) {
			console.error("필수 파라미터가 누락되었습니다:", { mt20id, selectedDate, selectedTime });
			return;
		}

		const url = `/payment/seat-selection?mt20id=${mt20id}&selectedDate=${selectedDate}&selectedTime=${selectedTime}`;

		const width = 1200;  // 창 너비
    const height = 800;  // 창 높이
    // 화면 중앙 좌표 계산
    const left = (window.innerWidth / 2) - (width / 2) + window.screenX;
    const top = (window.innerHeight / 2) - (height / 2) + window.screenY;

    // 새 창 열기
    const newWindow=  window.open(
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

	}
};

// 페이지 로드 시 캘린더 인스턴스 생성
window.addEventListener('DOMContentLoaded', () => {
	window.calendarInstance = new Calendar();
});