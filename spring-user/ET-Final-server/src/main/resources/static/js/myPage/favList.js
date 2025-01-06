// 전역 변수 선언
let page = 1;
let isLoading = false;
let hasMoreData = true;
let initialLoadComplete = false;

// 알림창 표시 함수
function showAlert(message, type = 'success', duration = 2000) {
	// 기존 모달 제거
	const existingModal = document.querySelector('.modal-overlay');
	if (existingModal) {
		existingModal.remove();
	}

	// 모달 생성
	const modalOverlay = document.createElement('div');
	modalOverlay.className = 'modal-overlay';

	const modalContent = document.createElement('div');
	modalContent.className = `alert-modal ${type}`;

	const timerId = 'timer-' + Date.now();

	modalContent.innerHTML = `
        <div class="modal-icon">${type === 'success' ? '✓' : '⚠️'}</div>
        <div class="modal-title">${type === 'success' ? '완료' : '오류'}</div>
        <div class="modal-message">${message}</div>
        <div class="modal-timer" id="${timerId}"></div>
        <button class="modal-confirm">확인</button>
    `;

	modalOverlay.appendChild(modalContent);
	document.body.appendChild(modalOverlay);

	// 모달 표시
	requestAnimationFrame(() => {
		modalOverlay.classList.add('show');
	});

	// 모달 닫기 함수
	function closeModal() {
		modalOverlay.classList.remove('show');
		setTimeout(() => {
			modalOverlay.remove();
		}, 2100);
	}

	// 확인 버튼 이벤트
	modalContent.querySelector('.modal-confirm').addEventListener('click', closeModal);

	// 배경 클릭 시 닫기
	modalOverlay.addEventListener('click', (e) => {
		if (e.target === modalOverlay) {
			closeModal();
		}
	});

	// 자동 닫기 타이머
	setTimeout(closeModal, duration);

	// 타이머 바 애니메이션
	const timerBar = modalContent.querySelector('.modal-timer');
	timerBar.style.cssText = `
        width: 100%;
        height: 3px;
        background: #eee;
        position: relative;
        margin: 20px 0;
        overflow: hidden;
    `;

	const innerBar = document.createElement('div');
	innerBar.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        transition: width ${duration}ms linear;
    `;
	timerBar.appendChild(innerBar);

	// 약간의 지연 후 타이머 시작
	setTimeout(() => {
		innerBar.style.width = '0%';
	}, 50);
}

// HTML 이스케이프 함수
function escapeHtml(unsafe) {
	if (!unsafe) return '';
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

// 공연 요소 생성 함수
function createWishlistItem(performance) {
	if (!performance || !performance.mt20id) {
		console.error('Invalid performance data:', performance);
		return null;
	}

	const div = document.createElement('div');
	div.className = 'wishlist-item';
	div.dataset.performanceId = performance.mt20id;

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.className = 'item-checkbox';
	checkbox.dataset.id = performance.mt20id;

	const img = new Image();
	img.src = performance.poster || '/images/default-poster.png';
	img.className = 'performance-image';
	img.alt = performance.prfnm || '공연 포스터';
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
			this.onerror = null;
		}
	};

	const createStarRating = (rating) => {
		if (!rating || rating < 0 || rating > 5) rating = 0;
		const fullStars = '★'.repeat(Math.floor(rating));
		const emptyStars = '☆'.repeat(5 - Math.floor(rating));
		return `${fullStars}${emptyStars}`;
	};

	div.innerHTML = `
        <div class="checkbox-container">
            ${checkbox.outerHTML}
        </div>
        <div class="image-container"></div>
        <div class="performance-info">
            <div class="performance-title">${escapeHtml(performance.prfnm)}</div>
            <div class="performance-date">
                <span>${performance.prfpdfrom || '날짜 미정'}</span> ~
                <span>${performance.prfpdto || '날짜 미정'}</span>
            </div>
            <div class="performance-venue">${escapeHtml(performance.fcltynm || '장소 미정')}</div>
            <div class="performance-rank">
                <div class="review-stars">
                    <span class="static-stars">${createStarRating(performance.prfreviewRank)}</span>
                    <span class="numeric-rating">${performance.prfreviewRank ? performance.prfreviewRank.toFixed(1) : '0.0'}/5</span>
                </div>
            </div>
        </div>
    `;

	const container = div.querySelector('.image-container');
	container.appendChild(img);

	// 이벤트 위임을 통한 클릭 이벤트 처리
	div.addEventListener('click', (e) => {
		const isCheckbox = e.target.classList.contains('item-checkbox');
		const isCheckboxContainer = e.target.closest('.checkbox-container');

		if (!isCheckbox && !isCheckboxContainer) {
			location.href = `/performance/detail/${performance.mt20id}`;
		}
	});

	return div;
}

// 찜목록 로드 함수
function loadWishlist() {
	if (isLoading || !hasMoreData) return;

	// 이미 초기 로드가 완료되었고, 현재 페이지가 0이면 스킵
	if (initialLoadComplete && page === 0) {
		return;
	}

	isLoading = true;
	const spinner = document.querySelector('.loading-spinner');
	spinner.classList.add('show');

	fetch(`/mypageApi/items?page=${page}`)
		.then(response => {
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return response.json();
		})
		.then(performances => {
			const grid = document.getElementById('wishlistGrid');

			if (performances && Array.isArray(performances) && performances.length > 0) {
				// Remove any existing no-data message if data is loaded
				const existingNoDataMessage = document.querySelector('.no-data-message');
				if (existingNoDataMessage) {
					existingNoDataMessage.remove();
				}

				performances.forEach(performance => {
					const item = createWishlistItem(performance);
					if (item) grid.appendChild(item);
				});
				page += 1;
			} else {
				hasMoreData = false;
				if (page === 1 && grid.children.length === 0) {
					showEmptyState();
				}
			}
			initialLoadComplete = true;
		})
		.catch(error => {
			console.error('Error loading wishlist:', error);
			hasMoreData = false;
			showErrorState();
		})
		.finally(() => {
			isLoading = false;
			spinner.classList.remove('show');
		});
}

// 체크박스 관련 함수들
function initializeCheckboxes() {
	const selectAllCheckbox = document.getElementById('selectAll');
	const deleteButton = document.getElementById('deleteSelected');

	if (!selectAllCheckbox || !deleteButton) {
		console.error('Required elements not found');
		return;
	}

	selectAllCheckbox.addEventListener('change', function() {
		const checkboxes = document.querySelectorAll('.item-checkbox');
		checkboxes.forEach(checkbox => {
			checkbox.checked = this.checked;
		});
		updateDeleteButtonState();
	});

	// 이벤트 위임을 사용하여 체크박스 변경 감지
	document.getElementById('wishlistGrid').addEventListener('change', function(e) {
		if (e.target.classList.contains('item-checkbox')) {
			updateDeleteButtonState();
			updateSelectAllCheckbox();
		}
	});

	deleteButton.addEventListener('click', deleteSelectedItems);
}

function updateSelectAllCheckbox() {
	const selectAllCheckbox = document.getElementById('selectAll');
	const checkboxes = document.querySelectorAll('.item-checkbox');
	const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');

	if (checkboxes.length === 0) {
		selectAllCheckbox.checked = false;
		selectAllCheckbox.disabled = true;
	} else {
		selectAllCheckbox.disabled = false;
		selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length;
	}
}

function updateDeleteButtonState() {
	const deleteButton = document.getElementById('deleteSelected');
	const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
	deleteButton.disabled = checkedBoxes.length === 0;
}

// 선택된 항목 삭제
async function deleteSelectedItems() {
	const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
	const selectedIds = Array.from(checkedBoxes).map(checkbox => checkbox.dataset.id);

	if (selectedIds.length === 0) return;

	if (!confirm('선택한 공연들을 찜목록에서 삭제하시겠습니까?')) return;

	try {
		const response = await fetch('/mypageApi/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ performanceIds: selectedIds })
		});

		if (!response.ok) throw new Error('Network response was not ok');

		const data = await response.json();

		if (data.success) {
			selectedIds.forEach(id => {
				const item = document.querySelector(`[data-performance-id="${id}"]`);
				if (item) {
					item.remove();
				}
			});

			updateSelectAllCheckbox();
			updateDeleteButtonState();

			if (document.querySelectorAll('.wishlist-item').length === 0) {
				showEmptyState();
			}

			// 성공 모달 표시
			showAlert('찜 목록에서 선택한 공연이 삭제되었습니다.', 'success', 2000);
		} else {
			throw new Error('Delete operation failed');
		}
	} catch (error) {
		console.error('Error deleting items:', error);
		// 에러 모달 표시
		showAlert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.', 'error', 2000);
	}
}

function showEmptyState() {
	const grid = document.getElementById('wishlistGrid');
	grid.innerHTML = `
        <div class="no-data-message">
            <div class="empty-state">
                <div class="empty-icon">🎭</div>
                <h3>찜한 공연이 없습니다</h3>
                <p>관심있는 공연을 찜해보세요!</p>
                <button class="suggestion-btn" onclick="location.href='/performance/list'">
                    공연 둘러보기
                </button>
            </div>
        </div>
    `;
}

function showErrorState() {
	const grid = document.getElementById('wishlistGrid');
	grid.innerHTML = `
        <div class="no-data-message">
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>데이터를 불러오는 중 오류가 발생했습니다</h3>
                <p>잠시 후 다시 시도해주세요</p>
                <button class="suggestion-btn" onclick="location.reload()">
                    새로고침
                </button>
            </div>
        </div>
    `;
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

// 초기화 및 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
	initializeCheckboxes();

	// 스크롤 이벤트 리스너 추가
	const handleScroll = throttle(() => {
		if (isLoading || !hasMoreData) return;

		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		if (scrollTop + clientHeight >= scrollHeight - 300) {
			loadWishlist();
		}
	}, 150);

	window.addEventListener('scroll', handleScroll, { passive: true });

	// 첫 데이터 로드는 약간의 지연을 주어 실행
	setTimeout(() => {
		if (!initialLoadComplete) {
			loadWishlist();
		}
	}, 100);

	// 클린업
	window.addEventListener('unload', () => {
		window.removeEventListener('scroll', handleScroll);
	});
});