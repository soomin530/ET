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
        this.performance = performanceData;  // 공연 데이터 저장
        this.startDate = new Date(performanceData.startDate);  // 공연 시작일
        this.endDate = new Date(performanceData.endDate);  // 공연 종료일
        
        // 시작 날짜의 월을 초기 날짜로 설정
        this.date = new Date(this.startDate);
        this.selectedDate = null;  // 선택된 날짜를 저장할 변수
        this.initElements();  // DOM 요소 초기화
        this.renderCalendar();  // 캘린더 렌더링
        this.addEventListeners();  // 이벤트 리스너 등록
    }

    /**
     * 필요한 DOM 요소들을 초기화하는 메소드
     */
    initElements() {
        this.currentMonthElement = document.getElementById('currentMonth');  // 현재 월 표시 요소
        this.daysContainer = document.getElementById('calendar-days');  // 날짜 컨테이너 요소
    }

    /**
     * 이전/다음 월 버튼에 대한 이벤트 리스너를 등록하는 메소드
     */
    addEventListeners() {
        // 이전 월 버튼 클릭 이벤트
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.renderCalendar();
        });

        // 다음 월 버튼 클릭 이벤트
        document.getElementById('nextMonth').addEventListener('click', () => {
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
        const month = String(date.getMonth() + 1).padStart(2, '0');
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
        const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
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
        const lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
        const startDay = firstDay.getDay();  // 월의 시작 요일
        const totalDays = lastDay.getDate();  // 월의 총 일수

        this.daysContainer.innerHTML = '';

        // 이전 달의 날짜들을 빈 칸으로 채움
        for (let i = 0; i < startDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day muted';
            dayElement.textContent = '';
            this.daysContainer.appendChild(dayElement);
        }

        // 현재 달의 날짜들을 생성하고 표시
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;

            const currentDate = new Date(this.date.getFullYear(), this.date.getMonth(), day);

            // 날짜가 공연 기간 내에 있는지 확인
            if (this.isDateInRange(currentDate)) {
                if (this.isDateAvailable(currentDate)) {
                    // 공연이 있는 날짜는 선택 가능하도록 설정
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
                    // 공연이 없는 날짜는 비활성화
                    dayElement.classList.add('disabled');
                }
            } else {
                // 공연 기간 외의 날짜는 비활성화
                dayElement.classList.add('disabled');
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
        const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
        document.getElementById('selected-date').innerText =
            `선택된 날짜: ${this.formatDisplayDate(date)} (${dayName})`;

        const timeSlotsContainer = document.getElementById('time-slots');
        timeSlotsContainer.innerHTML = '';

        // 선택된 날짜의 공연 시간대 표시
        if (this.performance.schedule[dayName]) {
            this.performance.schedule[dayName].forEach(slot => {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
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
            timeSlotsContainer.innerHTML = '<p>해당 날짜에는 공연이 없습니다.</p>';
        }

        // 새로운 날짜 선택 시 예매 버튼 비활성화
        document.getElementById('booking-btn').disabled = true;
    }

    /**
     * 날짜를 'YYYY.MM.DD' 형식으로 포맷팅하는 메소드
     * @param {Date} date - 포맷팅할 날짜
     * @returns {string} 포맷팅된 날짜 문자열
     */
    formatDisplayDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    /**
     * 시간대가 선택되었을 때의 처리를 담당하는 메소드
     * @param {HTMLElement} selectedSlot - 선택된 시간대 요소
     * @param {string} time - 선택된 시간
     */
    selectTimeSlot(selectedSlot, time) {
        // 모든 시간 슬롯에서 선택 표시 제거
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // 선택된 시간대 표시
        selectedSlot.classList.add('selected');

        // 선택된 시간과 회차 정보 저장
        this.selectedTime = time;

        // 예매 버튼 활성화
        document.getElementById('booking-btn').disabled = false;
    }
}

// 예매 버튼 클릭 이벤트 핸들러
document.getElementById('booking-btn').onclick = function() {
    const calendar = window.calendarInstance;
    if (calendar.selectedDate && calendar.selectedTime) {
        // 예매 폼이 없으면 생성
        if (!document.getElementById('bookingForm')) {
            document.body.insertAdjacentHTML('beforeend', formHTML);
        }

        // 예매 폼에 선택된 정보 설정
        const form = document.getElementById('bookingForm');
        form.querySelector('input[name="selectedDate"]').value = calendar.formatDisplayDate(calendar.selectedDate);
        form.querySelector('input[name="selectedTime"]').value = calendar.selectedTime;

        // 예매 폼 제출
        form.submit();
    }
};

// 페이지 로드 완료 시 캘린더 인스턴스 생성
window.addEventListener('DOMContentLoaded', () => {
    window.calendarInstance = new Calendar();
});