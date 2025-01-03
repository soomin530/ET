// 다음주소 API 
function adsExecDaumPostcode() {
	const popup = new daum.Postcode({
			oncomplete: function(data) {
					// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

					// 각 주소의 노출 규칙에 따라 주소를 조합한다.
					// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
					var addr = ''; // 주소 변수

					//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
					if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
							addr = data.roadAddress;
					} else { // 사용자가 지번 주소를 선택했을 경우(J)
							addr = data.jibunAddress;
					}

					// 우편번호와 주소 정보를 해당 필드에 넣는다.
					document.getElementById('adsPostcode').value = data.zonecode;
					document.getElementById("adsAddress").value = addr;
					// 커서를 상세주소 필드로 이동한다.
					document.getElementById("adsDetailAddress").focus();
					
					// 팝업 자동으로 닫기
					popup.close();
			}
	}).open();
}

// 주소 검색 버튼 클릭 시 이벤트 리스너 등록
const adsSearchAddress = document.querySelector("#adsSearchAddress");
if(adsSearchAddress) {
	adsSearchAddress.addEventListener("click", adsExecDaumPostcode);
}

		  
document.addEventListener('DOMContentLoaded', function () {
	const adsModal = document.getElementById('adsModal');
	const addButton = document.querySelector('.add-button');
	const adsCancelBtn = document.getElementById('adsCancelBtn');
	const addressForm = document.getElementById('addressForm');
	const addressList = document.querySelector('.address-list');

	 // 새 배송지 추가 버튼 클릭 시 모달 열기
	 addButton.addEventListener('click', function () {
		adsModal.classList.add('show');
});

// 취소 버튼 클릭 시 모달 닫기
adsCancelBtn.addEventListener('click', function () {
		adsModal.classList.remove('show');
		addressForm.reset();
});

// 폼 제출 처리
addressForm.addEventListener('submit', async function (e) {
		e.preventDefault();

		// 폼 데이터 수집
		const formData = {
				receiverName: document.getElementById('receiverName').value,
				postcode: document.getElementById('adsPostcode').value,
				address: document.getElementById('adsAddress').value,
				detailAddress: document.getElementById('adsDetailAddress').value,
				phone: document.getElementById('adsPhone').value,
				extraPhone: document.getElementById('adsExtraPhone').value,
		};

		try {
				// 서버로 POST 요청 전송
				const response = await fetch('/mypage/addAddress', {
						method: 'POST',
						headers: {
								'Content-Type': 'application/json',
						},
						body: JSON.stringify(formData),
				});

				const result = await response.text();
				if (response.ok) {
						alert(result);

						// address-list에 추가
						const addressItem = document.createElement('div');
						addressItem.className = 'address-item';
						addressItem.innerHTML = `
								<p><strong>${formData.receiverName}</strong></p>
								<p>${formData.address} ${formData.detailAddress} (${formData.postcode})</p>
								<p>${formData.phone}${formData.extraPhone ? ` / ${formData.extraPhone}` : ''}</p>
						`;
						addressList.appendChild(addressItem);

						// 모달 닫기 및 폼 초기화
						adsModal.classList.remove('show');
						addressForm.reset();
				} else {
						throw new Error(result);
				}
		} catch (error) {
				console.error(error);
				alert('배송지 등록 중 오류가 발생했습니다.');
		}
});
});








// 			 // 폼 제출 시 주소 추가 및 페이지 이동
// 			 addressForm.addEventListener('submit', function (e) {
//         e.preventDefault();

//         const receiverName = document.getElementById('receiverName').value;
//         const postcode = document.getElementById('adsPostcode').value;
//         const address = document.getElementById('adsAddress').value;
//         const detailAddress = document.getElementById('adsDetailAddress').value;
//         const phone = document.getElementById('adsPhone').value;
				

//         // 주소 목록에 추가
//         const addressItem = document.createElement('div');
//         addressItem.className = 'address-item';
//         addressItem.innerHTML = `
//             <span>${receiverName}</span>
// 						<span>${postcode}</span>
//             <span>${address} ${detailAddress}</span>
//             <span>${phone}</span>
//         `;
//         addressList.appendChild(addressItem);

//         // 모달 닫기
//         adsModal.classList.remove('show');
//         addressForm.reset();

//         // 페이지 이동
//         window.location.href = '/mypage/addressManagement'; // 이동할 페이지 URL
//     });
// });		 







		   
	// 	// 주소 등록 폼 제출 처리
  //   addressForm.addEventListener('submit', async function(e) {
	// 		e.preventDefault();
			
	// 		// 폼 데이터 수집
	// 		const formData = {
	// 				receiverName: document.getElementById('receiverName').value,
	// 				postcode: document.getElementById('adsPostcode').value,
	// 				address: document.getElementById('adsAddress').value,
	// 				detailAddress: document.getElementById('adsDetailAddress').value,
	// 				phone: document.getElementById('adsPhone').value,
	// 				extraPhone: document.getElementById('adsExtraPhone').value
	// 		};

	// 		try {
	// 				const response = await fetch('/api/address/add', {
	// 						method: 'POST',
	// 						headers: {
	// 								'Content-Type': 'application/json',
	// 						},
	// 						body: JSON.stringify(formData)
	// 				});

	// 				if (response.ok) {
	// 						const result = await response.json();
	// 						// 모달 닫기
	// 						adsModal.classList.remove('show');
	// 						addressForm.reset();
							
	// 						// 주소 목록 새로고침
	// 						loadAddresses();
							
	// 						alert('배송지가 성공적으로 등록되었습니다.');
	// 				} else {
	// 						throw new Error('배송지 등록에 실패했습니다.');
	// 				}
	// 		} catch (error) {
	// 				alert(error.message);
	// 		}
	// });

// 	// 주소 목록 로드 함수
// 	async function loadAddresses() {
// 			try {
// 					const response = await fetch('/api/address/list');
// 					const addresses = await response.json();
					
// 					// 주소 목록 HTML 생성
// 					addressList.innerHTML = addresses.map(address => `
// 							<div class="address-item" data-id="${address.id}">
// 									<div class="checkbox-wrapper">
// 											<input type="checkbox" class="address-checkbox">
// 									</div>
// 									<div class="address-info">
// 											<p class="receiver-name">${address.receiverName}</p>
// 											<p class="address-full">${address.postcode} ${address.address} ${address.detailAddress}</p>
// 											<p class="phone">${address.phone}</p>
// 											${address.extraPhone ? `<p class="extra-phone">${address.extraPhone}</p>` : ''}
// 									</div>
// 									<div class="action-buttons" style="display: none;">
// 											<button class="edit-btn">수정</button>
// 											<button class="delete-btn">삭제</button>
// 									</div>
// 							</div>
// 					`).join('');

// 					// 체크박스 이벤트 처리
// 					setupCheckboxHandlers();
// 			} catch (error) {
// 					console.error('주소 목록 로드 실패:', error);
// 			}
// 	}

// 	// 체크박스 이벤트 핸들러 설정
// 	function setupCheckboxHandlers() {
// 			const checkboxes = document.querySelectorAll('.address-checkbox');
// 			checkboxes.forEach(checkbox => {
// 					checkbox.addEventListener('change', function() {
// 							// 다른 모든 체크박스 해제
// 							checkboxes.forEach(cb => {
// 									if (cb !== this) {
// 											cb.checked = false;
// 											cb.closest('.address-item').querySelector('.action-buttons').style.display = 'none';
// 									}
// 							});

// 							// 현재 체크박스의 액션 버튼 표시/숨김
// 							const actionButtons = this.closest('.address-item').querySelector('.action-buttons');
// 							actionButtons.style.display = this.checked ? 'flex' : 'none';
// 					});
// 			});

// 			// 수정/삭제 버튼 이벤트 처리
// 			setupActionButtonHandlers();
// 	}

// 	// 수정/삭제 버튼 이벤트 핸들러 설정
// 	function setupActionButtonHandlers() {
// 			// 수정 버튼 이벤트
// 			document.querySelectorAll('.edit-btn').forEach(btn => {
// 					btn.addEventListener('click', async function() {
// 							const addressItem = this.closest('.address-item');
// 							const addressId = addressItem.dataset.id;
// 							// 수정 로직 구현
// 							// TODO: 수정 모달 표시 및 처리
// 					});
// 			});

// 			// 삭제 버튼 이벤트
// 			document.querySelectorAll('.delete-btn').forEach(btn => {
// 					btn.addEventListener('click', async function() {
// 							const addressItem = this.closest('.address-item');
// 							const addressId = addressItem.dataset.id;
							
// 							if (confirm('이 배송지를 삭제하시겠습니까?')) {
// 									try {
// 											const response = await fetch(`/api/address/${addressId}`, {
// 													method: 'DELETE'
// 											});

// 											if (response.ok) {
// 													addressItem.remove();
// 											} else {
// 													throw new Error('배송지 삭제에 실패했습니다.');
// 											}
// 									} catch (error) {
// 											alert(error.message);
// 									}
// 							}
// 					});
// 			});
// 	}

// 	// 초기 주소 목록 로드
// 	loadAddresses();
// });