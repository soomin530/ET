package edu.kh.project.myPage.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
	
	private int memberNo;
	private String receiverName;
    private String postcode;
    private String address;
    private String detailAddress;
    private String phone;
    private String extraPhone;

}
