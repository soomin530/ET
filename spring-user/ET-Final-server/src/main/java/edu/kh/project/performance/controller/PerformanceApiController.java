package edu.kh.project.performance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.kh.project.performance.model.dto.Performance;
import edu.kh.project.performance.service.PerformanceService;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class PerformanceApiController {
    
    @Autowired
    private PerformanceService performanceService;
    
    @GetMapping("/genre/more")
    @ResponseBody
    public List<Performance> getMorePerformances(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "genre") String genre) {
        int pageSize = 20;
        return performanceService.getPerformancesByPage(page, pageSize, genre);
    }
}
