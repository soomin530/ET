import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const PerformanceForm = () => {
  const container = useRef(null);
  const mapInstanceRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isShowSuggestions, setIsShowSuggestions] = useState(false);
  const [searchType, setSearchType] = useState('keyword');

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post('http://localhost:8081/performance/insert', formData)
      .then((response) => {
        if(response.data > 0) {alert('시설 정보가 성공적으로 등록되었습니다.');}
        else alert("등록 실패하였습니다");
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