package edu.kh.project.myPage.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.dto.AddressDTO;
import edu.kh.project.myPage.model.mapper.MyPageMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public abstract class MyPageServiceImpl implements MyPageService {
    
    private final MyPageMapper mapper;
    private final BCryptPasswordEncoder bcrypt;
   
   
    
    
    // 비밀번호 인증
    @Override
    public int verifyPassword(String memberPw, int memberNo) {
        
        // DB에서 현재 회원의 암호화된 비밀번호 조회
        String encPw = mapper.selectEncPw(memberNo);
        
        // 비밀번호가 일치하면 1, 아니면 0 반환
        if(bcrypt.matches(memberPw, encPw)) {
            return 1;
        }
        return 0;
    }

    // 회원 정보 조회
	@Override
	public Member getMemberInfo(int memberNo) {
		
		return mapper.getMemberInfo(memberNo);
	}
	
	
	// 이메일 중복 체크
	@Override
	public int verifyEmail(String verificationEmail) {
		
		return mapper.verifyEmail(verificationEmail);
	}
	
	// 닉네임 중복검사(수정)
	@Override
	public int updateNickname(String userNickname) {
		
		return mapper.updateNickname(userNickname);
	}
	
	
	

	// 비밀번호 변경
	@Override
	public int changePw(int memberNo, String newPassword) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		String encPw = bcrypt.encode(newPassword);
		
		paramMap.put("encPw", encPw);
		paramMap.put("memberNo", memberNo);
		
		return mapper.changePw(paramMap);
	}

	
	// 회원 비밀번호 비교
	@Override
	public int memberPwCheck(String memberPw, int memberNo) {
		
		String checkPw = mapper.memberPwCheck(memberNo);
		
		if(bcrypt.matches(memberPw, checkPw)) {
			return 1;
		} else {
			return 0;
		}
		
	}
	
	
	// 네이버 회원 삭제
	@Override
	public int membershipNaverOut(int memberNo) {
		return mapper.membershipNaverOut(memberNo);
	}
	
	
	// 회원 탈퇴 처리
	@Override
	public int membershipOut(int memberNo) {
		return mapper.membershipOut(memberNo);
	}
	
	
	// 회원 정보 수정
	@Override
	public int updateMember(Member member) {
		
		 return mapper.updateMember(member);
	}

	@Override
	public int addAddress(AddressDTO addressDTO) {
		// TODO Auto-generated method stub
		return 0;
	}


	

	
    
}
