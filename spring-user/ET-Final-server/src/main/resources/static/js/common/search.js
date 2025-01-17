class SearchHandler {
	constructor() {
		this.searchInput = document.getElementById('searchInput');
		this.searchButton = document.getElementById('searchButton');
		this.suggestionsContainer = document.getElementById('searchSuggestions');
		this.debounceTimer = null;

		this.initializeEventListeners();
	}

	initializeEventListeners() {
		// 입력 이벤트
		this.searchInput.addEventListener('input', () => {
			clearTimeout(this.debounceTimer);
			this.debounceTimer = setTimeout(() => {
				this.handleSearchInput();
			}, 300);
		});

		// 검색 버튼 클릭
		this.searchButton.addEventListener('click', () => {
			this.performSearch();
		});

		// Enter 키 입력
		this.searchInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				this.performSearch();
			}
		});

		// 검색창 외부 클릭시 자동완성 닫기
		document.addEventListener('click', (e) => {
			if (!this.searchInput.contains(e.target)) {
				this.suggestionsContainer.style.display = 'none';
			}
		});
	}

	async handleSearchInput() {
		const query = this.searchInput.value.trim();
		if (query.length < 2) {
			this.suggestionsContainer.style.display = 'none';
			return;
		}

		try {
			const response = await fetch(`/search/suggestions/${encodeURIComponent(query)}`);
			const suggestions = await response.json();
			this.displaySuggestions(suggestions);
		} catch (error) {
			console.error('Failed to fetch suggestions:', error);
		}
	}

	displaySuggestions(suggestions) {
		if (!suggestions.length) {
			this.suggestionsContainer.style.display = 'none';
			return;
		}

		this.suggestionsContainer.innerHTML = ''; // 기존 내용을 초기화

		// suggestions 배열을 순회하며 항목 생성
		suggestions.forEach(suggestion => {
			const div = document.createElement('div');
			div.className = 'suggestion-item';

			// title 키를 사용하여 텍스트 콘텐츠 설정
			div.textContent = suggestion.TITLE || 'Unknown Title';

			// 클릭 이벤트 설정
			div.addEventListener('click', () => {
				this.searchInput.value = suggestion.TITLE || 'Unknown Title';
				this.performSearch();
			});

			// 생성된 div를 컨테이너에 추가
			this.suggestionsContainer.appendChild(div);
		});

		this.suggestionsContainer.style.display = 'block'; // 컨테이너 표시
	}

	performSearch() {
		const query = this.searchInput.value.trim();
		if (query) {
			window.location.href = `/search/searchResult/${encodeURIComponent(query)}`;
		}
	}
}

// 검색 핸들러 초기화
document.addEventListener('DOMContentLoaded', () => {
	new SearchHandler();
});