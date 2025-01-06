// 전역 변수 선언
let page = 1;
let isLoading = false;
let hasMoreData = true;
let currentFilter = 'all';
let initialLoadComplete = false; // 초기 로드 체크 변수 추가

// 검색 관련 변수 추가
let searchKeyword = '';
let searchType = 'all';

// 검색 이벤트 핸들러
function handleSearch() {
	const keyword = document.getElementById('performanceSearchInput').value.trim();  // ID 변경
	const type = document.getElementById('performanceSearchType').value;  // ID 변경

	searchKeyword = keyword;
	searchType = type;

	// 검색 시 상태 초기화
	page = 1;
	hasMoreData = true;
	const grid = document.getElementById('performanceGrid');
	grid.innerHTML = '';

	loadMorePerformances();
}

// 스크롤 버튼 관련 코드
const scrollToTopButton = document.getElementById('scrollToTop');

// 스크롤 버튼 표시/숨김 처리
function toggleScrollButton() {
	if (window.scrollY > 300) {
		scrollToTopButton.classList.add('visible');
	} else {
		scrollToTopButton.classList.remove('visible');
	}
}

// 최상단으로 스크롤
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

// HTML 이스케이프 함수
function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

// 현재 장르 가져오기
function getCurrentGenre() {
	const path = window.location.pathname;
	const match = path.match(/genre\/([^/]+)$/);
	if (match) {
		let urlGenre = match[1];
		switch (urlGenre) {
			case 'musical': return '뮤지컬';
			case 'theater': return '연극';
			case 'classic': return '서양음악(클래식)';
			default: return urlGenre;
		}
	}
	console.error('Cannot determine genre from URL:', path);
	return null;
}

