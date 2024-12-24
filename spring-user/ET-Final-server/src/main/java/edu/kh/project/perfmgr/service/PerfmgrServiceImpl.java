package edu.kh.project.perfmgr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.perfmgr.model.dto.PerfMgr;
import edu.kh.project.perfmgr.model.mapper.PerfmgrMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PerfmgrServiceImpl implements PerfmgrService {

	private final PerfmgrMapper mapper;

	@Autowired
	private BCryptPasswordEncoder bcrypt;

	// 로그인 진행
	@Override
	public PerfMgr login(PerfMgr inputMember) {
		// 암호화 진행

		String bcryptPassword = bcrypt.encode(inputMember.getConcertManagerPw());

		// 1. 아이디가 일치하면서 탈퇴하지 않은 회원 조회
		PerfMgr loginMember = mapper.login(inputMember.getConcertManagerId());

		// 2. 만약에 일치하는 아이디가 없어서 조회 결과가 null 인 경우
		if (loginMember == null)
			return null;

		// 3. 입력 받은 비밀번호(평문 : inputMember.getMemberPw())와
		// 암호화된 비밀번호(loginMember.getMemberPw())
		// 두 비밀번호가 일치하는지 확인

		// 일치하지 않으면
		if (!bcrypt.matches(inputMember.getConcertManagerPw(), loginMember.getConcertManagerPw())) {
			return null;
		}

		// 로그인 결과에서 비밀번호 제거
		loginMember.setConcertManagerPw(null);

		return loginMember;
	}

	// 이메일 중복 체크
	@Override
	public int checkEmail(String concertManagerEmail) {
		return mapper.checkEmail(concertManagerEmail);
	}

	// 아이디 중복 체크
	@Override
	public int checkId(String concertManagerId) {
		return mapper.checkId(concertManagerId);
	}

	// 닉네임 중복체크
	@Override
	public int checkNickname(String concertManagerNickname) {
		return mapper.checkNickname(concertManagerNickname);
	}

	// 회원가입 서비스
	@Override
	public int signup(PerfMgr inputMember) {
		String encPw = bcrypt.encode(inputMember.getConcertManagerPw());
		inputMember.setConcertManagerPw(encPw);
	
		// 회원 가입 매퍼 메서드 호출
		return mapper.signup(inputMember);
	}
	
}
