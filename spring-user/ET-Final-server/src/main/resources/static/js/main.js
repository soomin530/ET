// 쿠키 값 가져오기
const getCookie = (key) => {

	const cookies = document.cookie; // "K=V; K=V; ... "

	const cookieList = cookies.split("; ") // ["K=V", "K=V"...]
		.map(el => el.split("=")); // ["K", "V"]...


	const obj = {}; // 비어있는 객체 선언

	for (let i = 0; i < cookieList.length; i++) {
		const k = cookieList[i][0]; // key 값
		const v = cookieList[i][1]; // value 값
		obj[k] = v;
	}

	return obj[key]; // 매개변수로 전달받은 key와

}
