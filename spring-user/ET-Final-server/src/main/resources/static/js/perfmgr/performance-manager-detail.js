function deletePerformance() {
	if (confirm('정말로 이 공연을 삭제하시겠습니까?')) {
			const mt20id = document.getElementById('mt20id').value;
			
			fetch(`/performanceApi/delete/${mt20id}`, {
					method: 'DELETE',
			})
			.then(response => {
					if (response.ok) {
							alert('공연이 성공적으로 삭제되었습니다.');
							window.location.href = '/performance/list'; // 목록 페이지로 이동
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