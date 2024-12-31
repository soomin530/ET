package edu.kh.project.member.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.model.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
		// 암호화 진행
		String bcryptPassword = bcrypt.encode(inputMember.getMemberPw());

		// 1. 아이디 일치하면서 탈퇴하지 않은 회원 조회
		Member loginMember = mapper.login(inputMember.getMemberId());

		// 2. 만약에 일치하는 아이디가 없어서 조회 결과가 null 인 경우
		if (loginMember == null)
			return null;

		// 3. 입력 받은 비밀번호(평문 : inputMember.getMemberPw())와
		// 암호화된 비밀번호(loginMember.getMemberPw())
		// 두 비밀번호가 일치하는지 확인

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
            return naverMember;
        }
        
        return existingMember;
    }

	@Override
	public void insertVenue(Map<String, Object> venue) {
		mapper.insertVenue(venue);
	}

	@Override
	public void insertPerf(Map<String, Object> perfMap) {
		mapper.insertPerf(perfMap);
	}

	@Override
	public void insertPerfTime(Map<String, Object> perfTime) {
		mapper.insertPerfTime(perfTime);
	}

	@Override
	public void insertTicketInto(Map<String, Object> ticketInfo) {
		mapper.insertTicketInto(ticketInfo);
	}

	@Override
	public List<Map<String, String>> performanceDetails() {
		return mapper.performanceDetails();
	}

	@Override
	public void insertVenueSeat(Map<String, Object> seat) {
		mapper.insertVenueSeat(seat);
	}

}
