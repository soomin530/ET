package edu.kh.admin.main.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.admin.main.model.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController 
@CrossOrigin( origins = "http://localhost:3000",
			  allowedHeaders = "*",
			  allowCredentials = "true",
			  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
				           RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("announcementDetail")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginMember" }) 
public class AnnouncementDetail {

	@Value("${upload.path}")
	private String uploadDirectory;
	
	private final PerformanceService service;
	
	 /** Summernote Editor 안에 이미지를 불러오는 메서드
		 * @param file
		 * @return ResponseEntity.ok(uuidFileName);
		 * @throws IllegalStateException
		 * @throws IOException
		 */
		 @PostMapping("image-upload")
		    // @RequestParam은 자바스크립트에서 설정한 이름과 반드시 같아야합니다.
		 public void imageUpload(
				    @RequestPart("title") String title,
				    @RequestPart("content") String content,
				    @RequestPart("date") String date,
				    @RequestPart(value = "file", required = false) MultipartFile file
				)  throws IllegalStateException, IOException {
//				
		        log.info("Received file: {}", file.getOriginalFilename());
		        log.info("Content Type: {}", file.getContentType());
		        log.info("File Size: {} bytes", file.getSize());
			 try {
				 	if(file != null && !file.isEmpty()) {
				 		// 업로드 된 파일의 이름
				 		String originalFileName = file.getOriginalFilename();
				 		
				 		// 업로드 된 파일의 확장자
				 		String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
				 		
				 		// 업로드 될 파일의 이름 재설정 (중복 방지를 위해 UUID 사용)
				 		String uuidFileName = UUID.randomUUID().toString() + fileExtension;
				 		
				 		// 위에서 설정한 서버 경로에 이미지 저장
				 		file.transferTo(new File(uploadDirectory, uuidFileName));
				 		
//					// Ajax에서 업로드 된 파일의 이름을 응답 받을 수 있도록 해줍니다. 		
				 	}	
					
				} catch (Exception e) {
					ResponseEntity.badRequest().body("이미지 업로드 실패");
				}
			}
		
		 
		 

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
//	@GetMapping("showMemberList")
//	public ResponseEntity<Object> showMemberList() {
//		List<Member> showMemberList = service.showMemberList();
//		try {
//			return ResponseEntity.status(HttpStatus.OK).body(showMemberList);
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("회원 목록 조회 중 문제가 발생했음 : " + e.getMessage());
//		}
//	}
	
}
