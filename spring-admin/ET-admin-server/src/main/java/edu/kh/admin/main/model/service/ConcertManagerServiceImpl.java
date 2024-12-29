package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.ConcertManager;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.mapper.ConcertManagerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class ConcertManagerServiceImpl implements ConcertManagerService{

		private final ConcertManagerMapper mapper;
		private final BCryptPasswordEncoder bcrypt;

		@Override
		public List<ConcertManager> managerEnrollList() {
			List<ConcertManager> list = mapper.managerEnrollList();
			
			for (ConcertManager concertManager : list) {
			    String formalTel = concertManager.getConcertManagerTel();
			    
			    if (formalTel != null && formalTel.length() == 11) {
			    	String areaCode = formalTel.substring(0, 3);
			    	String middlePart = formalTel.substring(3, 7); 
			    	String lastPart = formalTel.substring(7); 
			    	
			    	concertManager.setConcertManagerTel(areaCode + "-" + middlePart + "-" + lastPart);
			    }
			}
			return list;
		}
		
		@Override
		public List<ConcertManager> searchManagerEnrollList(Map<String, Object> formdata) {
			return mapper.searchManagerEnrollList(formdata);
		}
}
