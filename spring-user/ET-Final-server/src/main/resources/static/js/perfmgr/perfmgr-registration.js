$(document).ready(function() {
	initializeComponents();
	setupEventListeners();
});

function initializeComponents() {
	// Summernote 초기화
	$('#description').summernote({
		height: 300,
		lang: 'ko-KR',
		placeholder: '공연 설명을 입력하세요.',
		callbacks: {
			onImageUpload: function(files) {
				uploadImage(files[0], this);
			}
		}
	});

	// 스크롤 버튼 관련 코드
const scrollToTopButton = document.getElementById('scrollToTop');
console.log(scrollToTopButton);

// 스크롤 버튼 이벤트 리스너 등록
scrollToTopButton.addEventListener('click', scrollToTop);
window.addEventListener('scroll', throttle(toggleScrollButton, 100), { passive: true }); 
									// 이벤트가 발생했을 때 실행할 함수  // 이벤트 옵션(이벤트 핸들러가 기본 동작을 방해하지 않는다고 브라우저에 알려줌)

// 스크롤 버튼 표시/숨김 처리
// 스크롤 위치에 따라 버튼의 표시 여부를 결정하는 함수
// 스크롤 이벤트가 100ms 내에 여러 번 발생하더라도 toggleScrollButton 함수는 최대 한 번만 실행
function toggleScrollButton() { 
	if (window.scrollY > 300) { // 스크롤 위치가 300px(세로 거리) 이상이면
		scrollToTopButton.classList.add('visible'); // 버튼을 표시
	} else {
		scrollToTopButton.classList.remove('visible'); // 버튼 숨김
	}
}

// 최상단으로 스크롤
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

// 스로틀 함수
// 이벤트가 너무 자주 호출되는 것을 방지하여 성능 문제를 줄이는 데 사용
// throttle은 주어진 시간 간격(limit) 동안 함수를 한 번만 실행하도록 제한
// 스크롤 이벤트가 100ms 내에 여러 번 발생하더라도 toggleScrollButton 함수는 최대 한 번만 실행
function throttle(func, limit) {
	let inThrottle; 	// 스로틀 상태를 나타냄
	return function(...args) {
		if (!inThrottle) {
			func.apply(this, args); 	// 함수 실행
			inThrottle = true; 	// 실행 중 상태로 변경
			setTimeout(() => inThrottle = false, limit); // limit 시간 후 다시 실행 가능
		} 
	}
}

// 스크롤 이벤트 핸들러
// 사용자가 페이지 하단에 가까워지면 자동으로 추가 데이터를 로드
// 스크롤 위치가 하단에서 300px 이내일 때 새로운 데이터 요청
// 중복 로딩 방지를 위한 isLoading 체크
// 150ms 쓰로틀링 적용으로 성능 최적화
const scrollHandler = throttle(() => {
	if (isLoading || !hasMoreData) return;
	// 데이터를 로드 중이거나 로드할 데이터가 더 이상 없는 경우 스크롤 작업을 중단
	// isLoading : 데이터 로드 중임을 나타내는 플래그. 데이터가 로드 중일 때 중복 요청을 방지
	// hasMoreData : 추가 데이터가 없으면 더 이상 요청하지 않음

	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	// 현재 문서의 스크롤된 세로 거리, 스크롤 가능한 전체 콘텐츠의 높이, 현재 보이는 화면 높이
	if (scrollTop + clientHeight >= scrollHeight - 300) {
	// 사용자가 페이지 하단으로부터 300px 이내로 스크롤했는지 확인하는 조건문
	// scrollTop + clientHeight: 현재 보이는 화면의 하단 위치
	// scrollHeight - 300: 문서의 전체 높이에서 300px을 뺀 위치
		loadMorePerformances();
	}
}, 150);

// 사용자 스크롤: 사용자가 페이지를 스크롤할 때마다 scroll 이벤트가 발생합니다.
// throttle 적용: scroll 이벤트 핸들러는 throttle을 통해 100ms마다 한 번씩만 실행됩니다. 이를 통해 과도한 함수 호출을 방지합니다.
// toggleScrollButton 함수는 현재 스크롤 위치를 확인하고 버튼의 표시 여부를 결정합니다.
// { passive: true } 옵션으로 기본 스크롤 동작을 방해하지 않고 브라우저의 성능을 최적화합니다.

// 현재 데이터 로드 중(isLoading)이거나 더 이상 로드할 데이터가 없음(!hasMoreData) 경우, 함수 실행을 중단합니다.

// 사용자의 현재 스크롤 위치와 뷰포트 높이를 더하여 화면의 아래쪽 끝 위치를 계산합니다.
// 문서의 전체 높이에서 300픽셀을 뺀 값과 비교하여, 사용자가 문서의 하단에서 300픽셀 이내로 스크롤했는지 확인합니다.

// 조건이 충족되면 loadMorePerformances() 함수를 호출하여 추가 데이터를 로드합니다.
// 이 과정에서 isLoading 플래그를 true로 설정하여 중복 요청을 방지하고, 데이터 로드가 완료되면 다시 false로 설정합니다.

	// 공연장 목록 로드
	loadVenues();

	// 포스터 미리보기 초기화 추가
	setupPosterPreview();
}

