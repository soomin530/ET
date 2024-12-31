/**
 * 카카오맵 초기화
 */
function initializeKakaoMap() {
	const fcltla = document.getElementById('fcltla').value;
	const fcltlo = document.getElementById('fcltlo').value;

	const mapContainer = document.getElementById('map');
	const mapOption = {
		center: new kakao.maps.LatLng(fcltla, fcltlo),
		level: 3
	};

	const map = new kakao.maps.Map(mapContainer, mapOption);
	const marker = new kakao.maps.Marker({
		position: map.getCenter()
	});
	marker.setMap(map);

	kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
		const latlng = mouseEvent.latLng;
		marker.setPosition(latlng);

		const message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ' +
			'경도는 ' + latlng.getLng() + ' 입니다';

		const resultDiv = document.getElementById('clickLatlng');
		if (resultDiv) {
			resultDiv.innerHTML = message;
		}
	});
}

/**
 * 리뷰 관련 기능 초기화
 */
function initializeReviews() {
	const mt20id = performanceData.id;
	const currentMemberNo = document.getElementById('currentMemberNo')?.value;
	
	function loadReviews() {
		$.get(`/performance/review/list/${mt20id}`, function(reviews) {
			const reviewList = $('#reviewList');
			reviewList.empty();
			
			console.log(reviews);

			if (reviews.length === 0) {
				reviewList.html(`
                    <div class="no-review">
                        <p>첫 번째 리뷰를 작성해보세요!</p>
                    </div>
                `);
				return;
			}

			reviews.forEach(review => {
				const stars = '★'.repeat(review.reviewStar) + '☆'.repeat(5 - review.reviewStar);
				const reviewHtml = `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="reviewer-info">
                                <span class="reviewer-name">${review.memberNickname}</span>
                                <span class="review-date">${new Date(review.createDate).toLocaleDateString()}</span>
                            </div>
                            <div class="review-stars">${stars}</div>
                        </div>
                        <div class="review-content">
                            ${review.reviewContent}
                        </div>
                        ${Number(review.memberNo) === Number(currentMemberNo) ? `
                            <div class="review-actions">
                                <button class="review-action-btn edit-review" data-review-no="${review.reviewNo}">수정</button>
                                <button class="review-action-btn delete-review" data-review-no="${review.reviewNo}">삭제</button>
                            </div>
                        ` : ''}
                    </div>
                `;
				reviewList.append(reviewHtml);
			});
		});
	}

	// 리뷰 등록
	$('#submitReview').click(function() {
		if (!currentMemberNo) {
			alert('로그인 후 이용해주세요.');
			return;
		}

		if (!$('input[name="rating"]:checked').val()) {
			alert('별점을 선택해주세요.');
			return;
		}

		if (!$('#reviewContent').val().trim()) {
			alert('리뷰 내용을 입력해주세요.');
			return;
		}

		const reviewData = {
			mt20id: mt20id,
			reviewStar: $('input[name="rating"]:checked').val(),
			reviewContent: $('#reviewContent').val()
		};

		$.ajax({
			url: '/performance/review/insert',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(reviewData),
			success: function(response) {
				if (response.success) {
					alert('리뷰가 등록되었습니다.');
					$('#reviewContent').val('');
					$('input[name="rating"]').prop('checked', false);
					loadReviews();
				} else {
					alert(response.message);
				}
			},
			error: function() {
				alert('리뷰 등록에 실패했습니다.');
			}
		});
	});

	// 리뷰 수정
	$(document).on('click', '.edit-review', function() {
		const reviewNo = $(this).data('review-no');
		const reviewItem = $(this).closest('.review-item');
		const content = reviewItem.find('.review-content').text().trim();

		reviewItem.find('.review-content').html(`
	           <textarea class="edit-content">${content}</textarea>
	           <div class="edit-actions">
	               <button class="review-action-btn save-edit" data-review-no="${reviewNo}">저장</button>
	               <button class="review-action-btn cancel-edit">취소</button>
	           </div>
	       `);
	});

	// 리뷰 수정 취소
	$(document).on('click', '.cancel-edit', function() {
		loadReviews();
	});

	// 리뷰 수정 저장
	$(document).on('click', '.save-edit', function() {
		const reviewNo = $(this).data('review-no');
		const newContent = $(this).closest('.review-item').find('.edit-content').val();

		if (!newContent.trim()) {
			alert('리뷰 내용을 입력해주세요.');
			return;
		}

		$.ajax({
			url: '/performance/review/update',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				reviewNo: reviewNo,
				reviewContent: newContent
			}),
			success: function(response) {
				if (response.success) {
					alert('리뷰가 수정되었습니다.');
					loadReviews();
				} else {
					alert(response.message);
				}
			},
			error: function() {
				alert('리뷰 수정 중 오류가 발생했습니다.');
			}
		});
	});

	// 리뷰 삭제
	$(document).on('click', '.delete-review', function() {
		if (!confirm('리뷰를 삭제하시겠습니까?')) return;

		const reviewNo = $(this).data('review-no');

		$.ajax({
			url: `/performance/review/delete/${reviewNo}`,
			type: 'POST',
			success: function(response) {
				if (response.success) {
					alert('리뷰가 삭제되었습니다.');
					loadReviews();
				} else {
					alert(response.message);
				}
			},
			error: function() {
				alert('리뷰 삭제 중 오류가 발생했습니다.');
			}
		});
	});

	// 초기 리뷰 로드
	loadReviews();
}

/**
* 페이지 초기화
*/
function initialize() {
	initializeKakaoMap();
	window.calendarInstance = new Calendar();
	initializeReviews();
}

// DOM 로드 완료 시 초기화
window.addEventListener('DOMContentLoaded', initialize);

// 기존의 예매 버튼 클릭 이벤트를 수정
document.getElementById("booking-btn").onclick = function () {
  const calendar = window.calendarInstance;
  if (calendar.selectedDate && calendar.selectedTime) {
		
    // mt20id 값 가져오기
    const mt20id = document.getElementById("mt20id")?.value;
    const selectedDate = calendar
      .formatDisplayDate(calendar.selectedDate)
      .replace(/\./g, "-"); // YYYY-MM-DD로 변환
    const selectedTime = calendar.selectedTime;

    if (!mt20id || !selectedDate || !selectedTime) {
      console.error("필수 파라미터가 누락되었습니다:", {
        mt20id,
        selectedDate,
        selectedTime,
      });
      alert("필수 정보가 누락되었습니다. 다시 선택해주세요.");
      return;
    }

    const url = `/payment/seat-selection?mt20id=${mt20id}&selectedDate=${selectedDate}&selectedTime=${selectedTime}`;

    const width = 1200; // 창 너비
    const height = 800; // 창 높이
    // 화면 중앙 좌표 계산
    const left = window.innerWidth / 2 - width / 2 + window.screenX;
    const top = window.innerHeight / 2 - height / 2 + window.screenY;

    // URL 확인
    console.log("요청 URL:", url);

    // 새 창 열기
    const newWindow = window.open(
      url, // Spring Controller에서 처리 가능한 URL
      "예매창", // 새 창 이름
      `width=${width}, height=${height}, top=${top}, left=${left}, resizable=yes, scrollbars=yes`
    );
    // 새 창 크기 강제로 고정
    if (newWindow) {
      // 새 창 크기 강제 설정
      newWindow.addEventListener("resize", function () {
        newWindow.resizeTo(width, height);
      });
    } else {
      alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.");
    }

    // Spring Controller 응답 확인
    fetch(url)
      .then((response) => {
        console.log("응답 상태:", response.status);
        if (!response.ok) {
          throw new Error("서버에서 실패 응답을 받았습니다.");
        }
        return response.text(); // HTML 응답 받기
      })
      .then((html) => console.log("서버 응답 HTML:", html))
      .catch((error) => console.error("새 창 요청 실패:", error));
  }
};

