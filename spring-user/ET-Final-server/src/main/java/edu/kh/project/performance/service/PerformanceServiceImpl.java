package edu.kh.project.performance.service;

import java.util.List;

import org.springframework.stereotype.Service;

import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.model.mapper.PerformanceMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements PerformanceService {

    private final PerformanceMapper mapper; 

    
    // 장르별 공연 목록 조회
    @Override
    public List<Performance> getPerformancesByGenre(String genre) {
        return mapper.genre(genre);
    }


    // 공연 상세페이지 조회
	@Override
	public Performance getPerformanceById(String mt20id) {
		return mapper.detail(mt20id);
	}
}
