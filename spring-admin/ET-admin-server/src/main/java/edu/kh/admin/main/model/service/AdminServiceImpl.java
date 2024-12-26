package edu.kh.admin.main.model.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.common.util.Utility;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.mapper.AdminMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class AdminServiceImpl implements AdminService{

		private final AdminMapper mapper;
		private final BCryptPasswordEncoder bcrypt;
		
		@Override
		public List<Member> showMemberList() {
		List<Member> list = mapper.showMemberList();
		
		for (Member member : list) {
		    String rawAddress = member.getMemberAddress();
		    String formalTel = member.getMemberTel();
		    
		    if (rawAddress != null) {
		        String formattedAddress = rawAddress.replace("^^^", " "); 
		        member.setMemberAddress(formattedAddress); 
		    }
		    
		    if (formalTel != null && formalTel.length() == 11) {
		    	String areaCode = formalTel.substring(0, 3);
		    	String middlePart = formalTel.substring(3, 7); 
		    	String lastPart = formalTel.substring(7); 
		    	
		    	member.setMemberTel(areaCode + "-" + middlePart + "-" + lastPart);  
		    }
		}
		
		return list;
		}
	
		
}
