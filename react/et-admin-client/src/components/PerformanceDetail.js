import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";

// Styled Components
const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  max-width: 1200px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  flex: 1;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ff7f27;
    box-shadow: 0 0 0 2px rgba(255, 127, 39, 0.1);
  }

  &.readonly {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &.error {
    border-color: #d32f2f;
  }
`;

const ErrorMessage = styled.span`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #10B981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background-color: #059669;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const MapSection = styled.div`
  flex: 1;
  padding: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const SuggestionItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SuggestionName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const SuggestionAddress = styled.div`
  font-size: 12px;
  color: #666;
`;

const LocationInfo = styled.div`
  margin-top: 20px;
`;

const LocationText = styled.p`
  margin: 8px 0;
  color: #555;
  font-size: 14px;
`;

const MapContainer = styled.div`
  width: 500px;
  height: 400px;
`;

const PerformanceForm = () => {
  const container = useRef(null);
  const mapInstanceRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isShowSuggestions, setIsShowSuggestions] = useState(false);
  const [searchType, setSearchType] = useState("keyword");

  const { mt10ID } = useParams();

  const [formData, setFormData] = useState({
    MT10ID: "",
    FCLTYNM: "",
    MT13CNT: "",
    FCLTYCHARTR: "공공(문예회관)",
    OPENDE: "",
    SEATSCALE: "",
    TELNO: "",
    RELATEURL: "",
    ADRES: "",
    FCLTLA: "",
    FCLTLO: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    FCLTYNM: false,
    TELNO: false,
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
            MT10ID: performanceData?.mt10ID || "",
            FCLTYNM: performanceData?.fcltynm || "",
            MT13CNT: performanceData?.mt13CNT || "",
            FCLTYCHARTR: performanceData?.fcltychartr || "공공(문예회관)",
            OPENDE: performanceData?.opende || "",
            SEATSCALE: performanceData?.seatscale || "",
            TELNO: performanceData?.telno || "",
            RELATEURL: performanceData?.relateurl || "",
            ADRES: performanceData?.adres || "",
            FCLTLA: performanceData?.fcltla || "",
            FCLTLO: performanceData?.fcltlo || "",
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

    if (name === "FCLTYNM") {
      setValidationErrors((prev) => ({
        ...prev,
        FCLTYNM: !value.trim(),
      }));
    }

    if (name === "TELNO") {
      setValidationErrors((prev) => ({
        ...prev,
        TELNO: value ? !isValidPhoneNumber(value) : false,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.FCLTYNM.trim()) {
      alert("공연장명은 필수 입력사항입니다.");
      return;
    }

    if (formData.TELNO && !isValidPhoneNumber(formData.TELNO)) {
      alert("올바른 전화번호 형식을 입력해주세요.");
      return;
    }

    axios
      .post("http://localhost:8081/performance/update", formData)
      .then((response) => {
        if (response.data > 0) {
          alert("시설 정보가 변경되었습니다.");
        } else {
          alert("변경 실패하였습니다");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("뻑난거같은데요");
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

    if (searchType === "keyword") {
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
        level: 3,
      });

      mapInstanceRef.current = map;
    };

    loadMap();
  }, []);

  useEffect(() => {
    if (formData.FCLTLA && formData.FCLTLO && mapInstanceRef.current) {
      const coords = new window.kakao.maps.LatLng(
        formData.FCLTLA,
        formData.FCLTLO
      );
      mapInstanceRef.current.setCenter(coords);

      if (mapInstanceRef.current.marker) {
        mapInstanceRef.current.marker.setMap(null);
      }

      const marker = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position: coords,
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
        position: coords,
      });
    }

    setFormData({
      ...formData,
      ADRES: place.address_name,
      FCLTLA: place.y,
      FCLTLO: place.x,
    });

    setIsShowSuggestions(false);
  };

  return (
    <Container>
      <FormSection>
        <FormWrapper>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>공연장 ID:</Label>
              <Input
                type="text"
                name="MT10ID"
                value={formData.MT10ID}
                onChange={handleChange}
                required
                readOnly
                className="readonly"
              />
            </FormGroup>
            <FormGroup>
              <Label>공연장명:</Label>
              <Input
                type="text"
                name="FCLTYNM"
                value={formData.FCLTYNM}
                onChange={handleChange}
                required
                className={validationErrors.FCLTYNM ? "error" : ""}
              />
              {validationErrors.FCLTYNM && (
                <ErrorMessage>공연장명은 필수 입력사항입니다.</ErrorMessage>
              )}
            </FormGroup>
            <FormGroup>
              <Label>공연장 시설 수:</Label>
              <Input
                type="number"
                name="MT13CNT"
                value={formData.MT13CNT}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>시설특성:</Label>
              <Input
                type="text"
                name="FCLTYCHARTR"
                value={formData.FCLTYCHARTR}
                onChange={handleChange}
                placeholder="공공(문예회관)"
              />
            </FormGroup>
            <FormGroup>
              <Label>개관일:</Label>
              <Input
                type="text"
                name="OPENDE"
                value={formData.OPENDE}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>객석수:</Label>
              <Input
                type="number"
                name="SEATSCALE"
                value={formData.SEATSCALE}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>전화번호:</Label>
              <Input
                type="tel"
                name="TELNO"
                value={formData.TELNO}
                onChange={handleChange}
                required
                className={validationErrors.TELNO ? "error" : ""}
              />
              {validationErrors.TELNO && (
                <ErrorMessage>
                  전화번호는 하이픈(-)을 포함한 형식으로 입력해주세요. (예:
                  02-123-4567 또는 010-1234-5678)
                </ErrorMessage>
              )}
            </FormGroup>
            <FormGroup>
              <Label>홈페이지:</Label>
              <Input
                type="string"
                name="RELATEURL"
                value={formData.RELATEURL}
                onChange={handleChange}
              />
            </FormGroup>
            <SubmitButton
              type="submit"
              disabled={validationErrors.FCLTYNM || validationErrors.TELNO}
            >
              제출
            </SubmitButton>
          </Form>
        </FormWrapper>
      </FormSection>

      <MapSection>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchKeyword}
            onChange={handleInputChange}
            placeholder="주소를 검색하세요"
          />

          {isShowSuggestions && suggestions.length > 0 && (
            <SuggestionsContainer>
              {suggestions.map((place, index) => (
                <SuggestionItem
                  key={index}
                  onClick={() => handlePlaceClick(place)}
                >
                  <SuggestionName>{place.place_name}</SuggestionName>
                  <SuggestionAddress>{place.address_name}</SuggestionAddress>
                </SuggestionItem>
              ))}
            </SuggestionsContainer>
          )}
        </SearchContainer>

        <MapContainer ref={container} />

        <LocationInfo>
          <LocationText>주소: {formData.ADRES}</LocationText>
          <LocationText>위도: {formData.FCLTLA}</LocationText>
          <LocationText>경도: {formData.FCLTLO}</LocationText>
        </LocationInfo>
      </MapSection>
    </Container>
  );
};

export default PerformanceForm;
