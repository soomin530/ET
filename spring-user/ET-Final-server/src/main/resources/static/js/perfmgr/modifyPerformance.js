function cancelPerformance(mt20id) {
    alert("수정이 취소되었습니다.");
    window.location.href = `/perfmgr/performance-manager-detail/${mt20id}`;
}


function modifyPerformance() { // 등록 버튼 눌렀을 때

  // 필수 입력 필드
  const prfnm = document.querySelector('.performance-title input').value.trim();
  const runtime = document.querySelector('.performance-runtime input').value.trim();
  const cast = document.querySelector('.performance-actor input').value.trim();

  // 빈 값 체크
  if (!prfnm) {
      alert("공연명을 입력해주세요.");
      document.querySelector('.performance-title input').focus();
      return false;
  }

  if (!runtime) {
      alert("공연시간을 입력해주세요.");
      document.querySelector('.performance-runtime input').focus();
      return false;
  }

  if (!cast) {
      alert("출연진을 입력해주세요.");
      document.querySelector('.performance-actor input').focus();
      return false;
  }

  const mt20id = document.getElementById('mt20id').value;
  
  // JSON 데이터 구성
  const performanceData = {
      mt20id: mt20id,
      prfnm: prfnm,
      prfruntime: runtime,
      prfcast: cast
  };

  fetch(`/perfmgr/performance-modifyPerformance/${mt20id}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(performanceData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      alert("수정된 내용으로 등록되었습니다");
      window.location.href = `/perfmgr/performance-manager-detail/${mt20id}`;
  })
  .catch(error => {
      console.error('Error:', error);
      alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
  });
  
  return false;  // 폼 기본 제출 방지
}