// 공연장 관련 함수들
function loadVenues(keyword = '') {
	$.ajax({
		url: '/performanceApi/venue/list',
		method: 'GET',
		data: { keyword },
		success: function(venues) {
			const select = $('#venue-select');
			select.find('option:not(:first)').remove();

			venues.forEach(venue => {
				select.append($('<option>', {
					value: venue.MT10ID,
					text: venue.FCLTYNM,
					'data-address': venue.ADRES,
					'data-seats': venue.SEATSCALE
				}));
			});
		},
		error: function() {
			alert('공연장 목록을 불러오는데 실패했습니다.');
		}
	});
}

function handleVenueSelection() {
	const selected = $(this).find('option:selected');
	const mt10id = selected.val();

	if (mt10id) {
		// 공연장 정보 표시
		$('#venue-address').text(selected.data('address'));
		$('#venue-seats').text(selected.data('seats'));
		$('#venue-info').slideDown();

		$('#performance-form').data('mt10id', mt10id);
		$('#performance-form').data('fcltynm', selected.text());

		// 좌석 정보와 예약된 일정 로드
		loadVenueSeats(mt10id);
		loadVenueSchedule(mt10id);
	} else {
		$('#venue-info').slideUp();
		clearPriceContainer();
		resetDatePickers();
	}
}

// 좌석 관련 함수들
function loadVenueSeats(mt10id) {
	$.ajax({
		url: `/performanceApi/venue/seats/${mt10id}`,
		method: 'GET',
		success: updatePriceContainer,
		error: function() {
			alert('좌석 정보를 불러오는데 실패했습니다.');
		}
	});
}

function updatePriceContainer(seatInfo) {
	const container = $("#price-container");
	container.empty();

	seatInfo.forEach(seat => {
		container.append(`
            <div class="price-group">
                <div class="form-group">
                    <label>좌석 등급 (${seat.SEAT_COUNT}석)</label>
                    <input type="text" class="form-control" value="${seat.GRADE_NAME}" readonly>
                    <input type="hidden" class="grade-id" value="${seat.GRADE_ID}">
                </div>
                <div class="form-group">
                    <label>가격</label>
                    <input type="number" class="form-control price-input" min="0" step="1000" required>
                </div>
            </div>
        `);
	});
}

// 일정 관련 함수들
function loadVenueSchedule(mt10id) {
	$.ajax({
		url: `/performanceApi/venue/reserved-dates/${mt10id}`,
		method: 'GET',
		success: function(schedules) {
			// 각 기간을 시작일과 종료일로 구분하여 저장
			const reservedRanges = schedules.map(schedule => ({
				from: new Date(schedule.PRFPDFROM),
				to: new Date(schedule.PRFPDTO)
			}));

			initializeDatePickers(reservedRanges);
		},
		error: function() {
			alert('공연장 일정을 불러오는데 실패했습니다.');
			initializeDatePickers([]);
		}
	});
}

