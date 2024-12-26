package edu.kh.project.member.model.dto;

import lombok.Data;

@Data
public class NaverUserInfo {
    private String id;
    private String nickname;
    private String name;
    private String email;
    private String gender;
    private String age;
    private String birthday;
    private String profile_image;
}