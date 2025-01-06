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
							window.location.href = '/perfmgr/performance-list'; // 목록 페이지로 이동
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
