package edu.kh.project.member.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import edu.kh.project.common.jwt.JwtTokenUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.service.MemberService;
import edu.kh.project.redis.model.service.RedisService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("member")
@SessionAttributes({"loginMember"})
@RequiredArgsConstructor
@Slf4j
public class MemberController {
	
	private final MemberService service;
	
    private final JwtTokenUtil jwtTokenUtil;
    
    private final RedisService redisService;
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    private static final List<String> WEEKDAYS = Arrays.asList("월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일");
    
	/** 로그인 진행
	 * @param inputMember
	 * @param ra
	 * @param model
	 * @param saveId
	 * @param resp
	 * @return
	 */
	@PostMapping("login")
	@ResponseBody
	public Map<String, Object> login(@RequestBody Member inputMember, 
						HttpSession session,
						RedirectAttributes ra,
						Model model,
						@RequestParam(value="saveId", required = false) String saveId,
						HttpServletResponse resp ) {
		
		Map<String, Object> result = new HashMap<>();
		
		// 체크박스
		// - 체크가    된 경우 : "on"
		// - 체크가  안된 경우 : null
		
		// 로그인 서비스 호출
		Member loginMember = service.login(inputMember);
		
		// 로그인 실패 시
		if(loginMember == null) {
			result.put("status", "fail");
			result.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
			
		} else {
			// Session scope에 loginMember 추가
			model.addAttribute("loginMember", loginMember);

			// JWT 토큰 생성
			String memberNo = String.valueOf(loginMember.getMemberNo());
			String memberEmail = loginMember.getMemberEmail();

			JwtTokenUtil.TokenInfo tokenInfo = jwtTokenUtil.generateTokenSet(memberNo, memberEmail);

			// Refresh Token을 Redis에 저장
			//redisService.saveRefreshToken(tokenInfo.refreshToken(), memberNo, jwtTokenUtil.getRefreshTokenValidityInMilliseconds());

			// Access Token을 HttpOnly 쿠키에 저장
			Cookie accessTokenCookie = new Cookie("Access-token", tokenInfo.accessToken());
			accessTokenCookie.setHttpOnly(true); // JavaScript에서 접근하지 못하도록 설정
			accessTokenCookie.setPath("/");     // 쿠키 유효 경로 설정
			accessTokenCookie.setMaxAge((int) jwtTokenUtil.getAccessTokenValidityInMilliseconds() / 1000); // 초 단위 설정
			resp.addCookie(accessTokenCookie);

			// Refresh Token을 HttpOnly 쿠키에 저장
			Cookie refreshTokenCookie = new Cookie("Refresh-token", tokenInfo.refreshToken());
			refreshTokenCookie.setHttpOnly(true); // JavaScript에서 접근하지 못하도록 설정
			refreshTokenCookie.setPath("/");     // 쿠키 유효 경로 설정
			refreshTokenCookie.setMaxAge((int) jwtTokenUtil.getRefreshTokenValidityInMilliseconds() / 1000); // 초 단위 설정
			resp.addCookie(refreshTokenCookie);
			
			
			// 결과에 Access Token과 상태 추가
			result.put("status", "success");
			result.put("redirectUrl", "/");

			
		}
		
		return result; // 메인페이지 재요청
	}
	
	/** 회원 가입 
	 * @param inputMember : 입력된 회원 정보(memberEmail, memberPw, memberNickname, memberTel, 
	 * 						(memberAddress - 따로 배열로 받아서 처리))
	 * @param memberAddress : 입력한 주소 input 3개의 값을 배열로 전달 [우편번호, 도로명/지번주소, 상세주소]
	 * @param ra : 리다이렉트 시 request scope로 데이터 전달하는 객체 
	 * @return
	 */
	@PostMapping("signup")
	public String signup(Member inputMember, 
						@RequestParam("gender") String gender, // 성별 받기
						@RequestParam("memberAddress") String[] memberAddress,
						RedirectAttributes ra ) {
		
		// log.debug("inputMember : " + inputMember);
		if(gender.equals("male")) {
			inputMember.setMemberGender("M");
		} else {
			inputMember.setMemberGender("F");
		}
		
		// 회원가입 서비스 호출
		int result = service.signup(inputMember, memberAddress);
		
		String path = null;
		String message = null;
		
		if(result > 0) { // 성공 시
			message = inputMember.getMemberNickname() + "님의 가입을 환영 합니다!";
			path = "/";
			
		} else { // 실패
			message = "회원 가입 실패...";
			path = "sigunup";
		}
		
		ra.addFlashAttribute("message", message);
		
		
		return "redirect:" + path; 
	}
	
