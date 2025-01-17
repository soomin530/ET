let currentPage = 1;
let totalPages = 1;
const itemsPerPage = 10;

// 페이지 로드 시 초기 데이터 로딩
document.addEventListener('DOMContentLoaded', function() {
	loadInquiries(1)
	initializeSideMenu();
});

// 문의 목록 로딩
function loadInquiries(page, searchType = '', keyword = '') {
	fetch(`/mypageApi/inquiryList?page=${page}&searchType=${searchType}&keyword=${keyword}`)
		.then(response => response.json())
		.then(data => {
			renderInquiries(data.inquiries);
			renderPagination(data.totalPages);
			currentPage = page;
			totalPages = data.totalPages;
		})
		.catch(error => {
			console.error('Error:', error);
			alert('문의 목록을 불러오는데 실패했습니다.');
		});
}

// 문의 목록 렌더링
function renderInquiries(inquiries) {
	const tbody = document.getElementById('inquiryTableBody');
	tbody.innerHTML = '';

	inquiries.forEach(inquiry => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
                    <td>${inquiry.inquiryNo}</td>
                    <td>
                        <a href="#" onclick="viewInquiryDetail(${inquiry.inquiryNo}); return false;">
                            ${inquiry.inquiryTitle}
                        </a>
                    </td>
                    <td>${formatDate(inquiry.inquiryDate)}</td>
                    <td>
                        <span class="inquiry-status ${inquiry.replyIs === 'Y' ? 'status-completed' : 'status-waiting'}">
                            ${inquiry.replyIs === 'Y' ? '답변완료' : '답변대기'}
                        </span>
                    </td>
                `;
		tbody.appendChild(tr);
	});
}

// 페이지네이션 렌더링
function renderPagination(totalPages) {
	const pagination = document.getElementById('pagination');
	pagination.innerHTML = '';

	// 이전 페이지 버튼
	if (currentPage > 1) {
		const prevButton = createPageButton(currentPage - 1, '이전');
		pagination.appendChild(prevButton);
	}

	// 페이지 번호 버튼들
	for (let i = 1; i <= totalPages; i++) {
		const pageButton = createPageButton(i, i.toString());
		if (i === currentPage) {
			pageButton.classList.add('active');
		}
		pagination.appendChild(pageButton);
	}

	// 다음 페이지 버튼
	if (currentPage < totalPages) {
		const nextButton = createPageButton(currentPage + 1, '다음');
		pagination.appendChild(nextButton);
	}
}

// 페이지 버튼 생성
function createPageButton(pageNum, text) {
	const button = document.createElement('button');
	button.textContent = text;
	button.onclick = () => loadInquiries(pageNum);
	return button;
}

// 검색 기능
function searchInquiries() {
	const searchType = document.getElementById('searchType').value;
	const keyword = document.getElementById('searchKeyword').value.trim();
	loadInquiries(1, searchType, keyword);
}

// 문의 상세보기
function viewInquiryDetail(inquiryNo) {
	window.location.href = `/mypageApi/inquiryDetail/${inquiryNo}`;
}

// 날짜 포맷팅
function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

// 쿠키 가져오는 함수
function getNaverCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

// 사이드 메뉴 초기화
function initializeSideMenu() {

	const pagesNeedingVerification = ['updateInfo','changePw','addressManagement','membershipOut'];

	const setActiveMenu = () => {
		const currentPath = window.location.pathname;
		document.querySelectorAll('.mypage-side-menu-link').forEach(link => {
			const targetPage = link.dataset.page;
			const isActive = currentPath.endsWith(`/${targetPage}`);

			link.classList.toggle('active', isActive);
		});
	};

	const initializeEventHandlers = () => {
		document.querySelectorAll('.mypage-side-menu-link').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetPage = e.target.dataset.page;

				// 쿠키에서 네이버 로그인 여부 확인
				const naverFl = getCookie('naverFl');

				// 네이버 로그인 사용자이거나, 비밀번호 검증이 필요없는 페이지인 경우 바로 이동
				if (naverFl === 'Y' || !pagesNeedingVerification.includes(targetPage)) {
					window.location.href = `/mypage/${targetPage}`;
					return;
				}

				// 그 외의 경우 비밀번호 검증 페이지로 이동
				sessionStorage.setItem('targetPage', targetPage);
				window.location.href = `/mypage/checkPw`;
			});
		});
	};

	setActiveMenu();
	initializeEventHandlers();
}