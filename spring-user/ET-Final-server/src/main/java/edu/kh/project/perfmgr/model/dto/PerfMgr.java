package edu.kh.project.perfmgr.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class PerfMgr {

	private int concertManagerNo;
	private String concertManagerId;
	private String concertManagerPw;
	private String concertManagerNickname;
	private String concertManagerTel;
	private String concertManagerEnrollDate;
	private Boolean concertManagerDelFl;
	private String concertManagerCompany;
	private String concertManagerCompanyComment;
	private String concertManagerEmail;
	private int memberAuth;
	
}
