// 캐러셀 클래스 추가
class Carousel {
	constructor() {
		this.carousel = document.querySelector('.custom-carousel');
		this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
		this.totalSlides = this.slides.length;
		this.currentSlide = 0;
		this.autoPlayInterval = null;
		this.performanceTitle = document.querySelector('.current-performance');
		this.titles = this.slides.map(slide => slide.dataset.title);
		this.detailLinks = Array.from(this.carousel.querySelectorAll('[data-link]'))
			.map(el => el.dataset.link);
		this.detailButton = this.carousel.querySelector('.carousel-btn');

		this.initializeCarousel();
		this.addEventListeners();
		this.startAutoPlay();
	}

	initializeCarousel() {
		// 인디케이터 생성
		const indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
		indicatorsContainer.innerHTML = ''; // 기존 인디케이터 초기화

		for (let i = 0; i < this.totalSlides; i++) {
			const indicator = document.createElement('div');
			indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
			indicator.addEventListener('click', () => this.goToSlide(i));
			indicatorsContainer.appendChild(indicator);
		}

		// 인디케이터 요소들을 저장
		this.indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
	}

	addEventListeners() {
		this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
		this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

		this.carousel.querySelector('.prev-arrow').addEventListener('click', () => {
			this.prevSlide();
			this.resetAutoPlay();
		});

		this.carousel.querySelector('.next-arrow').addEventListener('click', () => {
			this.nextSlide();
			this.resetAutoPlay();
		});
	}

	updateSlides() {
		const activeSlide = this.slides[this.currentSlide];
		document.querySelector('.carousel-slide.active').classList.remove('active');
		activeSlide.classList.add('active');

		this.performanceTitle.textContent = activeSlide.dataset.title;

		// href 속성 직접 변경
		this.detailButton.href = activeSlide.dataset.link;

		this.indicators.forEach((indicator, index) => {
			if (index === this.currentSlide) {
				indicator.classList.add('active');
			} else {
				indicator.classList.remove('active');
			}
		});
	}

	nextSlide() {
		this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
		this.updateSlides();
	}

	prevSlide() {
		this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
		this.updateSlides();
	}

	goToSlide(index) {
		this.currentSlide = index;
		this.updateSlides();
		this.resetAutoPlay();
	}

	startAutoPlay() {
		this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
	}

	stopAutoPlay() {
		if (this.autoPlayInterval) {
			clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = null;
		}
	}

	resetAutoPlay() {
		this.stopAutoPlay();
		this.startAutoPlay();
	}
}

document.addEventListener('DOMContentLoaded', function() {
	// 캐러셀 초기화
	new Carousel();

	// 차트 초기화
	const ctx = document.getElementById('concertChart').getContext('2d');
	new Chart(ctx, {
		type: 'bar',  // 바 차트
		data: {
			labels: ['연극', '서양음악(클래식)', '뮤지컬', '합계'],  // 카테고리
			datasets: [{
				label: '예매 수',
				data: [192932, 201572, 766050, 672742],  // 예매 수
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			}, {
				label: '취소 예매 수',
				data: [69216, 60655, 357941, 487812],  // 취소 예매 수
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				}
			}
		}
	});

});

const sections = document.querySelectorAll('.section');

const options = {
	root: null,
	rootMargin: '0px',
	threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
		} else {
			entry.target.classList.remove('visible');
		}
	});
}, options);

sections.forEach(section => {
	observer.observe(section);
});

function scrollToSection(sectionId) {
	const section = document.getElementById(sectionId);
	section.scrollIntoView({ behavior: 'smooth' });
}

// 공지사항 상세 정보 열기
function openNoticeDetail(element) {
	const noticeId = element.getAttribute('data-notice-id');

	// AJAX로 공지사항 상세 정보 가져오기
	fetch(`/notice/detail/${noticeId}`)
		.then(response => response.json())
		.then(data => {
			document.getElementById('modalNoticeTitle').textContent = data.announceTitle;
			document.getElementById('modalNoticeDate').textContent = data.announceWriteDate;
			document.getElementById('modalNoticeContent').innerHTML = data.announceContent;

			// 기존 모달 시스템 사용
			openModal('noticeDetailModal');
		})
		.catch(error => {
			console.error('Error:', error);
			alert('공지사항을 불러오는데 실패했습니다.');
		});
}

