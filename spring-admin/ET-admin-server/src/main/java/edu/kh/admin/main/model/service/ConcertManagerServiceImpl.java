package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.ConcertManager;
import edu.kh.admin.main.model.mapper.ConcertManagerMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class ConcertManagerServiceImpl implements ConcertManagerService{

		private final ConcertManagerMapper mapper;

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
		
		@Override
		public List<ConcertManager> concertManagerDetail(int concertManagerNo) {
		return mapper.concertManagerDetail(concertManagerNo);
		}
		
		@Override
		public int agree(int concertManagerNo) {
		return mapper.agree(concertManagerNo);
		}
		
		@Override
		public int delete(int concertManagerNo) {
		return mapper.delete(concertManagerNo);
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
}
