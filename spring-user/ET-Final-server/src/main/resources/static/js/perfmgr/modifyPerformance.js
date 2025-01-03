function modifyPerformance() {
  const form = document.getElementById('performanceForm');  
  const formData = new FormData(form);

  fetch('/perfmgr/performance-manager-detail', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      alert("수정된 내용으로 등록되었습니다");
      window.location.href = '/perfmgr/performance-manager-detail';
  })
  .catch(error => {
      console.error('Error:', error);
      alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
  });
}