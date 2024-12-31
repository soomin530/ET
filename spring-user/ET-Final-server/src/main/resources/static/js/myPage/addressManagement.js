// 다음주소 API 
function execDaumPostcode() {
    new daum.Postcode({
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
            document.getElementById('postcode').value = data.zonecode;
            document.getElementById("address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("detailAddress").focus();
        }
    }).open();
}

// 주소 검색 버튼 클릭 시(myPage-info.html 외에도 문제가 발생하지 않도록 예외처리 해둔 부분!)
const searchAddress = document.querySelector("#searchAddress");

if(searchAddress != null) { // 화면상에 id가 searchAddress인 요소가 존재하는 경우에만
   searchAddress.addEventListener("click", execDaumPostcode);
}

//새 배송지 추가 버튼 클릭 이벤트
// document.querySelector('.add-button').addEventListener('click', function() {
//              alert('새 배송지 추가 기능이 클릭');
//          });

		  
document.addEventListener('DOMContentLoaded', function() {
           const modal = document.getElementById('addressModal');
           const addButton = document.querySelector('.add-button');
           const cancelBtn = document.getElementById('cancelBtn');
           const addressForm = document.getElementById('addressForm');
		   const addressList = document.querySelector('.address-list');

           // 새 배송지 추가 버튼 클릭 시 모달 열기
           addButton.addEventListener('click', function() {
               modal.classList.add('show');
           });

           // 취소 버튼 클릭 시 모달 닫기
           cancelBtn.addEventListener('click', function() {
               modal.classList.remove('show');
               addressForm.reset();
           });

           // 모달 외부 클릭 시 닫기
           modal.addEventListener('click', function(e) {
               if (e.target === modal) {
                   modal.classList.remove('show');
                   addressForm.reset();
               }
           });
		   
		      // 폼 제출 처리
		      addressForm.addEventListener('submit', async (e) => {
		          e.preventDefault();

		          const formData = {
		              receiverName: document.getElementById('receiverName').value,
		              postcode: document.getElementById('postcode').value,
		              address: document.getElementById('address').value,
		              detailAddress: document.getElementById('detailAddress').value,
		              phone: document.getElementById('phone').value,
		              extraPhone: document.getElementById('extraPhone').value
		          };

		          try {
		              const response = await fetch('/address/add', {
		                  method: 'POST',
		                  headers: {
		                      'Content-Type': 'application/json'
		                  },
		                  body: JSON.stringify(formData)
		              });

		              if (response.ok) {
		                  alert('배송지가 등록되었습니다.');
		                  adsmodal.style.display = 'none';
		                  addressForm.reset();
		                  loadAddresses(); // 주소 목록 새로고침
		              }
		          } catch (error) {
		              console.error('Error:', error);
		              alert('배송지 등록에 실패했습니다.');
		          }
		      });

		      // 주소 목록 로드
		      async function loadAddresses() {
		          try {
		              const response = await fetch('/address/list');
		              const addresses = await response.json();
		              
		              addressList.innerHTML = addresses.map(address => `
		                  <div class="address-item">
		                      <input type="checkbox" class="address-checkbox">
		                      <div class="address-content">
		                          <div class="address-name">${address.receiverName}</div>
		                          <div class="address-detail">${address.address} ${address.detailAddress}</div>
		                          <div class="address-phone">${address.phone}</div>
		                      </div>
		                      <div class="action-buttons">
		                          <button class="edit-button" data-id="${address.id}">수정</button>
		                          <button class="delete-button" data-id="${address.id}">삭제</button>
		                      </div>
		                  </div>
		              `).join('');

		              // 체크박스 이벤트 리스너 추가
		              const checkboxes = document.querySelectorAll('.address-checkbox');
		              checkboxes.forEach(checkbox => {
		                  checkbox.addEventListener('change', function() {
		                      if (this.checked) {
		                          checkboxes.forEach(cb => {
		                              if (cb !== this) {
		                                  cb.checked = false;
		                                  cb.closest('.address-item').querySelector('.action-buttons').classList.remove('show');
		                              }
		                          });
		                      }
		                      
		                      const actionButtons = this.closest('.address-item').querySelector('.action-buttons');
		                      actionButtons.classList.toggle('show', this.checked);
		                  });
		              });
		          } catch (error) {
		              console.error('Error:', error);
		          }
		      }

		      // 초기 주소 목록 로드
		      loadAddresses();
		  });



// document.addEventListener('DOMContentLoaded', function() {
//           const checkboxes = document.querySelectorAll('.address-checkbox');
//           let lastChecked = null;
          
//           checkboxes.forEach(checkbox => {
//               checkbox.addEventListener('change', function() {
//                   // 다른 체크박스들의 선택을 해제
//                   if (this.checked) {
//                       checkboxes.forEach(cb => {
//                           if (cb !== this) {
//                               cb.checked = false;
//                               cb.closest('.address-item').querySelector('.action-buttons').classList.remove('show');
//                           }
//                       });
//                       lastChecked = this;
//                   }
                  
//                   // 현재 체크박스에 대한 버튼 표시/숨김
//                   const actionButtons = this.closest('.address-item').querySelector('.action-buttons');
//                   if (this.checked) {
//                       actionButtons.classList.add('show');
//                   } else {
//                       actionButtons.classList.remove('show');
//                   }
//               });
//           });

//           // 수정 버튼 클릭 이벤트
//           document.querySelectorAll('.edit-button').forEach(button => {
//               button.addEventListener('click', function() {
//                   alert('수정 기능이 클릭되었습니다.');
//               });
//           });

//           // 삭제 버튼 클릭 이벤트
//           document.querySelectorAll('.delete-button').forEach(button => {
//               button.addEventListener('click', function() {
//                   const addressItem = this.closest('.address-item');
//                   if (confirm('정말 삭제하시겠습니까?')) {
//                       addressItem.remove();
//                   }
//               });
//           });

//           // 새 배송지 추가 버튼 클릭 이벤트
//           document.querySelector('.add-button').addEventListener('click', function() {
//               alert('새 배송지 추가 기능이 클릭되었습니다.');
//           });
//       });