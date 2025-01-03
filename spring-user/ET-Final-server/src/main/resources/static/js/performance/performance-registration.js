$(document).ready(function() {
	// 공연장 검색 및 목록 로드
	function loadVenues(keyword = '') {
		$.ajax({
			url: '/performanceApi/venue/list',
			method: 'GET',
			data: { keyword: keyword },
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

	// 최초 조회
	loadVenues();

	// 검색 버튼 클릭 시
	$('#search-venue').click(function() {
		const keyword = $('#venue-search').val();
		loadVenues(keyword);
	});

	// 검색어 입력 후 엔터 키 처리
	$('#venue-search').keypress(function(e) {
		if (e.which == 13) {
			$('#search-venue').click();
		}
	});

	// 공연장 선택 시 정보 표시
	$('#venue-select').change(function() {
		const selected = $(this).find('option:selected');
		const mt10id = selected.val();

		if (mt10id) {
			$('#venue-address').text(selected.data('address'));
			$('#venue-seats').text(selected.data('seats'));
			$('#venue-info').slideDown();

			// 선택된 공연장 정보를 폼 데이터에 저장
			$('#performance-form').data('mt10id', mt10id);
			$('#performance-form').data('fcltynm', selected.text());
		} else {
			$('#venue-info').slideUp();
		}
	});

	// 기존 폼 제출 함수 수정
	function collectFormData() {
		const formData = {
			// 기존 데이터
			prfnm: $('#prfnm').val(),
			prfruntime: $('#runtime').val(),
			prfcast: $('#cast').val(),
			genrenm: $('#genere').val(),
			prfpdfrom: $('#prfpdfrom').val(),
			prfpdto: $('#prfpdto').val(),
			description: $('#description').summernote('code'),
			daySchedules: collectSchedules(),
			prices: collectPrices(),

			// 공연장 정보 추가
			mt10id: $('#performance-form').data('mt10id'),
			fcltynm: $('#performance-form').data('fcltynm')
		};
		return formData;
	}

	// 폼 유효성 검사 수정
	const originalValidateForm = validateForm;
	validateForm = function() {
		if (!$('#venue-select').val()) {
			alert('공연장을 선택해주세요.');
			$('#venue-select').focus();
			return false;
		}
		return originalValidateForm();
	};

	// Flatpickr 초기화
	const fromDatePicker = flatpickr("#prfpdfrom", {
		locale: "ko",
		dateFormat: "Y-m-d",
		minDate: "today",
		onChange: function(selectedDates) {
			toDatePicker.set("minDate", selectedDates[0]);
		}
	});

	const toDatePicker = flatpickr("#prfpdto", {
		locale: "ko",
		dateFormat: "Y-m-d",
		minDate: "today"
	});

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

	// 공연 시간 추가
	$("#add-schedule").click(function() {
		const scheduleHtml = `
		            <div class="schedule-group">
		                <span class="remove-schedule">✕</span>
		                <div class="form-group">
		                    <label>요일 선택 (여러 개 선택 가능)</label>
		                    <select class="form-control days-select" multiple required>
		                        <option value="1">월요일</option>
		                        <option value="2">화요일</option>
		                        <option value="3">수요일</option>
		                        <option value="4">목요일</option>
		                        <option value="5">금요일</option>
		                        <option value="6">토요일</option>
		                        <option value="7">일요일</option>
		                    </select>
		                </div>
		                <div class="form-group">
		                    <label>공연 시간 (콤마로 구분)</label>
		                    <input type="text" class="form-control times-input" 
		                           placeholder="예: 14:00,19:30" required
		                           pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9](,([0-1][0-9]|2[0-3]):[0-5][0-9])*$">
		                </div>
		            </div>
		        `;
		$("#schedule-container").append(scheduleHtml);
	});

	// 가격 정보 추가
	$("#add-price").click(function() {
		const priceHtml = `
		            <div class="price-group">
		                <span class="remove-schedule">✕</span>
		                <div class="form-group">
		                    <label>좌석 등급</label>
		                    <select class="form-control grade-select" required>
		                        <option value="VIP">VIP석</option>
		                        <option value="R">R석</option>
		                        <option value="S">S석</option>
		                        <option value="A">A석</option>
		                        <option value="B">B석</option>
								<option value="전석">전석</option>
		                    </select>
		                </div>
		                <div class="form-group">
		                    <label>가격</label>
		                    <input type="number" class="form-control price-input" 
		                           min="0" step="1000" required>
		                </div>
		            </div>
		        `;
		$("#price-container").append(priceHtml);
	});

	// 삭제 버튼
	$(document).on("click", ".remove-schedule", function() {
		$(this).closest(".schedule-group, .price-group").remove();
	});

	// 폼 제출
	$("#performance-form").submit(function(e) {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		// collectFormData() 함수 사용
		const formData = collectFormData();
		submitPerformance(formData);
	});
});

// 유효성 검증
function validateForm() {
	// 기본 정보 검증
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

	// 공연 시간 검증
	if ($('.schedule-group').length === 0) {
		alert("최소 하나의 공연 시간을 입력해주세요.");
		return false;
	}

	let isScheduleValid = true;
	$('.schedule-group').each(function() {
		const days = $(this).find('.days-select').val();
		const times = $(this).find('.times-input').val();

		if (!days || days.length === 0) {
			alert("요일을 선택해주세요.");
			isScheduleValid = false;
			return false;
		}

		if (!times || !validateTimeFormat(times)) {
			alert("올바른 시간 형식을 입력해주세요. (예: 14:00,19:30)");
			isScheduleValid = false;
			return false;
		}
	});

	if (!isScheduleValid) return false;

	// 가격 정보 검증
	if ($('.price-group').length === 0) {
		alert("최소 하나의 가격 정보를 입력해주세요.");
		return false;
	}

	let usedGrades = new Set();
	let isPriceValid = true;

	$('.price-group').each(function() {
		const grade = $(this).find('.grade-select').val();
		const price = $(this).find('.price-input').val();

		if (usedGrades.has(grade)) {
			alert("중복된 좌석 등급이 있습니다.");
			isPriceValid = false;
			return false;
		}
		usedGrades.add(grade);

		if (!price || price < 0) {
			alert("올바른 가격을 입력해주세요.");
			isPriceValid = false;
			return false;
		}
	});

	return isPriceValid;
}

// 시간 형식 검증
function validateTimeFormat(times) {
	const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9](,([0-1][0-9]|2[0-3]):[0-5][0-9])*$/;
	return timeRegex.test(times);
}

// 스케줄 정보 수집
function collectSchedules() {
	const schedules = [];
	$('.schedule-group').each(function() {
		const days = $(this).find('.days-select').val();
		const times = $(this).find('.times-input').val().split(',').map(t => t.trim());

		if (days && days.length > 0 && times) {
			schedules.push({
				days: days,
				times: times
			});
		}
	});
	return schedules;
}

// 가격 정보 수집
function collectPrices() {
	const prices = [];
	$('.price-group').each(function() {
		const grade = $(this).find('.grade-select').val();
		const price = $(this).find('.price-input').val();

		if (grade && price) {
			prices.push({
				grade: grade,
				price: parseInt(price)
			});
		}
	});
	return prices;
}

// 공연 등록 요청
function submitPerformance(formData) {
	$.ajax({
		url: '/performanceApi/register',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(formData),
		success: function(response) {
			if (response.success) {
				alert('공연이 성공적으로 등록되었습니다.');
				window.location.href = '/performance/list';
			} else {
				alert(response.message || '공연 등록 중 오류가 발생했습니다.');
			}
		},
		error: function(xhr) {
			const errorMessage = xhr.responseJSON?.message || '공연 등록 중 오류가 발생했습니다.';
			alert(errorMessage);
		}
	});
}