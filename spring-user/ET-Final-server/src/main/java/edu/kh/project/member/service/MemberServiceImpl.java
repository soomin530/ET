package edu.kh.project.member.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.model.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

	private final MemberMapper mapper;

	@Autowired
	private BCryptPasswordEncoder bcrypt;

	// 로그인 진행
	@Override
	public Member login(Member inputMember) {
		Member loginMember = mapper.login(inputMember.getMemberId());

		if (loginMember == null)
			return null;

		// 일치하지 않으면
		if (!bcrypt.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
			return null;
		}

		// 로그인 결과에서 비밀번호 제거
		loginMember.setMemberPw(null);

		return loginMember;
	}

	// 이메일 중복 체크
	@Override
	public int checkEmail(String memberEmail) {
		return mapper.checkEmail(memberEmail);
	}

	// 아이디 중복 체크
	@Override
	public int checkId(String memberId) {
		return mapper.checkId(memberId);
	}

	// 닉네임 중복체크
	@Override
	public int checkNickname(String memberNickname) {
		return mapper.checkNickname(memberNickname);
	}
	
	// 전화번호 중복체크
	@Override
	public int checkTel(String memberTel) {
		return mapper.checkTel(memberTel);
	}

	// 회원가입 서비스
	@Override
	public int signup(Member inputMember, String[] memberAddress) {
		// 주소가 입력된 경우
		if (!inputMember.getMemberAddress().equals(",,")) {

			String address = String.join("^^^", memberAddress);
			inputMember.setMemberAddress(address);

		} else {
			// 주소가 입력되지 않은 경우
			inputMember.setMemberAddress(null); // null 저장
		}

		String encPw = bcrypt.encode(inputMember.getMemberPw());
		inputMember.setMemberPw(encPw);

		// 회원 가입 매퍼 메서드 호출
		return mapper.signup(inputMember);
	}
	
	// 네이버 로그인
	@Override
	public Member loginNaver(Member naverMember) {
        
        // 기존 네이버 회원인지 조회
        Member existingMember = mapper.selectNaverMember(naverMember.getMemberId());
        
        if(existingMember == null) {
        	String encPw = bcrypt.encode(naverMember.getMemberPw());
        	naverMember.setMemberPw(encPw);
            // 새로운 네이버 회원인 경우 회원가입 처리
            mapper.insertNaverMember(naverMember);
            
            Member searchMember = mapper.selectNaverMember(naverMember.getMemberId());
            naverMember.setMemberNo(searchMember.getMemberNo());
            
            return naverMember;
        }
        
        return existingMember;
    }

	
	// 이메일로 회원 아이디 조회
	@Override
	public Member findByEmail(String email) {
		return mapper.findByEmail(email);
	}
	
	
	// 이메일 아이디로 회원 정보 조회
	@Override
	public Member findByIdAndEmail(Map<String, Object> paramMap) {
		return mapper.findByIdAndEmail(paramMap);
	}
	
	
	// 비밀번호 수정
	@Override
	public int updatePassword(int memberNo, String password) {
		
		Map<String, Object> paramMap = new HashMap<>();
		
		String encPw = bcrypt.encode(password);
		
		paramMap.put("encPw", encPw);
		paramMap.put("memberNo", memberNo);
		
		return mapper.updatePassword(paramMap);
	}
	
	
	// 관리자 전용
	@Override
	public Member findAdminByEmail(String memberEmail, String memberNo) {
		Map<String, Object> paramMap = new HashMap<>();
		
		paramMap.put("memberEmail", memberEmail);
		paramMap.put("memberNo", memberNo);
		
		return mapper.findAdminByEmail(paramMap);
	}

	
	// 비밀번호 체크
	@Override
	public boolean checkPreviousPassword(String memberNo, String newPassword) {
		// 토큰에서 회원 정보 추출
        if (memberNo == null) {
        	return false;
        }

        // 이전 비밀번호 이력 조회
        String previousPasswords = mapper.selectPreviousPasswords(memberNo);

        return bcrypt.matches(newPassword, previousPasswords);
	}

}
