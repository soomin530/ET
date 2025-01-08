package edu.kh.admin.main.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.common.util.Utility;
import edu.kh.admin.main.model.dto.Member;
import edu.kh.admin.main.model.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class MemberServiceImpl implements MemberService{

		private final MemberMapper mapper;
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
	
		@Override
		public List<Member> searchShowMemberList(Map<String, Object> formdata) {
			List<Member> list = mapper.searchShowMemberList(formdata);
			
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
		
		@Override
		public List<Member> memberDetail(int memberNo) {
		    List<Member> members = mapper.memberDetail(memberNo);  // DB에서 회원 정보 가져오기
		    
		    for (Member member : members) {
		        // 주소 가공: '^^^' 기준으로 분리
		        if (member.getMemberAddress() != null) {
		        	 String[] addressParts = member.getMemberAddress().split("\\^\\^\\^");
		             if (addressParts.length == 3) {
		                 String city = addressParts[0];
		                 String district = addressParts[1];
		                 String street = addressParts[2];
		                 
		                 String updatedAddress = city +" "+ district + " " + street;
		                 member.setMemberAddress(updatedAddress);
		            }
		        }
		        
		        // 전화번호 가공: '01012345678' -> '010-1234-5678' 형태로
		        if (member.getMemberTel() != null) {
		            String phone = member.getMemberTel();
		            if (phone.length() == 11) {
		                String formattedPhone = phone.substring(0, 3) + "-" + phone.substring(3, 7) + "-" + phone.substring(7);
		                member.setMemberTel(formattedPhone);
		            }
		        }
		    }
		    
		    return members;
		}
		
		
		@Override
		public int delete(int memberNo) {
		return mapper.delete(memberNo);
		}
		
		
		
		
		
		
		
		
		
		
		
}