function initializeDatePickers(reservedRanges) {
	// 오늘 날짜 설정
	const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

	const commonConfig = {
		locale: "ko",
		dateFormat: "Y-m-d",
		minDate: tomorrow,  // 오늘 이후만 선택 가능
		disable: [
			function(date) {
				// 예약된 날짜 범위와 겹치는지 확인
				return reservedRanges.some(range => {
					return date >= range.from && date <= range.to;
				});
			}
		]
	};

	// 이전 인스턴스가 있다면 제거
	if (fromDatePicker) fromDatePicker.destroy();
	if (toDatePicker) toDatePicker.destroy();

	// 시작일 데이트피커
	fromDatePicker = flatpickr("#prfpdfrom", {
		...commonConfig,
		onChange: function(selectedDates) {
			if (selectedDates[0]) {
				// 시작일로부터 2주 후까지만 선택 가능
				const maxDate = new Date(selectedDates[0]);
				maxDate.setDate(maxDate.getDate() + 13);

				// 시작일부터 maxDate 사이의 가능한 날짜들 찾기
				const availableDates = [];
				let currentDate = new Date(selectedDates[0]);

				while (currentDate <= maxDate) {
					// 예약된 날짜와 겹치지 않는지 확인
					const isReserved = reservedRanges.some(range =>
						currentDate >= range.from && currentDate <= range.to
					);

					if (!isReserved) {
						availableDates.push(new Date(currentDate));
					}
					currentDate.setDate(currentDate.getDate() + 1);
				}

				// 종료일 데이트피커 업데이트
				toDatePicker.set('minDate', selectedDates[0]);
				toDatePicker.set('maxDate', maxDate);
				toDatePicker.set('enable', availableDates);
				toDatePicker.set('disable', []);  // 기존 disable 설정 초기화
			}
		}
	});

	// 종료일 데이트피커
	toDatePicker = flatpickr("#prfpdto", {
		...commonConfig,
		disable: [{ from: "1900-01-01", to: "2100-12-31" }]  // 초기에는 모든 날짜 비활성화
	});
}

// 다음 예약된 날짜를 찾는 유틸리티 함수
function findNextReservedDate(currentDate, reservedRanges) {
	let nextDate = null;

	reservedRanges.forEach(range => {
		if (range.from > currentDate) {
			if (!nextDate || range.from < nextDate) {
				nextDate = range.from;
			}
		}
	});

	return nextDate;
}

// 이벤트 리스너 설정
function setupEventListeners() {
	$('#search-venue').click(() => loadVenues($('#venue-search').val()));
	$('#venue-search').keypress(e => {
		if (e.which === 13) $('#search-venue').click();
	});

	$('#venue-select').change(handleVenueSelection);
	$('#add-schedule').click(addScheduleGroup);

	// 요일 체크박스 변경 이벤트
	$(document).on('change', '.days-buttons input[type="checkbox"]', handleDaySelection);

	// 스케줄 그룹 제거 시 체크박스 상태 업데이트
	$(document).on('click', '.remove-schedule', function() {
		$(this).closest('.schedule-group, .price-group').remove();
		updateDayCheckboxStates();
	});

	$('#performance-form').submit(handleFormSubmit);
}

// 공연 등록 관련 함수들
function handleFormSubmit(e) {
	e.preventDefault();
	if (!validateForm()) return;
	submitPerformance(collectFormData());
}

function validateForm() {
	// 기본 정보 검증
	const basicInfoValid = validateBasicInfo();
	if (!basicInfoValid) return false;

	// 공연 시간 검증
	const scheduleValid = validateSchedules();
	if (!scheduleValid) return false;

	// 가격 정보 검증
	return validatePrices();
}

function validateBasicInfo() {
	if (!$("#prfnm").val().trim()) {
		alert("공연명을 입력해주세요.");
		$("#prfnm").focus();
		return false;
	}

	const runtime = $("#runtime").val();
	if (!runtime || runtime <= 0) {
		alert("올바른 런타임을 입력해주세요.");
		$("#runtime").focus();
		return false;
	}

	return true;
}

// 요일 선택 처리 함수 추가
function handleDaySelection() {
	// 모든 요일 체크박스의 상태를 재설정
	updateDayCheckboxStates();
}

