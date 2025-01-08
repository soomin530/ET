import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/PerformanceDetail.css';

const PerformanceForm = () => {
  const container = useRef(null);
  const mapInstanceRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isShowSuggestions, setIsShowSuggestions] = useState(false);
  const [searchType, setSearchType] = useState('keyword');

  const { mt10ID } = useParams();

  const [formData, setFormData] = useState({
    MT10ID: '',      
    FCLTYNM: '',      
    MT13CNT: '',      
    FCLTYCHARTR: '공공(문예회관)',  
    OPENDE: '',       
    SEATSCALE: '',    
    TELNO: '',        
    RELATEURL: '',    
    ADRES: '',        
    FCLTLA: '',       
    FCLTLO: ''        
  });

  const [validationErrors, setValidationErrors] = useState({
    FCLTYNM: false,
    TELNO: false
  });

  const isValidPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return true;
    const telRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    const mobileRegex = /^010-\d{4}-\d{4}$/;
    return telRegex.test(phoneNumber) || mobileRegex.test(phoneNumber);
  };

  useEffect(() => {
    if (mt10ID) {
      axios
        .get(`http://localhost:8081/performance/${mt10ID}`)
        .then((response) => {
          const performanceData = response.data[0];
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
        })
        .catch((error) => {
          console.error("API 호출 에러:", error);
        });
    }
  }, [mt10ID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'FCLTYNM') {
      setValidationErrors(prev => ({
        ...prev,
        FCLTYNM: !value.trim()
      }));
    }
    
    if (name === 'TELNO') {
      setValidationErrors(prev => ({
        ...prev,
        TELNO: value ? !isValidPhoneNumber(value) : false
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.FCLTYNM.trim()) {
      alert('공연장명은 필수 입력사항입니다.');
      return;
    }

    if (formData.TELNO && !isValidPhoneNumber(formData.TELNO)) {
      alert('올바른 전화번호 형식을 입력해주세요.');
      return;
    }
    
    axios
      .post('http://localhost:8081/performance/update', formData)
      .then((response) => {
        if(response.data > 0) {
          alert('시설 정보가 변경되었습니다.');
        } else {
          alert("변경 실패하였습니다");
        }
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
      mapInstanceRef.current.setCenter(coords);
      
      if (mapInstanceRef.current.marker) {
        mapInstanceRef.current.marker.setMap(null);
      }
      
      const marker = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position: coords
      });
      
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

    setFormData({
      ...formData,
      ADRES: place.address_name,
      FCLTLA: place.y,
      FCLTLO: place.x
    });
    
    setIsShowSuggestions(false);
  };

  return (
    <div className="form-container" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div className="form-wrapper" style={{ flex: 1 }}>
        <form onSubmit={handleSubmit} className="performance-form">
          <div className="form-group">
            <label>공연장 ID:</label>
            <input
              className="form-input readonly"
              type="text"
              name="MT10ID"
              value={formData.MT10ID}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label>공연장명:</label>
            <input
              className={`form-input ${validationErrors.FCLTYNM ? 'error' : ''}`}
              type="text" 
              name="FCLTYNM"
              value={formData.FCLTYNM}
              onChange={handleChange}
              required
            />
            {validationErrors.FCLTYNM && (
              <span className="error-message">공연장명은 필수 입력사항입니다.</span>
            )}
          </div>
          <div className="form-group">
            <label>공연장 시설 수:</label>
            <input
              className="form-input"
              type="number"
              name="MT13CNT"
              value={formData.MT13CNT}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>시설특성:</label>
            <input
              className="form-input"
              type="text"
              name="FCLTYCHARTR"
              value={formData.FCLTYCHARTR}
              onChange={handleChange}
              placeholder="공공(문예회관)"
            />
          </div>
          <div className="form-group">
            <label>개관일:</label>
            <input
              className="form-input"
              type="text"
              name="OPENDE"
              value={formData.OPENDE}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>객석수:</label>
            <input
              className="form-input"
              type="number"
              name="SEATSCALE"
              value={formData.SEATSCALE}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>전화번호:</label>
            <input
              className={`form-input ${validationErrors.TELNO ? 'error' : ''}`}
              type="tel"
              name="TELNO"
              value={formData.TELNO}
              onChange={handleChange}
              required
            />
            {validationErrors.TELNO && (
              <span className="error-message">
                전화번호는 하이픈(-)을 포함한 형식으로 입력해주세요. (예: 02-123-4567 또는 010-1234-5678)
              </span>
            )}
          </div>
          <div className="form-group">
            <label>홈페이지:</label>
            <input
              className="form-input"
              type="string"
              name="RELATEURL"
              value={formData.RELATEURL}
              onChange={handleChange}
            />
          </div>
          <button 
            className="submit-button"
            type="submit" 
            disabled={validationErrors.FCLTYNM || validationErrors.TELNO}
          >
            제출
          </button>
        </form>
      </div>
 
      <div className="map-section" style={{ flex: 1 }}>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            value={searchKeyword}
            onChange={handleInputChange}
            placeholder="주소를 검색하세요"
          />
 
          {isShowSuggestions && suggestions.length > 0 && (
            <div className="suggestions-container">
              {suggestions.map((place, index) => (
                <div
                  key={index}
                  onClick={() => handlePlaceClick(place)}
                  className="suggestion-item"
                >
                  <div className="suggestion-name">{place.place_name}</div>
                  <div className="suggestion-address">{place.address_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        <div ref={container} style={{ width: "500px", height: "400px" }}></div>
 
        <div className="location-info">
          <p className="location-text">주소: {formData.ADRES}</p>
          <p className="location-text">위도: {formData.FCLTLA}</p>
          <p className="location-text">경도: {formData.FCLTLO}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceForm;