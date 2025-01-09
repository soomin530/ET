// 스크롤 버튼 관련 코드
const scrollToTopButton = document.getElementById('scrollToTop');

// 스크롤 버튼 이벤트 리스너 등록
scrollToTopButton.addEventListener('click', scrollToTop);
window.addEventListener('scroll', throttle(toggleScrollButton, 100), { passive: true }); 
																		// 이벤트가 발생했을 때 실행할 함수  // 이벤트 옵션(이벤트 핸들러가 기본 동작을 방해하지 않는다고 브라우저에 알려줌)

// 스크롤 버튼 표시/숨김 처리
// 스크롤 위치에 따라 버튼의 표시 여부를 결정하는 함수
// 스크롤 이벤트가 100ms 내에 여러 번 발생하더라도 toggleScrollButton 함수는 최대 한 번만 실행
function toggleScrollButton() { 
	if (window.scrollY > 300) { // 스크롤 위치가 300px(세로 거리) 이상이면
		scrollToTopButton.classList.add('visible'); // 버튼을 표시
	} else {
		scrollToTopButton.classList.remove('visible'); // 버튼 숨김
	}
}

// 최상단으로 스크롤
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

// 스로틀 함수
// 이벤트가 너무 자주 호출되는 것을 방지하여 성능 문제를 줄이는 데 사용
// throttle은 주어진 시간 간격(limit) 동안 함수를 한 번만 실행하도록 제한
// 스크롤 이벤트가 100ms 내에 여러 번 발생하더라도 toggleScrollButton 함수는 최대 한 번만 실행
function throttle(func, limit) {
	let inThrottle; 	// 스로틀 상태를 나타냄
	return function(...args) {
		if (!inThrottle) {
			func.apply(this, args); 	// 함수 실행
			inThrottle = true; 	// 실행 중 상태로 변경
			setTimeout(() => inThrottle = false, limit); // limit 시간 후 다시 실행 가능
		} 
	}
}

// 스크롤 이벤트 핸들러
const scrollHandler = throttle(() => {
	if (isLoading || !hasMoreData) return;
	// 데이터를 로드 중이거나 로드할 데이터가 더 이상 없는 경우 스크롤 작업을 중단
	// isLoading : 데이터 로드 중임을 나타내는 플래그. 데이터가 로드 중일 때 중복 요청을 방지
	// hasMoreData : 추가 데이터가 없으면 더 이상 요청하지 않음

	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	// 현재 문서의 스크롤된 세로 거리, 스크롤 가능한 전체 콘텐츠의 높이, 현재 보이는 화면 높이
	if (scrollTop + clientHeight >= scrollHeight - 300) {
	// 사용자가 페이지 하단으로부터 300px 이내로 스크롤했는지 확인하는 조건문
	// scrollTop + clientHeight: 현재 보이는 화면의 하단 위치
	// scrollHeight - 300: 문서의 전체 높이에서 300px을 뺀 위치
		loadMorePerformances();
	}
}, 150);

// 사용자 스크롤: 사용자가 페이지를 스크롤할 때마다 scroll 이벤트가 발생합니다.
// throttle 적용: scroll 이벤트 핸들러는 throttle을 통해 100ms마다 한 번씩만 실행됩니다. 이를 통해 과도한 함수 호출을 방지합니다.
// toggleScrollButton 함수는 현재 스크롤 위치를 확인하고 버튼의 표시 여부를 결정합니다.
// { passive: true } 옵션으로 기본 스크롤 동작을 방해하지 않고 브라우저의 성능을 최적화합니다.

// 현재 데이터 로드 중(isLoading)이거나 더 이상 로드할 데이터가 없음(!hasMoreData) 경우, 함수 실행을 중단합니다.

// 사용자의 현재 스크롤 위치와 뷰포트 높이를 더하여 화면의 아래쪽 끝 위치를 계산합니다.
// 문서의 전체 높이에서 300픽셀을 뺀 값과 비교하여, 사용자가 문서의 하단에서 300픽셀 이내로 스크롤했는지 확인합니다.

// 조건이 충족되면 loadMorePerformances() 함수를 호출하여 추가 데이터를 로드합니다.
// 이 과정에서 isLoading 플래그를 true로 설정하여 중복 요청을 방지하고, 데이터 로드가 완료되면 다시 false로 설정합니다.

function deletePerformance() {
	if (confirm('정말로 이 공연을 삭제하시겠습니까?')) {
			const mt20id = document.getElementById('mt20id').value;
			
			fetch(`/perfmgr/delete/${mt20id}`, {
					method: 'POST', 
					headers: {
							'Content-Type': 'application/json'
					},
					body: JSON.stringify({ performanceDelFl: 'Y' }) // 'PERFORMANCE_DEL_FL' 값을 'Y'로 업데이트
			})
			.then(response => {
					if (response.ok) {
							alert('공연이 성공적으로 삭제되었습니다.');
							window.location.href = '/perfmgr/perfmgr-list'; // 목록 페이지로 이동
					} else {
							alert('공연 삭제 중 오류가 발생했습니다.');
					}
			})
			.catch(error => {
					console.error('Error:', error);
					alert('공연 삭제 중 오류가 발생했습니다.');
			});
	}
}


