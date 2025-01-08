package edu.kh.admin.main.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConcertManager {
	private String concertManagerNo;
	private String concertManagerId;
	private String concertManagerPw;
	private String concertManagerNickname;
	private String concertManagerTel;
	private String concertManagerEnrollDate;
	private String concertManagerDelFl;
	private String concertManagerCompany;
	private String concertManagerCompanyComment;
	private String concertManagerEmail;
	private int memberAuth;
	private String naverFl;
}