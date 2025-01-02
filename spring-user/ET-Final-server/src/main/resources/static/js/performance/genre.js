function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function getCurrentGenre() {
	const path = window.location.pathname;
	const match = path.match(/genre\/([^/]+)$/);
	if (match) {
		let urlGenre = match[1];
		switch (urlGenre) {
			case 'musical':
				return '뮤지컬';
			case 'theater':
				return '연극';
			case 'classic':
				return '서양음악(클래식)';
			default:
				return urlGenre;
		}
	}
	console.error('Cannot determine genre from URL:', path);
	return null;
}

function createPerformanceElement(performance) {
	const div = document.createElement('div');
	div.className = 'performance-item';
	div.onclick = () => location.href = `/performance/detail/${performance.mt20id}`;

	// 이미지를 미리 생성하고 속성 설정
	const img = new Image();
	img.src = performance.poster;
	img.className = 'performance-image';
	img.alt = performance.prfnm;
	img.loading = 'lazy';
	img.decoding = 'async';

	// 이미지 로드 완료 시 한 번만 처리
	if (!img.complete) {
		img.onload = function() {
			this.classList.add('loaded');
			img.onload = null;
		};
	} else {
		img.classList.add('loaded');
	}

	// 에러 처리 강화
	img.onerror = function() {
		if (this.src !== '/images/default-poster.png') {
			this.src = '/images/default-poster.png';
		}
		this.onerror = null;
	};

	div.innerHTML = `
               <div class="image-container"></div>
               <div class="performance-info">
                   <div class="performance-title">${escapeHtml(performance.prfnm)}</div>
                   <div class="performance-date">
                       <span>${performance.prfpdfrom}</span> ~
                       <span>${performance.prfpdto}</span>
                   </div>
                   <div class="performance-venue">${escapeHtml(performance.fcltynm)}</div>
               </div>
           `;

	const container = div.querySelector('.image-container');
	container.appendChild(img);

	return div;
}

function loadMorePerformances() {
	if (isLoading || !hasMoreData) return;

	isLoading = true;
	const spinner = document.querySelector('.loading-spinner');
	spinner.classList.add('show'); // 스크롤 시 로딩 스피너 표시

	const currentGenre = getCurrentGenre();
	if (!currentGenre) {
		console.error('Genre not found');
		return;
	}

	fetch(`/performanceApi/genre/more?page=${page + 1}&genre=${encodeURIComponent(currentGenre)}`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(performances => {
			if (performances && performances.length > 0) {
				const grid = document.getElementById('performanceGrid');
				performances.forEach(performance => {
					const performanceElement = createPerformanceElement(performance);
					grid.appendChild(performanceElement);
				});
				page += 1;
			} else {
				hasMoreData = false; // 더 이상 데이터가 없을 경우
			}
		})
		.catch(error => {
			console.error('Error loading performances:', error);
			hasMoreData = false;
		})
		.finally(() => {
			isLoading = false;
			spinner.classList.remove('show'); // 로딩 완료 후 스피너 숨기기
		});
}

// lodash의 throttle 대신 자체 구현
function throttle(func, limit) {
	let inThrottle;
	return function(...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	}
}

// 스크롤 핸들러 수정
const scrollHandler = throttle(() => {
	if (isLoading || !hasMoreData) return;

	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

	if (scrollTop + clientHeight >= scrollHeight - 300) {
		loadMorePerformances();
	}
}, 150);

// 스크롤 이벤트
window.addEventListener('scroll', scrollHandler, { passive: true });

// 스크롤 로드 이벤트
window.addEventListener('unload', () => {
	window.removeEventListener('scroll', scrollHandler);
});

// 탭 버튼 기능 구현
document.addEventListener('DOMContentLoaded', function() {
	const tabButtons = document.querySelectorAll('.tab-button');

	tabButtons.forEach(button => {
		button.addEventListener('click', function() {
			// 이미 활성화된 버튼을 다시 클릭한 경우 무시
			if (this.classList.contains('active')) return;

			// 모든 버튼에서 active 클래스 제거
			tabButtons.forEach(btn => btn.classList.remove('active'));

			// 클릭된 버튼에 active 클래스 추가
			this.classList.add('active');

			// 현재 필터 업데이트
			currentFilter = this.dataset.filter;

			// 기존 데이터 초기화
			const performanceGrid = document.getElementById('performanceGrid');
			performanceGrid.innerHTML = '';

			// 상태 초기화
			page = 1;
			hasMoreData = true;
			isLoading = false;

			// 새로운 데이터 로드
			loadMorePerformances();
		});
	});
});

// loadMorePerformances 함수
function loadMorePerformances() {
	if (isLoading || !hasMoreData) return;

	isLoading = true;
	const spinner = document.querySelector('.loading-spinner');
	spinner.classList.add('show');

	const currentGenre = getCurrentGenre();
	if (!currentGenre) {
		console.error('Genre not found');
		return;
	}
	
	// URL에 필터 파라미터 추가
	const url = `/performanceApi/genre/more?page=${page}&genre=${encodeURIComponent(currentGenre)}&filter=${currentFilter}`;

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(performances => {
			if (performances && performances.length > 0) {
				const grid = document.getElementById('performanceGrid');
				performances.forEach(performance => {
					const performanceElement = createPerformanceElement(performance);
					grid.appendChild(performanceElement);
				});
				page += 1;
			} else {
				hasMoreData = false;
			}
		})
		.catch(error => {
			console.error('Error loading performances:', error);
			hasMoreData = false;
		})
		.finally(() => {
			isLoading = false;
			spinner.classList.remove('show');
		});
}