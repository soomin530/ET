// 전역 변수 설정
let page = 1;
let isLoading = false;
let hasMoreData = true;
let currentFilter = 'all';
let initialLoadComplete = false;

// HTML 이스케이프 함수
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 공연 요소 생성
function createPerformanceElement(performance) {
    const div = document.createElement('div');
    div.className = 'performance-item';
    div.onclick = () => location.href = `/perfmgr/performance-manager-detail/${performance.mt20id}`;

    const img = new Image();
    img.src = performance.poster || '/images/default-poster.png';
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

// 데이터 로드 함수
function loadMorePerformances() {
    if (isLoading || !hasMoreData) return;

    if (initialLoadComplete && page === 0) return;

    isLoading = true;
    const spinner = document.querySelector('.loading-spinner');
    spinner.classList.add('show');

    // 관리자 페이지에서는 genre를 'all'로 설정
    fetch(`/performanceApi/genre/more?page=${page}&genre=&filter=${currentFilter}`)
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
                hasMoreData = false;
                if (page === 1) {
                    showNoDataMessage(currentFilter);
                }
            }
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

// 데이터 없음 메시지 표시
function showNoDataMessage(filter) {
    const container = document.querySelector('.performance-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-data-message';
    messageDiv.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🎭</div>
            <h3>등록된 공연이 없습니다</h3>
            <p>새로운 공연을 등록해주세요</p>
        </div>
    `;
    container.appendChild(messageDiv);
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

// 필터 클릭 핸들러
function handleFilterClick(e) {
    const button = e.target;
    if (button.classList.contains('active')) return;

    // 활성화된 버튼 변경
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // 필터 변경 및 데이터 리로드
    currentFilter = button.dataset.filter;
    page = 1;
    hasMoreData = true;
    const grid = document.getElementById('performanceGrid');
    grid.innerHTML = '';
    loadMorePerformances();
}

// 스크롤 이벤트 핸들러
const scrollHandler = throttle(() => {
    if (isLoading || !hasMoreData) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
        loadMorePerformances();
    }
}, 150);

// 초기화 및 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    // 필터 버튼 이벤트 리스너 등록
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // 첫 데이터 로드
    loadMorePerformances();

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', scrollHandler, { passive: true });
});

// 정리
window.addEventListener('unload', () => {
    window.removeEventListener('scroll', scrollHandler);
});