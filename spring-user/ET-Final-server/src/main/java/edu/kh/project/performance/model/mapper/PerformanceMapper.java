package edu.kh.project.performance.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.performance.model.dto.Performance;

@Mapper
public interface PerformanceMapper {

	List<Performance> genre(String genre);

}
