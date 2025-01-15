package edu.kh.admin.main.model.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.admin.main.model.dto.DashboardData;
import edu.kh.admin.main.model.mapper.AdminMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class AdminServiceImpl implements AdminService{

		private final AdminMapper mapper;

		@Override
		public List<DashboardData> getData() {
			
			int totalMember = mapper.memberCount();
			int performanceNow = mapper.performanceNowCount();
			int newInquiry = mapper.newInquiryCount();
			int newEnroll = mapper.newEnrollCount();
			
			 // 2. 데이터를 String으로 변환
	        String totalMemberStr = String.valueOf(totalMember);
	        String performanceNowStr = String.valueOf(performanceNow);
	        String newInquiryStr = String.valueOf(newInquiry);
	        String newEnrollStr = String.valueOf(newEnroll);

	        // 3. DashboardData 객체 생성 및 값 설정
	        DashboardData dashboardData = new DashboardData();
	        dashboardData.setTotalMember(totalMemberStr);
	        dashboardData.setPerformanceNow(performanceNowStr);
	        dashboardData.setNewInquiry(newInquiryStr);
	        dashboardData.setNewEnroll(newEnrollStr);

	        // 4. 리스트 생성 및 추가
	        List<DashboardData> dataList = new ArrayList<>();
	        dataList.add(dashboardData);

	        // 5. 반환
	        return dataList;
		}

	
}
