// 전역 변수 선언
let page = 1;
let isLoading = false;
let hasMoreData = true;
let currentFilter = 'all';
let initialLoadComplete = false; // 초기 로드 체크 변수 추

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
	
	console.log(filter);
    
    let message, suggestion;
    switch(filter) {
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

	// 이미 초기 로드가 완료되었고, 현재 페이지가 0이면 스킵
	if (initialLoadComplete && page === 0) {
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

	const url = `/performanceApi/genre/more?page=${page}&genre=${encodeURIComponent(currentGenre)}&filter=${currentFilter}`;

	fetch(url)
		.then(response => {
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return response.json();
		})
		.then(performances => {
			if (performances && performances.length > 0) {
				const grid = document.getElementById('performanceGrid');
				performances.forEach(performance => {
					grid.appendChild(createPerformanceElement(performance));
				});
				page += 1;
			} else {
			    const perforContainer = document.querySelector('.performance-container');
			    hasMoreData = false;
			    const noDataMessage = createNoDataMessage(currentFilter);
			    perforContainer.appendChild(noDataMessage);
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
	page = 1;
	hasMoreData = true;
	isLoading = false;
	initialLoadComplete = false; // 초기 로드 상태도 초기화

	loadMorePerformances();
}

// 초기화 및 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
	// 탭 버튼 이벤트 설정
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(button => {
		button.addEventListener('click', () => handleTabClick(button));
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

// 스크롤 이벤트 등록
window.addEventListener('scroll', scrollHandler, { passive: true });

// 정리
window.addEventListener('unload', () => {
	window.removeEventListener('scroll', scrollHandler);
});