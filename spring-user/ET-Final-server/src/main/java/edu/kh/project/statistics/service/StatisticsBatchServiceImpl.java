package edu.kh.project.statistics.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import edu.kh.project.statistics.model.dto.Statistics;
import edu.kh.project.statistics.model.mapper.StatisticsBatchMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StatisticsBatchServiceImpl implements StatisticsBatchService {

	private final StatisticsBatchMapper mapper;
	
	private final String serviceKey = "65293f6ed44e4a2fbc5498ef280710f0";
    private final String baseUrl = "http://kopis.or.kr/openApi/restful/boxStatsCate";
    
    // 처리할 카테고리 코드 리스트
    private final List<String> CATEGORY_CODES = Arrays.asList("AAAA", "CCCA", "GGGA");

    @Scheduled(cron = "0 0 2 1 * *") // 
    public void performStatisticsBatch() {
        try {
        	// 지난달의 시작일과 마지막일 구하기
            LocalDate now = LocalDate.now();
            LocalDate lastMonth = now.minusMonths(1);
            LocalDate startDate = lastMonth.withDayOfMonth(1);
            LocalDate endDate = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth());
            
            String formattedStartDate = startDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String formattedEndDate = endDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            
            // 각 카테고리 코드별로 데이터 수집
            for (String categoryCode : CATEGORY_CODES) {
                List<Statistics> categoryStats = fetchAndParseStatistics(formattedStartDate, formattedEndDate, categoryCode);
                
                log.debug("categoryStats : " + categoryStats);
                
                // API 호출 간격 조절 (필요한 경우)
                Thread.sleep(100);
            }
            
        } catch (Exception e) {
            log.error("Error during statistics batch processing: ", e);
        }
    }

    /** Api로 통계 데이터 가져오기(뮤지컬, 연극, 클래식만)
     * @param startDate
     * @param endDate
     * @param categoryCode
     * @return
     * @throws Exception
     */
    private List<Statistics> fetchAndParseStatistics(String startDate, String endDate, String categoryCode) throws Exception {
    	List<Statistics> statisticsList = new ArrayList<>();
    	
        String apiUrl = String.format("%s?service=%s&stdate=%s&eddate=%s&catecode=%s",
                baseUrl, serviceKey, startDate, endDate, categoryCode);
                
        log.info("Fetching statistics for category: {}", categoryCode);

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		Document doc = builder.parse(apiUrl);

		// XML 구조 확인
		doc.getDocumentElement().normalize();

        NodeList prfstList = doc.getElementsByTagName("boxStatsof");
        
        // 문자열 날짜를 LocalDate로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate parsedStartDate = LocalDate.parse(startDate, formatter);
        LocalDate parsedEndDate = LocalDate.parse(endDate, formatter);
        
        for (int i = 0; i < prfstList.getLength(); i++) {
            Element element = (Element) prfstList.item(i);
            
            String category = getElementText(element, "catenm");
            
            // "합계" 데이터는 건너뛰기
            if ("합계".equals(category)) {
                continue;
            }
            
            Statistics statistics = Statistics.builder()
                .statCategory(category)
                .statPrfcnt(parseInt(getElementText(element, "prfcnt")))
                .statPrfdtcnt(parseInt(getElementText(element, "prfdtcnt")))
                .statNtssnmrssm(parseLong(getElementText(element, "ntssnmrssm")))
                .statCancelnmrssm(parseLong(getElementText(element, "cancelnmrssm"))) // API에서 제공되지 않는 경우
                .statNtssamountsm(parseLong(getElementText(element, "ntssamountsm")))
                .categoryCode(categoryCode)
                .statStartDate(parsedStartDate)
                .statEndDate(parsedEndDate)
                .build();
            
            // 데이터 저장
            mapper.saveStatistics(statistics);
            
            statisticsList.add(statistics);
        }
        
        log.info("Saved {} records for category: {}", statisticsList.size(), categoryCode);
        return statisticsList;
    }

    /** element안에 태그 내용 반환
     * @param element
     * @param tagName
     * @return
     */
    private String getElementText(Element element, String tagName) {
        NodeList nodeList = element.getElementsByTagName(tagName);
        if (nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return null;
    }
    
    /** int 타입 반환
     * @param value
     * @return
     */
    private int parseInt(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
    
    /** Long 타입 반환
     * @param value
     * @return
     */
    private long parseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
    
    
    // 지난달 통계 데이터 조회
	@Override
	public List<Statistics> getStatList() {
		return mapper.getStatList();
	}
	
	// 공연 종료 업데이트 배치 실행
	@Scheduled(cron = "0 0 1 * * *")
	public void updatePerformanceStatus() {
	    try {
	    	// 종료된 공연 상태 업데이트
	        int updatedCount = mapper.updateExpiredPerformances();
	        log.info("Updated {} expired performances to '공연종료' status", updatedCount);
	        
	        // 시작된 공연 상태 업데이트
	        int startedCount = mapper.updateStartedPerformances();
	        log.info("Updated {} started performances to '공연중' status", startedCount);
	        
	    } catch (Exception e) {
	        log.error("Error updating performance status: ", e);
	    }
	}
	
	// StatisticsBatchServiceImpl.java에 추가할 메서드
	@Scheduled(cron = "0 0 3 * * *")
	public void updatePerformanceReviewRanks() {
	    try {
	        // 공연 리뷰 평점 평균 업데이트
	        int updatedCount = mapper.updatePerformanceReviewRanks();
	        log.info("Updated {} performances review ranks", updatedCount);
	        
	    } catch (Exception e) {
	        log.error("Error updating performance review ranks: ", e);
	    }
	}
	
	 /** 공연 날짜가 지난 예매 내역 공연 종료 처리
	 * @author 나찬웅
	 */
	@Scheduled(cron = "0 0 12 * * ?") // 매일 정오 실행
	public void updateExpiredBookings() {
		int updateRows = mapper.updateExpiredBookings();
		
		
	}
    
}
