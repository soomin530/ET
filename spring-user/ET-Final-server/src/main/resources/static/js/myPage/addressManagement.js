// 주소 검색 버튼 클릭 시 API 다음 검색창
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


// *********************************************************************************


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




/* 전화번호(휴대폰번호) 유효성 검사 (문제 시 삭제) */ 

const phoneCheckObj = {

	adsPhone: true,          // 전화번호 유효성 (초기값 true로 변경)
	adsExtraPhone: true,

	editPhone: true,
	editExtraPhone: true

};

// 핸드폰 번호
const adsPhone = document.querySelector("#adsPhone");
const adsPhoneMessage = document.querySelector("#adsPhoneMessage");

adsPhone.addEventListener("input", e => {

	const inputPhone = e.target.value;

	if (inputPhone.trim().length > 0) {
		phoneCheckObj.adsPhone = false; // 검증 필요함을 표시

	const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

	if (!regExp.test(inputPhone)) {
		adsPhoneMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
		adsPhoneMessage.classList.add("error");
		adsPhoneMessage.classList.remove("confirm");
		phoneCheckObj.adsPhone = false;
		return;
	}

	adsPhoneMessage.innerText = "유효한 전화번호 형식입니다.";
	adsPhoneMessage.classList.add("confirm");
	adsPhoneMessage.classList.remove("error");
	phoneCheckObj.adsPhone = true;
  } else {

		// 전화번호 입력값이 없는 경우 메시지 초기화 및 유효성 true로 설정
		adsPhoneMessage.innerText = "";
		phoneCheckObj.adsPhone = true;

	}

});

// 추가 연락처
const adsExtraPhone = document.querySelector("#adsExtraPhone");
const adsExtraPhoneMessage = document.querySelector("#adsExtraPhoneMessage");

adsExtraPhone.addEventListener("input", e => {

	const inputPhone = e.target.value;

	if (inputPhone.trim().length > 0) {
		phoneCheckObj.adsExtraPhone = false; // 검증 필요함을 표시

	const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

	if (!regExp.test(inputPhone)) {
		adsExtraPhoneMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
		adsExtraPhoneMessage.classList.add("error");
		adsExtraPhoneMessage.classList.remove("confirm");
		phoneCheckObj.adsExtraPhone = false;
		return;
	}

	adsExtraPhoneMessage.innerText = "유효한 전화번호 형식입니다.";
	adsExtraPhoneMessage.classList.add("confirm");
	adsExtraPhoneMessage.classList.remove("error");
	phoneCheckObj.adsExtraPhone = true;
  } else {

		// 전화번호 입력값이 없는 경우 메시지 초기화 및 유효성 true로 설정
		adsExtraPhoneMessage.innerText = "";
		phoneCheckObj.adsExtraPhone = true;

	}

});


// 폼 제출 처리
addressForm.addEventListener('submit', async function (e) {
		e.preventDefault();

		// 0108 문제 시 삭제
		// 변경된 값이 있는지 확인
		const phoneData = {};
		let addressIsModified = false;

		// 휴대폰 번호
		const phoneValue = document.getElementById("adsPhone").value.trim();
		if (phoneValue && phoneCheckObj.adsPhone) {
			phoneData.phone = phoneValue;
			addressIsModified = true;
		}
		// 추가 연락처
		const extraPhoneValue = document.getElementById("adsExtraPhone").value.trim();
		if (extraPhoneValue && phoneCheckObj.adsExtraPhone) {
			phoneData.extraPhone = extraPhoneValue;
			addressIsModified = true;
		}

    
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

						
				} else {
					alert(result);
					
				}
		} catch (error) {
				console.error(error);
				alert('배송지 등록 중 오류가 발생했습니다.');
		} finally {
			submitButton.disabled = false; // 버튼 활성화
		}

});

});


