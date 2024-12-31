package edu.kh.project.search.model.dto;

import java.util.List;

import edu.kh.project.notice.model.dto.Notice;
import edu.kh.project.performance.model.dto.Performance;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDTO {

	private List<Performance> performances;
    private List<Notice> notices;
    
    public boolean isEmpty() {
        return (performances == null || performances.isEmpty()) 
            && (notices == null || notices.isEmpty());
    }
	
}
