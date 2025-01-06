// 캐러셀 스타일
const carouselStyle = document.createElement('style');
carouselStyle.textContent = `
  .carousel-slide {
    transition: transform 0.3s ease-out;
    will-change: transform;
    transform: translateX(100%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    cursor: pointer;
  }

  .carousel-slide.active {
    transform: translateX(0);
  }

  .custom-carousel {
    position: relative;
    overflow: hidden;
  }

  .carousel-container {
    position: relative;
    height: 100%;
  }

  .carousel-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    width: 100%;
  }

  .carousel-indicators {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .indicator {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #ddd;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    padding: 0;
  }

  .indicator:hover {
    background-color: #999;
    transform: scale(1.2);
  }

  .indicator.active {
    background-color: #007bff;
    transform: scale(1.2);
  }
`;

document.head.appendChild(carouselStyle);

// 캐러셀 클래스
class Carousel {
	constructor() {
		this.initElements();
		this.initializeCarousel();
		this.addEventListeners();
		this.startAutoPlay();
	}

	initElements() {
		this.carousel = document.querySelector('.custom-carousel');
		this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
		this.totalSlides = this.slides.length;
		this.currentSlide = 0;
		this.autoPlayInterval = null;
		this.performanceTitle = document.querySelector('.current-performance');
	}

	initializeCarousel() {
		const indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
		indicatorsContainer.innerHTML = '';

		// DocumentFragment 사용하여 성능 최적화
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < this.totalSlides; i++) {
			const indicator = document.createElement('div');
			indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
			indicator.addEventListener('click', () => this.goToSlide(i));
			fragment.appendChild(indicator);
		}

		indicatorsContainer.appendChild(fragment);
		this.indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
	}

	addEventListeners() {
		// 마우스 이벤트
		this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
		this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

		// 네비게이션 버튼
		this.carousel.querySelector('.prev-arrow').addEventListener('click', (e) => {
			e.stopPropagation();
			this.prevSlide();
			this.resetAutoPlay();
		});

		this.carousel.querySelector('.next-arrow').addEventListener('click', (e) => {
			e.stopPropagation();
			this.nextSlide();
			this.resetAutoPlay();
		});
	}

	updateSlides() {
		const activeSlide = this.slides[this.currentSlide];
		const currentActive = document.querySelector('.carousel-slide.active');

		if (currentActive) {
			currentActive.classList.remove('active');
		}
		activeSlide.classList.add('active');
		this.performanceTitle.textContent = activeSlide.dataset.title;

		// 인디케이터 업데이트
		this.indicators.forEach((indicator, index) => {
			indicator.classList.toggle('active', index === this.currentSlide);
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
		if (!this.autoPlayInterval) {
			this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
		}
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

// 차트 클래스
class PerformanceChart {
	constructor() {
		this.initializeChart();
	}

	initializeChart() {
		const ctx = document.getElementById('concertChart').getContext('2d');
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['연극', '서양음악(클래식)', '뮤지컬', '합계'],
				datasets: [{
					label: '예매 수',
					data: [192932, 201572, 766050, 672742],
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1
				}, {
					label: '취소 예매 수',
					data: [69216, 60655, 357941, 487812],
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: { beginAtZero: true }
				},
				responsive: true,
				plugins: {
					legend: { position: 'top' }
				}
			}
		});
	}
}

// 섹션 관찰자 클래스
class SectionObserver {
	constructor() {
		this.sections = document.querySelectorAll('.section');
		this.initializeObserver();
	}

	initializeObserver() {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				entry.target.classList.toggle('visible', entry.isIntersecting);
			});
		}, options);

		this.sections.forEach(section => observer.observe(section));
	}
}

// 공지사항 클래스
class NoticeManager {
	static async openNoticeDetail(element) {
		try {
			const noticeId = element.getAttribute('data-notice-id');
			const data = await this.fetchNoticeData(noticeId);
			this.updateModalContent(data);
			openModal('noticeDetailModal');
		} catch (error) {
			console.error('Error:', error);
			alert('공지사항을 불러오는데 실패했습니다.');
		}
	}

	static async fetchNoticeData(noticeId) {
		const response = await fetch(`/notice/detail/${noticeId}`);
		return response.json();
	}

	static updateModalContent(data) {
		document.getElementById('modalNoticeTitle').textContent = data.announceTitle;
		document.getElementById('modalNoticeDate').textContent = data.announceWriteDate;
		document.getElementById('modalNoticeContent').innerHTML = data.announceContent;
	}
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
	new Carousel();
	new PerformanceChart();
	new SectionObserver();
});

// 유틸리티 함수
function scrollToSection(sectionId) {
	const section = document.getElementById(sectionId);
	section.scrollIntoView({ behavior: 'smooth' });
}

// 전역 함수 설정
window.openNoticeDetail = (element) => NoticeManager.openNoticeDetail(element);