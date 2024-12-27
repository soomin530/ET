package edu.kh.project.performance.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerformanceRanking {
    private String mt20id;
    private String prfnm;
    private String poster;
    private int prfreviewRank;
    private int reviewCount;
    private double avgRating;
}