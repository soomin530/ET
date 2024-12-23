// 쿠키 값 가져오기
const getCookie = (key) => {

	const cookies = document.cookie; // "K=V; K=V; ... "

	const cookieList = cookies.split("; ") // ["K=V", "K=V"...]
		.map(el => el.split("=")); // ["K", "V"]...


	const obj = {}; // 비어있는 객체 선언

	for (let i = 0; i < cookieList.length; i++) {
		const k = cookieList[i][0]; // key 값
		const v = cookieList[i][1]; // value 값
		obj[k] = v;
	}

	return obj[key]; // 매개변수로 전달받은 key와

}

const testFinal = document.querySelector("#testFinal");
testFinal.addEventListener("click", () => {
    // 실제 이동
    location.href = "/book/fetch-and-save";
});


const perform = document.querySelector("#perform");
perform.addEventListener("click", () => {
    // 실제 이동
    location.href = "/book/perform-and-save";
});

// 장르별 퀵 엑세스의 해당 장르 클릭시 페이지 이동
const genreCard = document.querySelectorAll(".genre-card");
const form = document.getElementById("postForm");
const categoryInput = document.getElementById("categoryInput");

genreCard.forEach(row => {
    row.addEventListener("click", e => {
        const category = e.target.innerText;
        categoryInput.value = category; // 선택된 카테고리를 폼 데이터에 설정
        form.submit(); // POST 요청으로 페이지 이동
    });
});


// .bookInfo 클래스를 가진 모든 DOM 요소를 선택
const bookInfoRows = document.querySelectorAll('.book-card');

// 선택된 요소들에 대해 반복 처리
bookInfoRows.forEach(row => {
	// 각 row에 클릭 이벤트 리스너 추가
	row.addEventListener('click', () => {
		const modal = new bootstrap.Modal(document.getElementById('bookDetailModal'));

		// 아래부터 row 클릭된 요소의 데이터를 가져와 세팅작업 진행

		// tr 요소에서 필요한 데이터 가져오기 (data-attributes 사용)
		const bookId = row.getAttribute('data-bookId');
		const bookTitle = row.getAttribute('data-title');
		const bookCover = row.getAttribute('data-coverUrl');
		const bookAuthor = row.getAttribute('data-author');
		const bookRating = row.getAttribute('data-rating');
		const bookGenres = row.getAttribute('data-genres');
		const bookDescription = row.getAttribute('data-description');
		const reviewCount = row.getAttribute('data-reviewCount');
		const steamCount = row.getAttribute('data-steamCount');


		// 모달 내 요소 업데이트
		document.querySelector('.book-detail-title').innerHTML = bookTitle;
		document.querySelector('.book-detail-cover').src = bookCover;
		document.querySelector('.book-detail-author').innerHTML = bookAuthor;
		document.querySelector('.book-detail-stats .stat-item:first-child span').textContent = bookRating;
		document.querySelector('.book-detail-stats .stat-item:nth-child(2) span').textContent = reviewCount;
		document.querySelector('.book-detail-stats .stat-item:last-child span').textContent = steamCount;
		document.querySelector('.avgScore').textContent = "평균 " + bookRating + " : 10.0";
		document.querySelector('.reviewCount').textContent = "총 " + reviewCount + "개의 리뷰";

		// bookId 저장
		document.querySelector('#selectBookId').value = bookId;

		// 장르 업데이트
		const genreContainer = document.querySelector('.book-detail-genres');
		genreContainer.innerHTML = ''; // 기존 장르 제거
		bookGenres.split(',').forEach(genre => {

			// 태그 생성 및 class, text입히기
			const genreBadge = document.createElement('span');
			genreBadge.className = 'badge bg-primary me-2';
			genreBadge.textContent = genre;

			// 장르 태그 안에 자식으로 추가
			genreContainer.appendChild(genreBadge);
		});

		// 책 소개 업데이트
		document.querySelector('.book-synopsis-text').innerHTML = bookDescription;

		// 모달 보여주기
		modal.show();

		// 댓글 조회 비동기 함수
		selectReviewList(bookId);
	});

});

// 댓글 리뷰 목록 조회
function selectReviewList(bookId) {

	// 기존 html 비우기
	document.querySelector(".review-list").innerHTML = '';

	// 댓글 목록 비동기 get 방식 조회
	fetch(`/book/selectReviewList?bookId=${bookId}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	})
		.then(resp => resp.json())
		.then(result => {

			// 조회되는 댓글 목록이 있을때
			if (result.length > 0) {
				result.forEach(({ MEMBER_NO, MEMBER_NICKNAME, COMMENT, STAR_POINT, WRITE_DATE, PROFILE_IMG }) => {
					// 별점은 따로 불러오기
					const starHTML = getStarHTML(STAR_POINT);
					let memberNo = "";

					if (loginMember != null) {
						memberNo = loginMember.memberNo;
					}
					
					if(PROFILE_IMG == null || PROFILE_IMG == 'undefined') {
						PROFILE_IMG = userDefaultIamge;
					}

					const reviewHTML = `
						<div class="review-item">
							<div class="review-header d-flex justify-content-between align-items-center mb-2">
								<div class="reviewer-info d-flex align-items-center">
									<img src="${PROFILE_IMG}" alt="User" class="reviewer-avatar">
									<div class="ms-2">
										<div class="reviewer-name">${MEMBER_NICKNAME}</div>
										<div class="review-date text-muted">${WRITE_DATE}</div>
									</div>
								</div>
								<div class="review-actions">
									<div class="review-rating mb-1">
										${starHTML}
									</div>
								</div>
							</div>
							<p class="review-text mb-2">${COMMENT}</p>
							<div class="review-buttons" ${memberNo === MEMBER_NO ? "" : "style='display:none;'"}> 
								<button class="btn btn-sm btn-primary me-2 edit-btn" data-action="edit">수정</button>
								<button class="btn btn-sm btn-danger" data-action="delete">삭제</button>
							</div>
						</div>
		            `;

					// html 안에 대입
					document.querySelector(".review-list").innerHTML += reviewHTML;
				});

			} else {

				// 댓글이 없을때
				const reviewHTML = `
					<div class="review-item">
						<p class="review-text mb-2">작성된 리뷰가 없습니다.</p>
					</div>
	            `;

				document.querySelector(".review-list").innerHTML += reviewHTML;
			}

		})

}

// 별개수 생성 html
function getStarHTML(starPoint) {
	let starPointHTML = '';

	// 별1개 짜리 생성
	for (let i = 1; i <= starPoint / 2; i++) {
		starPointHTML += `<i class="fas fa-star text-warning"></i>`;
	}

	// 별 반개짜리 생성
	if (starPoint % 2 != 0) {
		starPointHTML += `<i class="fas fa-star-half-alt text-warning"></i>`;
	}

	// 총 점수
	starPointHTML += `&nbsp;<span>${starPoint}점</span>`;

	return starPointHTML;
}