// 공연 요소 생성
function createPerformanceElement(performance) {
	const div = document.createElement('div');
	div.className = 'performance-item';
	div.onclick = () => location.href = `/performance/detail/${performance.mt20id}`;

	const img = new Image();
	img.src = performance.poster;
	img.className = 'performance-image';
	img.alt = performance.prfnm;
	img.loading = 'lazy';
	img.decoding = 'async';

	if (!img.complete) {
		img.onload = function() {
			this.classList.add('loaded');
			img.onload = null;
		};
	} else {
		img.classList.add('loaded');
	}

	img.onerror = function() {
		if (this.src !== '/images/default-poster.png') {
			this.src = '/images/default-poster.png';
		}
		this.onerror = null;
	};

	// 별점 생성 함수
	const createStarRating = (rating) => {
		const fullStars = '★'.repeat(Math.floor(rating));
		const emptyStars = '☆'.repeat(5 - Math.floor(rating));
		return `${fullStars}${emptyStars}`;
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
			<div class="performance-rank">
                <div class="review-stars">
                    <span class="static-stars">${createStarRating(performance.prfreviewRank)}</span>
                    <span class="numeric-rating">${performance.prfreviewRank}/5</span>
                </div>
            </div>
        </div>
    `;

	const container = div.querySelector('.image-container');
	container.appendChild(img);

	return div;
}

function createNoDataMessage(filter) {
	const div = document.createElement('div');
	div.className = 'no-data-message';

	let message, suggestion;

	if (searchKeyword) {
		message = '검색 결과가 없습니다';
		suggestion = `<p>다른 검색어로 시도해보세요</p>`;
	} else {
		switch (filter) {
			case 'rating':
				message = '등록된 공연이 없습니다';
				suggestion = `<p>다른 카테고리를 확인해보세요</p>
	                         <div class="filter-suggestions">
	                             <span class="filter-tag" onclick="document.querySelector('[data-filter=\\'rating\\']').click()">인기 공연</span>
	                             <span class="filter-tag" onclick="document.querySelector('[data-filter=\\'upcoming\\']').click()">예정된 공연</span>
	                         </div>`;
				break;
			case 'upcoming':
				message = '예정된 공연이 없습니다';
				suggestion = `<p>다른 장르의 공연을 확인해보세요</p>
	                         <div class="genre-buttons">
	                             <button class="suggestion-btn" onclick="location.href='/performance/genre/musical'">뮤지컬</button>
	                             <button class="suggestion-btn" onclick="location.href='/performance/genre/theater'">연극</button>
	                             <button class="suggestion-btn" onclick="location.href='/performance/genre/classic'">클래식</button>
	                         </div>`;
				break;
			case 'ongoing':
				message = '현재 진행중인 공연이 없습니다';
				suggestion = `<p>곧 시작될 공연을 확인해보세요</p>
	                         <button class="suggestion-btn" onclick="document.querySelector('[data-filter=\\'upcoming\\']').click()">
	                             공연 예정작 보기
	                         </button>`;
				break;
			default:
				message = '등록된 공연이 없습니다';
				suggestion = `<p>다른 카테고리를 확인해보세요</p>
	                         <div class="filter-suggestions">
	                             <span class="filter-tag" onclick="document.querySelector('[data-filter=\\'rating\\']').click()">인기 공연</span>
	                             <span class="filter-tag" onclick="document.querySelector('[data-filter=\\'upcoming\\']').click()">예정된 공연</span>
	                         </div>`;
		}
	}

	div.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🎭</div>
            <h3>${message}</h3>
            ${suggestion}
        </div>
    `;

	return div;
}

// loadMorePerformances 함수
function loadMorePerformances() {
	if (isLoading || !hasMoreData) return;

	// 검색어가 있고, 첫 페이지 이후라면 추가 로드 중단
	if (searchKeyword && page > 1) {
		hasMoreData = false;
		return;
	}

	isLoading = true;
	const spinner = document.querySelector('.loading-spinner');
	spinner.classList.add('show');

	const currentGenre = getCurrentGenre();
	if (!currentGenre) {
		console.error('Genre not found');
		return;
	}
	
	// URL에 검색 파라미터 추가
	const searchParams = new URLSearchParams({
		page: page,
		genre: currentGenre,
		filter: currentFilter,
		searchKeyword: searchKeyword,
		searchType: searchType
	});

	fetch(`/performanceApi/genre/more?${searchParams.toString()}`)
		.then(response => {
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return response.json();
		})
		.then(performances => {
			const grid = document.getElementById('performanceGrid');
			if (performances && performances.length > 0) {
				// Remove any existing no-data message if data is loaded
				const existingNoDataMessage = document.querySelector('.no-data-message');
				if (existingNoDataMessage) {
					existingNoDataMessage.remove();
				}

				performances.forEach(performance => {
					grid.appendChild(createPerformanceElement(performance));
				});
				page += 1;
			} else {
				// Only show no-data message if it's the first load (page === 1) and grid is empty
				if (page === 1 && grid.children.length === 0) {
					const perforContainer = document.querySelector('.performance-container');
					const noDataMessage = createNoDataMessage(currentFilter);
					perforContainer.appendChild(noDataMessage);
				}
				hasMoreData = false;
			}
			// 초기 로드 완료 표시
			initialLoadComplete = true;
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

// 스로틀 함수
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

// 스크롤 이벤트 핸들러
const scrollHandler = throttle(() => {
	if (isLoading || !hasMoreData) return;

	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 300) {
		loadMorePerformances();
	}
}, 150);

// 탭 클릭 핸들러 수정
function handleTabClick(button) {
	if (button.classList.contains('active')) return;

	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(btn => btn.classList.remove('active'));
	button.classList.add('active');

	currentFilter = button.dataset.filter;

	const performanceGrid = document.getElementById('performanceGrid');
	const noDataMessage = document.querySelector('.no-data-message');
	if (noDataMessage) {
		noDataMessage.remove();
	}

	performanceGrid.innerHTML = '';

	// 상태 초기화
	currentFilter = button.dataset.filter;
	page = 1;
	hasMoreData = true;
	const grid = document.getElementById('performanceGrid');
	grid.innerHTML = '';

	loadMorePerformances();
}

// 초기화 및 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
	// 탭 버튼 이벤트 설정
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(button => {
		button.addEventListener('click', () => handleTabClick(button));
	});

	// 검색 관련 이벤트 리스너 추가
	document.getElementById('performanceSearchButton').addEventListener('click', handleSearch);

	document.getElementById('performanceSearchInput').addEventListener('keypress', function(e) {
		if (e.key === 'Enter') {
			handleSearch();
		}
	});

	// 스크롤 이벤트 등록 (throttle 적용)
	window.addEventListener('scroll', throttle(() => {
		if (isLoading || !hasMoreData) return;

		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		if (scrollTop + clientHeight >= scrollHeight - 300) {
			loadMorePerformances();
		}
	}, 50), { passive: true });

	// 첫 데이터 로드는 약간의 지연을 주어 실행
	setTimeout(() => {
		if (!initialLoadComplete) {
			loadMorePerformances();
		}
	}, 100);

});

// 이벤트 리스너 등록
scrollToTopButton.addEventListener('click', scrollToTop);
window.addEventListener('scroll', throttle(toggleScrollButton, 100));
window.addEventListener('scroll', scrollHandler, { passive: true });

// 정리
window.addEventListener('unload', () => {
	scrollToTopButton.removeEventListener('click', scrollToTop);
	window.removeEventListener('scroll', scrollHandler);
});