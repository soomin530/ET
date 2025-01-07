import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PerformanceForm = () => {
  const container = useRef(null);
  const mapInstanceRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isShowSuggestions, setIsShowSuggestions] = useState(false);
  const [searchType, setSearchType] = useState('keyword');

  const { mt10ID } = useParams(); // URL에서 memberNo 가져오기

  const [formData, setFormData] = useState({
    MT10ID: '',       // 공연장 ID (새로 추가)
    FCLTYNM: '',      // facilityName -> FCLTYNM 
    MT13CNT: '',      // facilityCount -> MT13CNT
    FCLTYCHARTR: '공공(문예회관)',  // facilityType -> FCLTYCHARTR
    OPENDE: '',       // openYear -> OPENDE
    SEATSCALE: '',    // seatCount -> SEATSCALE
    TELNO: '',        // phoneNumber -> TELNO
    RELATEURL: '',    // website -> RELATEURL
    ADRES: '',        // address -> ADRES
    FCLTLA: '',       // latitude -> FCLTLA
    FCLTLO: ''        // longitude -> FCLTLO
 });

 useEffect(() => {
  if (mt10ID) {  // mt10ID가 있을 때만 API 호출
    axios
      .get(`http://localhost:8081/performance/${mt10ID}`)
      .then((response) => {
        console.log("API 응답 데이터:", response.data);
        const performanceData = response.data[0];
        console.log(performanceData);
        // 데이터가 있는지 확인하고 대문자로 변환하여 설정
        setFormData({
          MT10ID: performanceData?.mt10ID || '',
          FCLTYNM: performanceData?.fcltynm || '',
          MT13CNT: performanceData?.mt13CNT || '',
          FCLTYCHARTR: performanceData?.fcltychartr || '공공(문예회관)',
          OPENDE: performanceData?.opende || '',
          SEATSCALE: performanceData?.seatscale || '',
          TELNO: performanceData?.telno || '',
          RELATEURL: performanceData?.relateurl || '',
          ADRES: performanceData?.adres || '',
          FCLTLA: performanceData?.fcltla || '',
          FCLTLO: performanceData?.fcltlo || ''
        });

        // 값이 제대로 설정되었는지 확인
        console.log("설정된 formData:", performanceData);
      })
      .catch((error) => {
        console.error("API 호출 에러:", error);
      });
  }
}, [mt10ID]);

// formData가 변경될 때마다 로그 출력
useEffect(() => {
  console.log("현재 formData 상태:", formData);
}, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post('http://localhost:8081/performance/update', formData)
      .then((response) => {
        if(response.data > 0) {alert('시설 정보가 변경되었습니다.');}
        else alert("변경 실패하였습니다");
      })
      .catch((error) => {
        console.error(error);
        alert('뻑난거같은데요');
      });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    
    if (!value.trim()) {
      setSuggestions([]);
      setIsShowSuggestions(false);
      return;
    }

    if (searchType === 'keyword') {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(value, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSuggestions(data);
          setIsShowSuggestions(true);
        }
      });
    }
  };

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        return setTimeout(loadMap, 100);
      }

      const map = new window.kakao.maps.Map(container.current, {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      });

      mapInstanceRef.current = map;
    };

    loadMap();
  }, []);

  useEffect(() => {
    if (formData.FCLTLA && formData.FCLTLO && mapInstanceRef.current) {
      const coords = new window.kakao.maps.LatLng(formData.FCLTLA, formData.FCLTLO);
      
      // 지도 중심 이동
      mapInstanceRef.current.setCenter(coords);
      
      // 기존 마커가 있다면 제거
      if (mapInstanceRef.current.marker) {
        mapInstanceRef.current.marker.setMap(null);
      }
      
      // 새 마커 생성
      const marker = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position: coords
      });
      
      // 마커 참조 저장
      mapInstanceRef.current.marker = marker;
    }
  }, [formData.FCLTLA, formData.FCLTLO]);

  const handlePlaceClick = (place) => {
    setSearchKeyword(place.place_name);
    const coords = new window.kakao.maps.LatLng(place.y, place.x);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(coords);
      new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position: coords
      });
    }

    // Form 데이터 업데이트
    setFormData({
      ...formData,
      ADRES: place.address_name,
      FCLTLA: place.y,
      FCLTLO: place.x
    });
    console.log(formData);
    
    setIsShowSuggestions(false);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label>공연장 ID:</label>
            <input
              type="text"
              name="MT10ID"
              value={formData.MT10ID}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div>
            <label>공연장명:</label>
            <input
              type="text" 
              name="FCLTYNM"
              value={formData.FCLTYNM}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>공연장 시설 수:</label>
            <input
              type="number"
              name="MT13CNT"
              value={formData.MT13CNT}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>시설특성:</label>
            <input
              type="text"
              name="FCLTYCHARTR"
              value={formData.FCLTYCHARTR}
              onChange={handleChange}
              placeholder="공공(문예회관)"
            />
          </div>
          <div>
            <label>개관일:</label>
            <input
              type="text"
              name="OPENDE"
              value={formData.OPENDE}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>객석수:</label>
            <input
              type="number"
              name="SEATSCALE"
              value={formData.SEATSCALE}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>전화번호:</label>
            <input
              type="tel"
              name="TELNO"
              value={formData.TELNO}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>홈페이지:</label>
            <input
              type="string"
              name="RELATEURL"
              value={formData.RELATEURL}
              onChange={handleChange}
            />
          </div>
          <button type="submit" style={{ marginTop: '20px', padding: '10px' }}>제출</button>
        </form>
      </div>
 
      <div style={{ flex: 1 }}>
        <div className="search-container" style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={searchKeyword}
            onChange={handleInputChange}
            placeholder="주소를 검색하세요"
            style={{ width: '300px', padding: '8px' }}
          />
 
          {isShowSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              width: '300px',
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              zIndex: 1000
            }}>
              {suggestions.map((place, index) => (
                <div
                  key={index}
                  onClick={() => handlePlaceClick(place)}
                  style={{ padding: '8px', cursor: 'pointer', hover: { backgroundColor: '#f5f5f5' } }}
                >
                  <div>{place.place_name}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>{place.address_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        <div ref={container} style={{ width: "500px", height: "400px" }}></div>
 
        <div style={{ marginTop: '10px' }}>
          <p>주소: {formData.ADRES}</p>
          <p>위도: {formData.FCLTLA}</p>
          <p>경도: {formData.FCLTLO}</p>
        </div>
      </div>
    </div>
  );
 };

export default PerformanceForm;