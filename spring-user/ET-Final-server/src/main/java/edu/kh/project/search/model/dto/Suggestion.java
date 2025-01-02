package edu.kh.project.search.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Suggestion {

	private String title;        // 검색 제안 텍스트 (공연명 또는 공지사항 제목)
    private String type;         // 검색 결과 타입 ("performance" 또는 "notice")
    private Long id;            // 해당 항목의 ID
    
}