//*********************************************************************************************** 



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
            <input type="checkbox" class="address-checkbox">
            <div class="address-info">
                <div class="address-header">
                    <p class="receiver">
                        <strong>${address.receiverName}</strong>
                        ${address.basicAddress === 'Y' 
                            ? '<span class="default-badge">기본 배송지</span>' 
                            : ''}
                    </p>
                    ${address.basicAddress !== 'Y' ? 
                        `<button class="set-default-btn" data-address-no="${address.addressNo}">
                            기본 배송지로 설정
                        </button>`
                        : ''
                    }
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
            <div class="address-actions">
                <button class="edit-btn" data-address-no="${address.addressNo}">수정</button>
                <button class="delete-btn" data-address-no="${address.addressNo}">삭제</button>
            </div>
        `;

				
			
			// 기본 배송지 설정 버튼 이벤트 리스너
			const setDefaultBtn = addressItem.querySelector('.set-default-btn');
			if (setDefaultBtn && address.basicAddress !== 'Y') {
					setDefaultBtn.addEventListener('click', async () => {
							try {
									// addressNo 값을 버튼의 data-address-no 속성에서 가져옴
									const addressNo = setDefaultBtn.getAttribute('data-address-no');
									console.log('Sending addressNo:', addressNo); // 디버깅용 로그
			
									if (!addressNo) {
											alert('주소 번호가 유효하지 않습니다.');
											return;
									}
			
									const formData = new URLSearchParams();
									formData.append('addressNo', addressNo);
									
									const response = await fetch('/mypage/basicAddress', {
											method: 'POST',
											headers: {
													'Content-Type': 'application/x-www-form-urlencoded',
											},
											body: formData.toString()
									});
			
									const responseText = await response.text();
									
									if (response.ok) {
											alert(responseText);
											loadAddressList();
									} else {
											console.error('Error:', responseText);
											alert(responseText || '기본 배송지 변경에 실패했습니다.');
									}
							} catch (error) {
									console.error('Error:', error);
									alert('기본 배송지 변경에 실패했습니다.');
							}
					});
			}

			// 체크박스 이벤트 리스너 수정
			const checkbox = addressItem.querySelector('.address-checkbox');
			const actions = addressItem.querySelector('.address-actions');
			
			checkbox.addEventListener('change', (e) => {

					// 다른 모든 체크박스 해제
					const allCheckboxes = document.querySelectorAll('.address-checkbox');
					allCheckboxes.forEach(cb => {
							if (cb !== e.target) {
									cb.checked = false;
									cb.closest('.address-item').querySelector('.address-actions').classList.remove('show');
							}
					});
					
					// 현재 체크박스에 대한 actions 토글
					actions.classList.toggle('show', e.target.checked);
			});


			// 수정 버튼 이벤트 리스너
			const editBtn = addressItem.querySelector('.edit-btn');
			editBtn.addEventListener('click', () => {
					openEditModal(address);
			});


			// 삭제 버튼 이벤트 리스너
			const deleteBtn = addressItem.querySelector('.delete-btn');
			deleteBtn.addEventListener('click', () => {
					openDeleteModal(address.addressNo);
			});


			addressListContainer.appendChild(addressItem);
			
		});


}



// ******************************************************************************************************* 


// 배송지 수정

// 배송지 수정 모달 열기 함수
function openEditModal(address) {
	const editModal = document.getElementById('editModal');
	
	// 폼에 addressNo 데이터 속성 추가
	document.getElementById('editForm').dataset.addressNo = address.addressNo;
    
	// 폼 필드에 기존 값을 직접 설정
	document.getElementById('editReceiverName').value = address.receiverName;
	document.getElementById('editPostcode').value = address.postcode;
	document.getElementById('editAddress').value = address.address;
	document.getElementById('editDetailAddress').value = address.detailAddress;
	document.getElementById('editPhone').value = address.phone;
	document.getElementById('editExtraPhone').value = address.extraPhone || '';

	// 전화번호 유효성 검사 메시지 초기화
	document.getElementById('editPhoneMessage').innerText = '';
	document.getElementById('editExtraPhoneMessage').innerText = '';
	document.getElementById('editPhoneMessage').classList.remove('error', 'confirm');
	document.getElementById('editExtraPhoneMessage').classList.remove('error', 'confirm');

	
	editModal.style.display = 'block';
}


/* 전화번호(휴대폰번호) 유효성 검사 (문제 시 삭제) */ 

const phoneCheckObj = {

	adsPhone: true,          // 전화번호 유효성 (초기값 true로 변경)
	adsExtraPhone: true,

	editPhone: true,
	editExtraPhone: true

};

// 핸드폰 번호 수정
const editPhone = document.querySelector("#editPhone");
const editPhoneMessage = document.querySelector("#editPhoneMessage");

editPhone.addEventListener("input", e => {

	const inputEditPhone = e.target.value;

	if (inputEditPhone.trim().length > 0) {
		phoneCheckObj.editPhone = false; // 검증 필요함을 표시

	const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

	if (!regExp.test(inputEditPhone)) {
		editPhoneMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
		editPhoneMessage.classList.add("error");
		editPhoneMessage.classList.remove("confirm");
		phoneCheckObj.editPhone = false;
		return;
	}

	editPhoneMessage.innerText = "유효한 전화번호 형식입니다.";
	editPhoneMessage.classList.add("confirm");
	editPhoneMessage.classList.remove("error");
	phoneCheckObj.editPhone = true;
  } else {

		// 전화번호 입력값이 없는 경우 메시지 초기화 및 유효성 true로 설정
		editPhoneMessage.innerText = "";
		phoneCheckObj.editPhone = true;

	}

});

// 추가 연락처 수정
const editExtraPhone = document.querySelector("#editExtraPhone");
const editExtraPhoneMessage = document.querySelector("#editExtraPhoneMessage");

editExtraPhone.addEventListener("input", e => {

	const inputEditPhone = e.target.value;

	if (inputEditPhone.trim().length > 0) {
		phoneCheckObj.editExtraPhone = false; // 검증 필요함을 표시

	const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

	if (!regExp.test(inputEditPhone)) {
		editExtraPhoneMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
		editExtraPhoneMessage.classList.add("error");
		editExtraPhoneMessage.classList.remove("confirm");
		phoneCheckObj.editExtraPhone = false;
		return;
	}

	editExtraPhoneMessage.innerText = "유효한 전화번호 형식입니다.";
	editExtraPhoneMessage.classList.add("confirm");
	editExtraPhoneMessage.classList.remove("error");
	phoneCheckObj.editExtraPhone = true;
  } else {

		// 전화번호 입력값이 없는 경우 메시지 초기화 및 유효성 true로 설정
		editExtraPhoneMessage.innerText = "";
		phoneCheckObj.editExtraPhone = true;

	}

});


// 수정 완료 폼 제출
document.getElementById('editForm').addEventListener('submit', async function(e) {
	e.preventDefault();


	// 0108 문제 시 삭제
		// 변경된 값이 있는지 확인
		const phoneData = {};
		let addressIsModified = false;

		// 휴대폰 번호
		const phoneValue = document.getElementById("editPhone").value.trim();
		if (phoneValue && phoneCheckObj.editPhone) {
			phoneData.phone = phoneValue;
			addressIsModified = true;
		}
		// 추가 연락처
		const extraPhoneValue = document.getElementById("editExtraPhone").value.trim();
		if (extraPhoneValue && phoneCheckObj.editExtraPhone) {
			phoneData.extraPhone = extraPhoneValue;
			addressIsModified = true;
		}

		const phone = document.getElementById('editPhone').value.trim();
    const extraPhone = document.getElementById('editExtraPhone').value.trim();

		const formData = {
			addressNo: this.dataset.addressNo,
			receiverName: document.getElementById('editReceiverName').value.trim(),
			postcode: document.getElementById('editPostcode').value.trim(),
			address: document.getElementById('editAddress').value.trim(),
			detailAddress: document.getElementById('editDetailAddress').value.trim(),
			phone: phone,
			extraPhone: extraPhone
	};


	if (!isFormDataValid(formData)) {
			alert('모든 필수 필드를 입력해주세요.');
			return;
	}

	try {
			const response = await fetch('/mypage/editAddress', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
			});

			const result = await response.text();
			
			if (response.ok) {
					alert(result);
					closeEditModal();
					loadAddressList();

			} else {
					alert(result || '수정에 실패했습니다.');
			}

	} catch (error) {
			console.error('Error:', error);
			alert('수정 중 오류가 발생했습니다.');
	}

});


// 폼 데이터 유효성 검사
function isFormDataValid(data) {
	return data.receiverName && data.postcode && data.address && data.detailAddress && data.phone;
}

// 모달 닫기
function closeEditModal() {
	document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editCancelBtn').addEventListener('click', closeEditModal);


//  배송지 수정에서 다음 주소 창 띄우기
function editExecDaumPostcode() {
	new daum.Postcode({
			oncomplete: function(data) {
					var addr = '';
					
					if (data.userSelectedType === 'R') {
							addr = data.roadAddress;
					} else {
							addr = data.jibunAddress;
					}

					// 우편번호와 주소 정보를 해당 필드에 넣는다.
					document.getElementById('editPostcode').value = data.zonecode;
					document.getElementById("editAddress").value = addr;
					// 커서를 상세주소 필드로 이동한다.
					document.getElementById("editDetailAddress").focus();
			}
	}).open();
}


// 배송지 수정에서 주소 검색 버튼 클릭 시 이벤트 리스너 등록
const editSearchAddress = document.querySelector("#editSearchAddress");
if(editSearchAddress) {
	editSearchAddress.addEventListener("click", editExecDaumPostcode);
}



// ****************************************************************************************************



// 배송지 삭제 모달 열기
function openDeleteModal(addressNo) {
	const deleteModal = document.getElementById('deleteModal');
	deleteModal.style.display = 'block';
	
	// 삭제 확인 버튼에 이벤트 리스너 추가
	document.getElementById('deleteConfirm').onclick = async () => {
			await deleteAddress(addressNo);
	};
	
	// 취소 버튼에 이벤트 리스너 추가
	document.getElementById('deleteCancel').onclick = () => {
			deleteModal.style.display = 'none';
	};
}

// 배송지 삭제 실행 함수
async function deleteAddress(addressNo) {
	try {
			const response = await fetch(`/mypage/deleteAddress/${addressNo}`, {
					method: 'DELETE',
					headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
					}
			});

			if (response.ok) {
					alert('배송지가 성공적으로 삭제되었습니다.');
					loadAddressList();
					document.getElementById('deleteModal').style.display = 'none';
			} else {
					const errorText = await response.text();
					alert(errorText || '배송지 삭제에 실패했습니다.');
			}
	} catch (error) {
			console.error('Error:', error);
			alert('배송지 삭제 중 오류가 발생했습니다.');
	}
}






	
	