// 요일 체크박스 상태 업데이트 함수
function updateDayCheckboxStates() {
	// 이미 선택된 요일들을 수집
	const selectedDays = new Set();
	$('.schedule-group').each(function() {
		const currentGroup = $(this);
		currentGroup.find('input[type="checkbox"]:checked').each(function() {
			selectedDays.add($(this).val());
		});
	});

	// 각 스케줄 그룹의 체크박스 상태 업데이트
	$('.schedule-group').each(function() {
		const currentGroup = $(this);
		currentGroup.find('input[type="checkbox"]').each(function() {
			const checkbox = $(this);
			const dayValue = checkbox.val();

			// 현재 그룹에서 체크된 것은 제외하고 처리
			if (!checkbox.is(':checked')) {
				const isDisabled = selectedDays.has(dayValue);
				checkbox.prop('disabled', isDisabled);
				checkbox.closest('label').toggleClass('disabled', isDisabled);
			}
		});
	});
}

function validateSchedules() {
	if ($('.schedule-group').length === 0) {
		alert("최소 하나의 공연 시간을 입력해주세요.");
		return false;
	}

	let isValid = true;
	$('.schedule-group').each(function() {
		// 체크박스로 선택된 요일 확인
		const selectedDays = $(this).find('.days-buttons input[type="checkbox"]:checked').length;
		const times = $(this).find('.times-input').val();

		if (selectedDays === 0) {
			alert("요일을 선택해주세요.");
			isValid = false;
			$(this).find('.days-buttons').focus();
			return false;
		}

		if (!times || !validateTimeFormat(times)) {
			alert("올바른 시간 형식을 입력해주세요. (예: 14:00,19:30)");
			$(this).find('.times-input').focus();
			isValid = false;
			return false;
		}

		// 시간이 중복되지 않는지 확인
		const timeArray = times.split(',').map(t => t.trim());
		const uniqueTimes = new Set(timeArray);
		if (timeArray.length !== uniqueTimes.size) {
			alert("동일한 시간이 중복 입력되었습니다.");
			$(this).find('.times-input').focus();
			isValid = false;
			return false;
		}

		// 시간 순서 확인 (선택적)
		const sortedTimes = [...timeArray].sort();
		if (JSON.stringify(timeArray) !== JSON.stringify(sortedTimes)) {
			alert("시간을 오름차순으로 입력해주세요.");
			$(this).find('.times-input').focus();
			isValid = false;
			return false;
		}
	});

	return isValid;
}

function validatePrices() {
	if ($('.price-group').length === 0) {
		alert("최소 하나의 가격 정보를 입력해주세요.");
		return false;
	}

	let isValid = true;
	let usedGrades = new Set();

	$('.price-group').each(function() {
		const grade = $(this).find('.grade-id').val();
		const price = $(this).find('.price-input').val();

		if (!price || price < 0) {
			alert("올바른 가격을 입력해주세요.");
			isValid = false;
			return false;
		}

		if (usedGrades.has(grade)) {
			alert("중복된 좌석 등급이 있습니다.");
			isValid = false;
			return false;
		}
		usedGrades.add(grade);
	});

	return isValid;
}

function collectFormData() {
	return new Promise((resolve, reject) => {
		const formData = {
			prfnm: $('#prfnm').val().trim(),
			runtime: $('#runtime').val(),
			prfcast: $('#cast').val().trim(),
			genrenm: $('#genere').val(),
			prfpdfrom: $('#prfpdfrom').val(),
			prfpdto: $('#prfpdto').val(),
			description: $('#description').summernote('code'),
			mt10id: $('#performance-form').data('mt10id'),
			fcltynm: $('#performance-form').data('fcltynm'),
			area: $('#venue-address').text(),
			schedules: collectSchedules(),
			prices: collectPrices()
		};

		// 포스터 파일이 있는 경우, Base64로 변환
		const posterFile = $('#poster')[0].files[0];
		if (posterFile) {
			const reader = new FileReader();
			reader.onload = function(e) {
				formData.posterBase64 = e.target.result.split(',')[1]; // Base64 데이터만 추출
				formData.posterFileName = posterFile.name;
				resolve(formData);
			};
			reader.onerror = function(e) {
				reject('파일 읽기 실패');
			};
			reader.readAsDataURL(posterFile);
		} else {
			resolve(formData);
		}
	});
}

