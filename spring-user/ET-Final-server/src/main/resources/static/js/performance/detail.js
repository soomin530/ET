// 카카오지도 API
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도를 클릭한 위치에 표출할 마커입니다
var marker = new kakao.maps.Marker({ 
    // 지도 중심좌표에 마커를 생성합니다 
    position: map.getCenter() 
}); 
// 지도에 마커를 표시합니다
marker.setMap(map);

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
    // 클릭한 위도, 경도 정보를 가져옵니다 
    var latlng = mouseEvent.latLng; 
    
    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(latlng);
    
    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    
    var resultDiv = document.getElementById('clickLatlng'); 
    resultDiv.innerHTML = message;
    
}); 
 
 
 
 // 공연 데이터
 const performances = [
  {
      id: 'PF254556',
      title: '공연 1',
      startDate: '2024-12-24',
      endDate: '2025-01-25',
      schedule: {
          '화요일': [
              { time: '14:00', round: '1회차', seats: 50 },
              { time: '19:30', round: '2회차', seats: 45 }
          ],
          '수요일': [
              { time: '14:00', round: '1회차', seats: 45 },
              { time: '19:30', round: '2회차', seats: 40 }
          ],
          '목요일': [
              { time: '14:00', round: '1회차', seats: 30 },
              { time: '19:30', round: '2회차', seats: 35 }
          ],
          '금요일': [
              { time: '14:00', round: '1회차', seats: 25 },
              { time: '19:30', round: '2회차', seats: 30 }
          ]
      }
  }
];

class Calendar {
  constructor() {
      this.date = new Date();
      this.selectedDate = null;
      this.performance = performances[0];
      this.startDate = new Date(this.performance.startDate);
      this.endDate = new Date(this.performance.endDate);
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

// 예매 버튼 클릭 이벤트 설정
document.getElementById('booking-btn').onclick = function () {
  const calendar = window.calendarInstance;
  if (calendar.selectedDate && calendar.selectedTime && calendar.selectedRound) {
      alert(`선택하신 공연 일정은 ${calendar.formatDisplayDate(calendar.selectedDate)} ${calendar.selectedTime} (${calendar.selectedRound}) 입니다.`);
      // 여기에 예매 처리 로직 추가
  }
};

// 페이지 로드 시 캘린더 인스턴스 생성
window.addEventListener('DOMContentLoaded', () => {
  window.calendarInstance = new Calendar();
});