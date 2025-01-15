document.addEventListener("DOMContentLoaded", () => {
  // 아임포트 가맹점 코드
  const impCode = "imp00237821";

  // 좌석 정보
  const seatInfo = JSON.parse(localStorage.getItem("selectedSeats"))
    .map((seat) => {
      const parts = seat.seatId.split("-");
      return parts.slice(1).join("-"); // mt20id 제거 후 나머지 부분 합치기
    })
    .join(", ");

  document.getElementById("seat-info").textContent = seatInfo; // mt20id 제거된 좌석 정보 출력

  const bookingInfo = JSON.parse(localStorage.getItem("bookingInfo"));
  const totalPrice = localStorage.getItem("totalPrice");

  // 문자열에서 쉼표(,)와 '원' 제거 후 숫자로 변환
  const totalPriceRaw = localStorage.getItem("totalPrice") || "0 원";
  const sanitizedTotalPrice = Number(totalPriceRaw.replace(/[^\d]/g, "")); // 숫자 외 제거

  if (sanitizedTotalPrice <= 0) {
    alert("결제 금액이 0원입니다. 다시 시도해주세요.");
    return;
  }

  const performanceId = localStorage.getItem("performanceId"); // 공연 ID
  const facilityId = localStorage.getItem("facilityId"); // 공연 시설 ID
  if (performanceId && facilityId) {
    console.log("공연 ID:", performanceId);
    console.log("공연 시설 ID:", facilityId);
  }

   // 로컬스토리지에서 defaultAddress 가져오기
   const defaultAddress = JSON.parse(localStorage.getItem("defaultAddress"));
   if (!defaultAddress) {
    alert("배송지 정보가 없습니다. 배송지를 추가해 주세요.");
    return;
  }
  // buyerAddr 생성: address + detailAddress
  const buyerAddr = `${defaultAddress.address} ${defaultAddress.detailAddress}`;
  const buyerPostcode = defaultAddress.postcode;

  // booking-info
  document.getElementById("booking-nickname").textContent = bookingInfo.nickname; // 닉네임
  document.getElementById("booking-email").textContent = bookingInfo.email; // 이메일
  document.getElementById("booking-phone").textContent = bookingInfo.phone; // 연락처
  document.getElementById("total-price").textContent = totalPrice;
  document.getElementById("prev-btn").addEventListener("click", () => {
    // localStorage에서 필수 정보를 가져옴
    const mt20id = localStorage.getItem("performanceId");
    const selectedDate = localStorage.getItem("selectedDate");
    const selectedTime = localStorage.getItem("selectedTime");
    const dayOfWeek = localStorage.getItem("dayOfWeek");

    if (!mt20id || !selectedDate || !selectedTime || !dayOfWeek) {
      alert("필수 정보가 누락되었습니다. 다시 시도해주세요.");
      return;
    }

    // 이전 단계로 이동 (필수 파라미터 포함)
    window.location.href = `/payment/booking-info?mt20id=${mt20id}&selectedDate=${selectedDate}&selectedTime=${selectedTime}&dayOfWeek=${dayOfWeek}`;
  });

  // 결제 버튼 이벤트
  const payButton = document.getElementById("pay-btn");

  payButton.addEventListener("click", () => {
    const selectedPayment = document.querySelector("input[name='payment']:checked");
    if (!selectedPayment) {
      alert("결제 수단을 선택해 주세요.");
      return;
    }
    const paymentMethod = selectedPayment.value; // 카드 or 카카오페이
    handlePayment(paymentMethod === "kakaopay" ? "kakaopay" : "html5_inicis.INIpayTest", "card");
  });
  
  // 결제 처리 함수
  function handlePayment(pg, payMethod) {
    console.log(`PG: ${pg}, Payment Method: ${payMethod}`);

    // 아임포트 초기화
    IMP.init(impCode);

    // 결제 요청
    IMP.request_pay(
      {
        pg: pg, // PG사
        pay_method: payMethod, // 결제 방식
        merchant_uid: `ORD-${new Date().getTime()}`, // 주문번호
        name: `좌석: ${seatInfo}`, // 상품명
        amount: sanitizedTotalPrice, // 숫자로 변환된 결제 금액
        buyer_name: bookingInfo.nickname, // 구매자 이름
        buyer_tel: bookingInfo.phone, // 구매자 연락처
        buyer_email: bookingInfo.email, // 구매자 이메일
      },
      function (rsp) {
        if (rsp.success) {
          // 결제 성공 시 처리
          console.log("결제 성공:", rsp);

          alert(`결제가 성공적으로 완료되었습니다.\n고유ID: ${rsp.imp_uid}`);

          // 결제 데이터 생성
          const paymentData = {
            impUid: rsp.imp_uid || null,
            merchantUid: rsp.merchant_uid || null,
            payMethod: rsp.pay_method || "unknown",
            applyNum: rsp.apply_num,
            cardName: rsp.card_name,
            cardNumber: rsp.card_number,
            cardQuota: rsp.card_quota,
            pgProvider: rsp.pg_provider || null,
            pgType: rsp.pg_type || null,
            pgTid: rsp.pg_tid || null,
            name: rsp.name || `좌석: ${seatInfo}`, // 좌석 정보 반영
            paidAmount: rsp.paid_amount || 0,
            currency: rsp.currency || "KRW",
            buyerName: rsp.buyer_name || bookingInfo.nickname,
            buyerTel: rsp.buyer_tel || bookingInfo.phone,
            buyerAddr: buyerAddr, // 배송지 주소 추가
            buyerPostcode: buyerPostcode, // 우편번호 추가
            buyerEmail: rsp.buyer_email || bookingInfo.email,
            status: rsp.status,
            paidAt: rsp.paid_at
              ? new Date(rsp.paid_at * 1000).toISOString()
              : null,
            receiptUrl: rsp.receipt_url || null,
            seatIds: JSON.parse(localStorage.getItem("selectedSeats")), // 좌석 ID 배열 추가
            mt20id: performanceId, // 공연 ID 추가
            mt10id: facilityId, // 공연 시설 ID 추가
            showDate: localStorage.getItem("selectedDate"), // 공연 날짜 추가
            showTime: localStorage.getItem("selectedTime"), // 공연 시간 추가
          };
          console.log("전송할 결제 데이터:", paymentData);

          // 서버로 결제 검증 요청
          $.ajax({
            type: "POST",
            url: "/payment/save-payment",
            contentType: "application/json",
            data: JSON.stringify(paymentData), // paymentData를 바로 사용

            success: function () {
              alert("결제가 성공적으로 저장되었습니다.");
              // 필수 파라미터를 URL에 포함
              const mt20id = localStorage.getItem("performanceId");
              const selectedDate = localStorage.getItem("selectedDate");
              const selectedTime = localStorage.getItem("selectedTime");
              const dayOfWeek = localStorage.getItem("dayOfWeek");

              window.location.href = `/payment/seat-selection?mt20id=${mt20id}&selectedDate=${selectedDate}&selectedTime=${selectedTime}&dayOfWeek=${dayOfWeek}`;
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error(
                "Error during payment save:",
                textStatus,
                errorThrown
              );

              // 서버에서 반환된 응답 내용
              const response = jqXHR.responseText;

              // 응답 내용을 파싱해서 표시
              try {
                const parsedResponse = JSON.parse(response);
                console.error("서버 응답:", parsedResponse);
                alert(
                  `결제 저장에 실패했습니다: ${
                    parsedResponse.message || response
                  }`
                );
              } catch (e) {
                console.error("응답 파싱 실패. 원본 응답:", response);
                alert(`결제 저장에 실패했습니다: ${response}`);
              }
            },
          });
        } else {
          console.error("결제 실패:", rsp.error_msg);
          alert(`결제에 실패했습니다. 사유: ${rsp.error_msg}`);
        }
      }
    );
  }
});