// 포스터 미리보기 기능
function setupPosterPreview() {
	// 닫기 버튼 추가
    if (!$('#poster-preview .close-preview').length) {
        $('#poster-preview').append('<span class="close-preview">✕</span>');
    }

    // 이미지 미리보기 닫기 이벤트
    $(document).on('click', '.close-preview', function() {
        // 파일 입력 초기화
        $('#poster').val('');
        // 파일 라벨 초기화
        $('.custom-file-label').text('포스터 이미지 선택');
        // 미리보기 이미지 초기화
        $('#poster-preview img').attr('src', '');
        // 미리보기 숨기기
        $('#poster-preview').hide();
    });
	
	$('#poster').change(function(e) {
		const file = e.target.files[0];
		if (file) {
			// 파일 크기 체크 (예: 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('파일 크기는 5MB를 초과할 수 없습니다.');
				this.value = '';
				return;
			}

			// 이미지 타입 체크
			if (!file.type.match('image.*')) {
				alert('이미지 파일만 업로드 가능합니다.');
				this.value = '';
				return;
			}

			// 파일명 표시
			$(this).next('.custom-file-label').text(file.name);

			// 미리보기 표시
			const reader = new FileReader();
			reader.onload = function(e) {
				$('#poster-preview img').attr('src', e.target.result);
				$('#poster-preview').show();
			};
			reader.readAsDataURL(file);
		}
	});
}

function submitPerformance(formData) {
	collectFormData()
		.then(data => {
			$.ajax({
				url: '/performanceApi/register',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(data),
				success: function(response, textStatus, xhr) {
					// HTTP 상태 코드로 성공 여부 확인
					if (xhr.status === 200) {
						alert('공연이 성공적으로 등록되었습니다.');
						window.location.href = '/perfmgr/perfmgr-list'; // 1.10 포워드 주소 수정
					} else {
						alert('공연 등록 중 오류가 발생했습니다.');
					}
				},
				error: function(xhr) {
					if (xhr.status === 500) {
						alert('서버 내부 오류가 발생했습니다.');
					} else {
						alert('공연 등록 중 오류가 발생했습니다. 상태 코드: ' + xhr.status);
					}
				}
			});
		})
		.catch(error => {
			alert('데이터 처리 중 오류가 발생했습니다: ' + error);
		});
}

// 시간 형식 검증
function validateTimeFormat(times) {
	if (!times) return false;

	const timeArray = times.split(',');
	return timeArray.every(time => {
		const trimmed = time.trim();
		if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(trimmed)) {
			return false;
		}
		// 추가적인 시간 범위 체크 (선택적)
		const [hours, minutes] = trimmed.split(':').map(Number);
		return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
	});
}

// addScheduleGroup 함수
function addScheduleGroup() {
	$("#schedule-container").append(`
        <div class="schedule-group">
            <span class="remove-schedule">✕</span>
            <div class="form-group">
                <label>공연 요일 선택</label>
                <div class="days-checkbox-group">
                    <div class="btn-group btn-group-toggle days-buttons" data-toggle="buttons">
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" value="1">월
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" value="2">화
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" value="3">수
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" value="4">목
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" value="5">금
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" value="6">토
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" value="7">일
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>공연 시간 (콤마로 구분)</label>
                <input type="text" class="form-control times-input" 
                       placeholder="예: 14:00,19:30" required>
            </div>
        </div>
    `);

	// 새로운 그룹 추가 후 체크박스 상태 업데이트
	updateDayCheckboxStates();
}

function collectSchedules() {
	const schedules = [];
	$('.schedule-group').each(function() {
		const days = [];
		$(this).find('.days-buttons input[type="checkbox"]:checked').each(function() {
			days.push($(this).val());
		});
		const times = $(this).find('.times-input').val().split(',').map(t => t.trim());

		if (days.length > 0 && times) {
			schedules.push({ days, times });
		}
	});
	return schedules;
}

function collectPrices() {
	const prices = [];
	$('.price-group').each(function() {
		const grade = $(this).find('.grade-id').val();
		const gradeName = $(this).find('input[readonly]').val(); // 좌석 등급 이름
		const price = $(this).find('.price-input').val();

		if (grade && price) {
			prices.push({
				grade: parseInt(grade),
				gradeName: gradeName,
				price: parseInt(price)
			});
		}
	});
	return prices;
}

let fromDatePicker, toDatePicker; // Flatpickr 인스턴스

function clearPriceContainer() {
	$("#price-container").empty();
}

function resetDatePickers() {
	[fromDatePicker, toDatePicker].forEach(fp => fp?.destroy());
	initializeDatePickers([]);
}