	/** 로그아웃 진행
	 * @param session
	 */
	@PostMapping("/logout")
	public String logout(SessionStatus session, HttpServletResponse resp, HttpServletRequest request) {
		
		// 삭제할 쿠키를 null로 설정
		Cookie cookie = new Cookie("Access-token", null);
		
		// 쿠키의 Path를 명시적으로 설정 (원래의 Path와 일치시켜야 함)
		cookie.setPath("/");
		
		// 응답에 쿠키를 추가해서 삭제
		resp.addCookie(cookie);
		
        // 세션 무효화
        session.setComplete();	
        
        return "redirect:/"; // 메인 페이지로 리다이렉트
	}
	
	/** 이메일 중복검사 (비동기 요청)
	 * @return
	 */
	@ResponseBody
	@GetMapping("checkEmail")
	public int checkEmail(@RequestParam("memberEmail") String memberEmail) {
		return service.checkEmail(memberEmail);
	}
	
	/** 아이디 중복검사 (비동기 요청)
	 * @return
	 */
	@ResponseBody // 응답 본문(fetch)으로 돌려보냄
	@GetMapping("checkId")   // Get요청 /member/checkEmail 
	public int checkId(@RequestParam("memberId") String memberId) {
		return service.checkId(memberId);
	}
	
	/** 닉네임 중복 검사
	 * @return 중복 1, 아님 0
	 */
	@ResponseBody
	@GetMapping("checkNickname")
	public int checkNickname(@RequestParam("memberNickname") String memberNickname) {
		return service.checkNickname(memberNickname);
	}



