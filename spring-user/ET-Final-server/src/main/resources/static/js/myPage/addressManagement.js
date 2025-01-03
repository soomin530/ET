function adsExecDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = '';
            
            if (data.userSelectedType === 'R') {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('adsPostcode').value = data.zonecode;
            document.getElementById("adsAddress").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("adsDetailAddress").focus();
        }
    }).open();
}

// 주소 검색 버튼 클릭 시 이벤트 리스너 등록
const adsSearchAddress = document.querySelector("#adsSearchAddress");
if(adsSearchAddress) {
	adsSearchAddress.addEventListener("click", adsExecDaumPostcode);
}

document.addEventListener('DOMContentLoaded', function () {
	loadAddressList();
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

		// 중복 요청 방지용 버튼 비활성화
    const submitButton = document.getElementById('adsSubmitBtn');
    submitButton.disabled = true;

		// 폼 데이터 수집
		const formData = {
				receiverName: document.getElementById('receiverName').value,
				postcode: document.getElementById('adsPostcode').value,
				address: document.getElementById('adsAddress').value,
				detailAddress: document.getElementById('adsDetailAddress').value,
				phone: document.getElementById('adsPhone').value,
				extraPhone: document.getElementById('adsExtraPhone').value,
				basicAddress: 'N',
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
						loadAddressList(); // 목록 새로고침
            adsModal.classList.remove('show');
            addressForm.reset();

						// address-list에 추가
						const addressItem = document.createElement('div');
						addressItem.className = 'address-item';
						addressItem.innerHTML = `
								<p><strong>${formData.receiverName}</strong></p>
								<p>${formData.address} ${formData.detailAddress} (${formData.postcode})</p>
								<p>${formData.phone}${formData.extraPhone ? ` / ${formData.extraPhone}` : ''}</p>
						`;
						addressList.appendChild(addressItem);

						// // 모달 닫기 및 폼 초기화
						// adsModal.classList.remove('show');
						// addressForm.reset();

				} else {
					alert(result);
					// throw new Error(result);
				}
		} catch (error) {
				console.error(error);
				alert('배송지 등록 중 오류가 발생했습니다.');
		} finally {
			submitButton.disabled = false; // 버튼 활성화
		}

});

});




// 주소 목록 로드 함수
async function loadAddressList() {
	try {
			const response = await fetch('/mypage/addressList');
			if (!response.ok) {
					throw new Error('주소 목록을 불러오는데 실패했습니다.');
			}

			const addressList = await response.json();
			displayAddressList(addressList);

	} catch (error) {
			console.error('Error:', error);
			alert('주소 목록을 불러오는데 실패했습니다.');
	}
}



// 주소 목록 화면에 표시 함수
function displayAddressList(addresses) {
	const addressListContainer = document.querySelector('.address-list');
	addressListContainer.innerHTML = '';

	if (addresses.length === 0) {
			addressListContainer.innerHTML = '<p class="no-address">등록된 배송지가 없습니다.</p>';
			return;
	}

	addresses.forEach(address => {
			const addressItem = document.createElement('div');
			addressItem.className = 'address-item';
			
			addressItem.innerHTML = `
					<div class="address-info">
							<div class="address-header">
									<p class="receiver">
											<strong>${address.receiverName}</strong>
											${address.basicAddress === 'Y' 
													? '<span class="default-badge">기본 배송지</span>' 
													: ''}
									</p>
									<button class="set-default-btn" 
													${address.basicAddress === 'Y' ? 'disabled' : ''}
													data-address-no="${address.addressNo}">
											기본 배송지로 설정
									</button>
							</div>
							<p class="address-detail">
									[${address.postcode}]
									${address.address} ${address.detailAddress}
							</p>
							<p class="phone">
									${address.phone}
									${address.extraPhone ? `<br>${address.extraPhone}` : ''}
							</p>
					</div>
			`;

			// 기본 배송지 설정 버튼 이벤트 리스너
			const setDefaultBtn = addressItem.querySelector('.set-default-btn');
			if (setDefaultBtn && address.basicAddress !== 'Y') {
					setDefaultBtn.addEventListener('click', async () => {
							try {
									const response = await fetch('/mypage/basicAddress', {
											method: 'POST',
											headers: {
													'Content-Type': 'application/x-www-form-urlencoded',
											},
											body: `addressNo=${address.addressNo}`
									});

									if (response.ok) {
											alert('기본 배송지가 변경되었습니다.');
											loadAddressList(); // 목록 새로고침
									} else {
											const errorText = await response.text();
											console.error('Error:', errorText);
                      alert('기본 배송지 변경에 실패했습니다.');
									}
							} catch (error) {
									console.error('Error:', error);
									alert('기본 배송지 변경에 실패했습니다.');
							}
					});
			}

			addressListContainer.appendChild(addressItem);
	});
}









// // 배송지 추가 전 개수 체크
// addressForm.addEventListener('submit', async function (e) {
// 	e.preventDefault();

// 	// 폼 데이터 수집
// 	const formData = {
// 			receiverName: document.getElementById('receiverName').value,
// 			postcode: document.getElementById('adsPostcode').value,
// 			address: document.getElementById('adsAddress').value,
// 			detailAddress: document.getElementById('adsDetailAddress').value,
// 			phone: document.getElementById('adsPhone').value,
// 			extraPhone: document.getElementById('adsExtraPhone').value,
// 			basicAddress: 'N'  // 기본값은 'N'으로 설정
// 	};

// 	try {
// 			const response = await fetch('/mypage/addAddress', {
// 					method: 'POST',
// 					headers: {
// 							'Content-Type': 'application/json',
// 					},
// 					body: JSON.stringify(formData),
// 			});

// 			const result = await response.text();
// 			if (response.ok) {
// 					alert(result);
// 					loadAddressList();
// 					adsModal.classList.remove('show');
// 					addressForm.reset();
// 			} else {
// 					alert(result);
// 			}
// 	} catch (error) {
// 			console.error('Error:', error);
// 			alert('배송지 등록에 실패했습니다.');
// 	}
// });


// // 새 배송지 추가 후 목록 새로고침
// // 기존 submit 이벤트 리스너 내부의 성공 처리 부분에 추가
// addressForm.addEventListener('submit', async function (e) {
// 	// ... 기존 코드 ...
	
// 	if (response.ok) {
// 			alert(result);
// 			loadAddressList(); // 목록 새로고침
// 			adsModal.classList.remove('show');
// 			addressForm.reset();
// 	}
// 	// ... 기존 코드 ...
// });











	
	