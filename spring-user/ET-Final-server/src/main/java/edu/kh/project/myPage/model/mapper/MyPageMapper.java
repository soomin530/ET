package edu.kh.project.myPage.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MyPageMapper {
    
    /** 암호화된 비밀번호 조회
     * @param memberNo
     * @return encPw
     */
    String selectEncPw(int memberNo);
}
