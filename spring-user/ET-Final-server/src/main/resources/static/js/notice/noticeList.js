function toggleNotice(noticeNo) {
    const noticeItem = document.querySelector(`#notice-content-${noticeNo}`).parentElement;
    const currentActive = document.querySelector('.notice-item.active');
    
    // 현재 활성화된 항목이 있고, 클릭한 항목과 다른 경우
    if (currentActive && currentActive !== noticeItem) {
        currentActive.classList.remove('active');
        // 부드러운 닫힘 애니메이션을 위한 timeout
        setTimeout(() => {
            currentActive.querySelector('.notice-content').style.maxHeight = '0px';
        }, 10);
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

// 페이지 로드 시 첫 번째 공지사항 자동 오픈 (선택사항)
document.addEventListener('DOMContentLoaded', function() {
    // 첫 번째 공지사항 자동 오픈은 선택적
    /*
    const firstNotice = document.querySelector('.notice-item');
    if (firstNotice) {
        const noticeNo = firstNotice.querySelector('.notice-content').id.split('-')[2];
        toggleNotice(noticeNo);
    }
    */
});