	@GetMapping("perform-and-save")
	public String performAndSaveVenues() {
		try {
			
			// 공연 좌석 등록 분류
			List<Map<String, String>> performanceDetails = service.performanceDetails();
			
			List<Map<String, Object>> venueSeatList = parseVenueSeatInfo(performanceDetails);
		    
		    // 결과 확인
		    for (Map<String, Object> seat : venueSeatList) {
		        System.out.printf("공연장ID: %s, 좌석등급: %d, 좌석수: %d%n", 
		            seat.get("mt10id"), seat.get("gradeId"), seat.get("seatCount"));
		        
		       // service.insertVenueSeat(seat);
		    }
			// processAllTicketPrices(performanceDetails);

			// API URL과 서비스 키 설정
			String serviceKey = "65293f6ed44e4a2fbc5498ef280710f0"; // 발급받은 서비스 키
			String apiUrl = "https://www.kopis.or.kr/openApi/restful/pblprfr?service=" + serviceKey
					+ "&stdate=20230101&eddate=20241218&cpage=2&rows=10&prfstate=02&shcate=GGGA&signgucode=11";

			// XML 응답 파싱
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(apiUrl);

			// XML 구조 확인
			doc.getDocumentElement().normalize();

			// dbs -> db 태그 추출
			NodeList nodeList = doc.getElementsByTagName("db");

			// 각 db 정보 출력
			for (int i = 0; i < nodeList.getLength(); i++) {
				Node node = nodeList.item(i);

				if (node.getNodeType() == Node.ELEMENT_NODE) {
					Element element = (Element) node;
					String mt20id = element.getElementsByTagName("mt20id").item(0).getTextContent(); // 공연 아이디

					// 출력
//					System.out.println("공연 아이디: " + mt20id);
//					System.out.println("------------------------------");

					// ID를 이용하여 추가 API 호출
					String detailsApiUrl = "http://www.kopis.or.kr/openApi/restful/pblprfr/" + mt20id + "?service="
							+ serviceKey;
					
					DocumentBuilderFactory deFactory = DocumentBuilderFactory.newInstance();
					DocumentBuilder deBuilder = deFactory.newDocumentBuilder();
					Document deDoc = deBuilder.parse(detailsApiUrl);

					// XML 구조 확인
					deDoc.getDocumentElement().normalize();

					// dbs -> db 태그 추출
					NodeList deNodeList = deDoc.getElementsByTagName("db");

					// 각 db 정보 출력
					for (int j = 0; j < deNodeList.getLength(); j++) {
						Node dbNode = deNodeList.item(j);

						if (dbNode.getNodeType() == Node.ELEMENT_NODE) {
							Element dbElement = (Element) dbNode;

							// db 정보 추출 및 출력
							String deMt20id = getTagValue(dbElement, "mt20id"); // 공연 아이디
							String dePrfnm = getTagValue(dbElement, "prfnm"); // 공연 이름
							String dePrfpdfrom = getTagValue(dbElement, "prfpdfrom"); // 공연 시작일
							String fcltychartr = getTagValue(dbElement, "prfpdto"); // 공연 종료일
							String deFcltynm = getTagValue(dbElement, "fcltynm"); // 공연 시설명
							String prfcast = getTagValue(dbElement, "prfcast"); // 공연 출연진
							String prfruntime = getTagValue(dbElement, "prfruntime"); // 공연 런타임
							String pcseguidance = getTagValue(dbElement, "pcseguidance"); // 티켓 가격
							String dePoster = getTagValue(dbElement, "poster"); // 포스터 이미지 경로
							String deGenrenm = getTagValue(dbElement, "genrenm"); // 공연 장르
							String mt10id = getTagValue(dbElement, "mt10id"); // 시설 아이디
							String area = getTagValue(dbElement, "area");
							String prfstate = getTagValue(dbElement, "prfstate");
							String dtguidance = getTagValue(dbElement, "dtguidance"); // 공연 시간
							
							Map<String, Object> perfMap = new HashMap<>();
							
							if(deMt20id.equals("PF253358")) {
								continue;
							}
							
							perfMap.put("mt20id", deMt20id);
							perfMap.put("prfnm", dePrfnm);
							perfMap.put("prfpdfrom", dePrfpdfrom);
							perfMap.put("prfpdto", fcltychartr);
							perfMap.put("fcltynm", deFcltynm);
							perfMap.put("prfcast", prfcast);
							perfMap.put("prfruntime", prfruntime);
							perfMap.put("entrpsnm", null);
							perfMap.put("pcseguidance", pcseguidance);
							perfMap.put("poster", dePoster);
							perfMap.put("dtguidance", dtguidance);
							perfMap.put("area", area);
							perfMap.put("genrenm", deGenrenm);
							perfMap.put("prfstate", prfstate);
							perfMap.put("mt10id", mt10id);
							
							// service.insertPerf(perfMap);

							// 정규식 패턴을 수정하여 단일 요일도 포함하도록 함
							String[] performanceSlots = dtguidance.split("\\)");
							String regex = "^(월요일|화요일|수요일|목요일|금요일|토요일|일요일)( ~ (월요일|화요일|수요일|목요일|금요일|토요일|일요일))?$";

							Pattern pattern = Pattern.compile(regex);

							for (String slot : performanceSlots) {
							    if (slot.trim().isEmpty()) continue; // 빈 슬롯 건너뛰기
							    
							    String days = extractDays(slot);
							    String times = extractTimes(slot);
							    
							    // 단일 요일이나 범위 모두 처리할 수 있도록 수정
							    if (days != null && !days.trim().isEmpty()) {
							        List<String> daysList;
							        if (days.contains(" ~ ")) {
							            // 범위 형식 처리 ("화요일 ~ 목요일")
							            daysList = extractDayss(days);
							        } else {
							            daysList = new ArrayList<>();
						                int dayIndex = WEEKDAYS.indexOf(days.trim());
						                if (dayIndex != -1) {
						                    daysList.add(String.valueOf(dayIndex + 1));
						                }
							        }
							        
							        // 시간 처리
							        List<String> timesList = Arrays.asList(times.split(","));
							        
							        // 각 요일과 시간 조합에 대해 처리
							        for (String day : daysList) {
							            for (String time : timesList) {
							                // System.out.println(deMt20id + " : " + day + " " + time);
							                
							                Map<String, Object> perfTime = new HashMap<>();
							                perfTime.put("mt20id", deMt20id);
							                perfTime.put("dayOfWeek", day);
							                perfTime.put("performanceTime", time);
							                
							                if(deMt20id.equals("PF253358")) {
							                    continue;
							                }
							                
							                // service.insertPerfTime(perfTime);
							            }
							        }
							    }
							}
							

							// styurls 태그 추출
							NodeList styurls = dbElement.getElementsByTagName("styurls");
							
							// URL 리스트 생성
					        List<String> urlList = new ArrayList<>();

					        // styurls 태그 추출 (예시 데이터로 대체)
					        // NodeList styurls = dbElement.getElementsByTagName("styurls");

					        
					        /*
					        for (int k = 0; k < styurls.getLength(); k++) {
					            Node styurlsNode = styurls.item(k);

					            if (styurlsNode.getNodeType() == Node.ELEMENT_NODE) {
					                Element styurlsElement = (Element) styurlsNode;

					                // styurls 내부의 styurl 태그들 추출
					                NodeList styurlList = styurlsElement.getElementsByTagName("styurl");

					                for (int l = 0; l < styurlList.getLength(); l++) {
					                    Node styurlNode = styurlList.item(l);

					                    if (styurlNode.getNodeType() == Node.ELEMENT_NODE) {
					                        String styurl = styurlNode.getTextContent().trim(); // styurl 텍스트 추출
					                        System.out.println("소개 이미지 : " + styurl);
					                        urlList.add(styurl); // URL 리스트에 추가
					                    }
					                }
					            }
					        }
					        */

					        // URL을 "^^^" 구분자로 연결
					        String concatenatedUrls = String.join("^^^", urlList);

					        // 연결된 URL 출력
					        // System.out.println("최종 연결된 URL: " + concatenatedUrls);
							
							

						}
					}

				}
			}

			return "";

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}
	
	public static List<Map<String, Object>> parseVenueSeatInfo(List<Map<String, String>> performanceDetails) {
        List<Map<String, Object>> resultList = new ArrayList<>();
        Set<String> processedMt10ids = new HashSet<>();
        
        for (Map<String, String> detail : performanceDetails) {
            String mt10id = String.valueOf(detail.get("MT10ID"));
            
            if (processedMt10ids.contains(mt10id)) {
                continue;
            }
            
            String guidance = String.valueOf(detail.get("PCSEGUIDANCE"));
            int totalSeats = Integer.parseInt(String.valueOf(detail.get("SEATSCALE")));
            
            // 전석인 경우
            if (guidance.contains("전석")) {
                Map<String, Object> seatInfo = new HashMap<>();
                seatInfo.put("mt10id", mt10id);
                seatInfo.put("gradeId", 6);
                seatInfo.put("seatCount", totalSeats);
                resultList.add(seatInfo);
                processedMt10ids.add(mt10id);
                continue;
            }
            
            // 여러 등급이 있는 경우
            List<String> sections = new ArrayList<>();
            for(String grade : guidance.split(",")) {
                if(grade.contains("석")) {
                    sections.add(grade.trim());
                }
            }
            
            int seatPerGrade = totalSeats / sections.size();
            int remainingSeats = totalSeats % sections.size();  // 나머지 좌석
            
            for (int i = 0; i < sections.size(); i++) {
                String section = sections.get(i).trim();
                int gradeId = getGradeId(section);
                if (gradeId > 0) {
                    Map<String, Object> seatInfo = new HashMap<>();
                    seatInfo.put("mt10id", mt10id);
                    seatInfo.put("gradeId", gradeId);
                    
                    // 마지막 등급에 남은 좌석 추가
                    if (i == sections.size() - 1) {
                        seatInfo.put("seatCount", seatPerGrade + remainingSeats);
                    } else {
                        seatInfo.put("seatCount", seatPerGrade);
                    }
                    resultList.add(seatInfo);
                }
            }
            processedMt10ids.add(mt10id);
        }
        
        return resultList;
    }
    
    private static int getGradeId(String section) {
        if (section.contains("VIP")) return 1;
        if (section.contains("R석")) return 2;
        if (section.contains("S석")) return 3;
        if (section.contains("A석")) return 4;
        if (section.contains("B석")) return 5;
        if (section.contains("전석")) return 6;
        return -1;
    }
	
	public void processAllTicketPrices(List<Map<String, String>> performanceDetails) {
	    for (Map<String, String> detail : performanceDetails) {
	        String mt20id = detail.get("MT20ID");
	        String pcseguidance = detail.get("PCSEGUIDANCE");
	        
	        // 각 공연의 가격 정보 처리
	        insertTicketPrices(mt20id, pcseguidance);
	    }
	}

	public List<Map<String, Object>> insertTicketPrices(String mt20id, String pcseguidance) {
		List<Map<String, Object>> ticketPrices = new ArrayList<>();

		// 좌석 등급 매핑
		Map<String, Integer> seatGradeMap = new HashMap<>();
		seatGradeMap.put("VIP", 1);
		seatGradeMap.put("R", 2);
		seatGradeMap.put("S", 3);
		seatGradeMap.put("A", 4);
		seatGradeMap.put("B", 5);
		seatGradeMap.put("전석", 6);

		// 일반 좌석 처리
		String regex = "([A-Za-z가-힣]+석)\\s*(\\d+,\\s*\\d+)원";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(pcseguidance);

		while (matcher.find()) {
		    String seatGrade = matcher.group(1).replace("석", "");
		    String priceStr = matcher.group(2).replaceAll("[,\\s]", "");

		    try {
		        int price = Integer.parseInt(priceStr);
		        Integer gradeId = seatGradeMap.get(seatGrade);

		        if (gradeId != null) {
		            Map<String, Object> ticketInfo = new HashMap<>();
		            ticketInfo.put("mt20id", mt20id);
		            ticketInfo.put("seatGradeId", gradeId);
		            ticketInfo.put("price", price);

		            // PF253558이 아닐 경우에만 DB에 삽입
		            if (!mt20id.equals("PF253558")) {
		                //service.insertTicketInto(ticketInfo);
		            }
		            
		            ticketPrices.add(ticketInfo);
		        }
		    } catch (NumberFormatException e) {
		        System.out.println("가격 파싱 오류: " + priceStr);
		    }
		}

		// 전석 처리
		String allSeatsRegex = "전석\\s*(\\d+,\\s*\\d+)원";
		Pattern allSeatsPattern = Pattern.compile(allSeatsRegex);
		Matcher allSeatsMatcher = allSeatsPattern.matcher(pcseguidance);

		if (allSeatsMatcher.find()) {
		    String priceStr = allSeatsMatcher.group(1).replaceAll("[,\\s]", "");
		    try {
		        int price = Integer.parseInt(priceStr);
		        Map<String, Object> ticketInfo = new HashMap<>();
		        ticketInfo.put("mt20id", mt20id);
		        ticketInfo.put("seatGradeId", 6);
		        ticketInfo.put("price", price);

		        // PF253558이 아닐 경우에만 DB에 삽입
		        if (!mt20id.equals("PF253558")) {
		            //service.insertTicketInto(ticketInfo);
		        }
		        
		        ticketPrices.add(ticketInfo);
		    } catch (NumberFormatException e) {
		        System.out.println("전석 가격 파싱 오류: " + priceStr);
		    }
		}
	    
	    return ticketPrices;
	}

	// 특정 태그의 값을 반환하는 메서드
	private static String getTagValue(Element element, String tagName) {
		NodeList nodeList = element.getElementsByTagName(tagName);
		if (nodeList.getLength() > 0) {
			Node node = nodeList.item(0);
			if (node != null) {
				return node.getTextContent();
			}
		}
		return "정보 없음"; // 태그가 없거나 null인 경우 기본값 반환
	}

	// 안전하게 숫자 변환하는 메서드
	private static int parseIntSafely(String str) {
		try {
			return Integer.parseInt(str);
		} catch (NumberFormatException e) {
			return 0; // 숫자 변환 실패 시 0 반환
		}
	}

	// 날짜(요일) 추출 (괄호 앞부분)
	public static String extractDays(String slot) {
		// "HOL"이 포함된 경우 처리
		if (slot.contains("HOL")) {
			return "공휴일"; // HOL이면 "공휴일"로 처리
		}

		// 괄호가 포함된 부분에서 날짜만 추출 (괄호 앞의 부분)
		return slot.replaceAll("[^가-힣\\s~]", "").trim(); // 한글과 공백, ~만 남기고 제거
	}

	// 시간 추출 (괄호 안의 시간만 추출)
	public static String extractTimes(String slot) {
		// 시간 추출: 괄호 뒤에 있는 시간 정보 추출
		// 예: "화요일 ~ 금요일(19:30"에서 시간만 추출
		slot = slot.trim(); // 앞뒤 공백 제거
		if (slot.endsWith("(")) {
			return ""; // 괄호가 닫히지 않은 경우 시간 정보가 없으므로 빈 문자열 반환
		}

		// 괄호 앞부분에 시간 정보가 있을 때만 추출
		int startIndex = slot.lastIndexOf("(");
		if (startIndex != -1) {
			return slot.substring(startIndex + 1).trim(); // 괄호 내의 시간만 추출
		}
		return "";
	}
	
	// 요일 추출 함수
	private static List<String> extractDayss(String range) {
	    List<String> days = new ArrayList<>();
	    if (range.contains(" ~ ")) {
	        String[] parts = range.split(" ~ ");
	        int startIndex = WEEKDAYS.indexOf(parts[0].trim());
	        int endIndex = WEEKDAYS.indexOf(parts[1].trim());
	        for (int i = startIndex; i <= endIndex; i++) {
	            days.add(String.valueOf(i + 1)); // 인덱스가 0부터 시작하므로 1을 더해줍니다
	        }
	    } else {
	        int dayIndex = WEEKDAYS.indexOf(range.trim());
	        days.add(String.valueOf(dayIndex + 1));
	    }
	    return days;
	}
	
}
