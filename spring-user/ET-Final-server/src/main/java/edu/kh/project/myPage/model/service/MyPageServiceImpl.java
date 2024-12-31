package edu.kh.project.myPage.model.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.myPage.model.mapper.MyPageMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MyPageServiceImpl implements MyPageService {
    
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
	
	
	


	
    
}
