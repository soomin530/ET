package edu.kh.project.myPage.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddressDTO {
	
	private int memberNo;
	private String receiverName;
    private String postcode;
    private String address;
    private String detailAddress;
    private String phone;
    private String extraPhone;
    private String basicAddress; // "Y" 또는 "N"

}
