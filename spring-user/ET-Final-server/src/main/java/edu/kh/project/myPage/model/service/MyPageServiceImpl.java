package edu.kh.project.myPage.model.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.myPage.model.mapper.MyPageMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MyPageServiceImpl implements MyPageService {
    
    private final MyPageMapper mapper;
    private final BCryptPasswordEncoder bcrypt;
    
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
}
