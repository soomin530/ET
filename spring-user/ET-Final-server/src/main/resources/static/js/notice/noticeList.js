// 전역 변수 설정
let page = 1;
const limit = 10;
let isLoading = false;
let hasMore = true;
let searchQuery = '';
let searchType = 'all';

// 공지사항 토글 함수
function toggleNotice(noticeNo) {
    const noticeItem = document.querySelector(`#notice-content-${noticeNo}`).parentElement;
    const currentActive = document.querySelector('.notice-item.active');

    // 현재 활성화된 항목이 있고, 클릭한 항목과 다른 경우
    if (currentActive && currentActive !== noticeItem) {
        currentActive.classList.remove('active');
        // 부드러운 닫힘 애니메이션을 위한 timeout
        setTimeout(() => {
            currentActive.querySelector('.notice-content').style.maxHeight = '0px';
        }, 25);
    }

    // 클릭한 항목 토글
    noticeItem.classList.toggle('active');

    // 컨텐츠 높이 조정
    const content = noticeItem.querySelector('.notice-content');
    if (noticeItem.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        content.style.maxHeight = '0px';
    }
}

// 무한 스크롤 이벤트 리스너
window.addEventListener('scroll', () => {
    if (isLoading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreNotices();
    }
});

// 공지사항 추가 로딩 함수
async function loadMoreNotices() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    // 로딩 인디케이터 표시
    showLoadingIndicator();

    try {
        const response = await fetch(`/notice/api/load?page=${page}&limit=${limit}&searchQuery=${searchQuery}&searchType=${searchType}`);
        const data = await response.json();

        if (data.notices && data.notices.length > 0) {
            appendNotices(data.notices);
            page++;
        } else {
            hasMore = false;
        }

        if (data.notices.length < limit) {
            hasMore = false;
        }
    } catch (error) {
        console.error('공지사항 로딩 중 오류 발생:', error);
    } finally {
        isLoading = false;
        hideLoadingIndicator();
    }
}

// 로딩 인디케이터 표시/숨김 함수
function showLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator') || createLoadingIndicator();
    indicator.classList.add('show');
}

function hideLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) {
        indicator.classList.remove('show');
    }
}

function createLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator';
    indicator.innerHTML = '로딩 중...';
    document.querySelector('.notice-list').appendChild(indicator);
    return indicator;
}

// 공지사항 HTML 추가 함수
function appendNotices(notices) {
    const noticeList = document.querySelector('.notice-list');
    
    notices.forEach(notice => {
        const noticeElement = document.createElement('div');
        noticeElement.className = 'notice-item';
        noticeElement.innerHTML = `
            <div class="notice-header" onclick="toggleNotice(${notice.announceNo})">
                <div class="notice-info">
                    <span class="notice-badge">공지</span>
                    <span class="notice-subject">${notice.announceTitle}</span>
                </div>
                <div class="notice-meta">
                    <span class="notice-date">${notice.announceWriteDate}</span>
                    <div class="notice-arrow">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
            <div id="notice-content-${notice.announceNo}" class="notice-content">
                <div class="notice-content-inner">
                    <p>${notice.announceContent}</p>
                </div>
            </div>
        `;
        noticeList.appendChild(noticeElement);
    });
}

// 검색 기능 구현
const searchInput = document.getElementById('noticeSearchInput');
const searchTypeSelect = document.getElementById('noticeSearchType');
const searchButton = document.getElementById('noticeSearchButton');

// 검색 실행 함수
async function performSearch() {
    // 검색 초기화
    page = 1;
    hasMore = true;
    searchQuery = searchInput.value.trim();
    searchType = searchTypeSelect.value;
    
    // 기존 공지사항 목록 초기화
    const noticeList = document.querySelector('.notice-list');
    noticeList.innerHTML = '';
    
    // 새로운 검색 결과 로드
    await loadMoreNotices();
}

// 검색 버튼 클릭 이벤트
searchButton.addEventListener('click', performSearch);

// 검색어 입력 후 엔터 키 이벤트
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 페이지 로드 시 초기 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
    // 페이지 처음 로드시에는 기존 데이터가 서버사이드에서 렌더링되므로,
    // 추가 로드를 위한 page 값만 설정
    const initialNotices = document.querySelectorAll('.notice-item');
    if (initialNotices.length > 0) {
        page = Math.ceil(initialNotices.length / limit) + 1;
    }

    // 첫 번째 공지사항 자동 오픈은 선택적
    /*
    const firstNotice = document.querySelector('.notice-item');
    if (firstNotice) {
        const noticeNo = firstNotice.querySelector('.notice-content').id.split('-')[2];
        toggleNotice(noticeNo);
    }
    */
});