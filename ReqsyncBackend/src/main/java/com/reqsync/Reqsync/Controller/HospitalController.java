package com.reqsync.Reqsync.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reqsync.Reqsync.Model.HospitalDataToJson;
import com.reqsync.Reqsync.Service.HospitalService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    @GetMapping("/data")
    public ResponseEntity<String> getHospitalData() {
        String url = "https://dshm.delhi.gov.in/mis/(S(atqnz1epevjntznia4gxtqri))/Private/frmFreeBedMonitoringReport.aspx";
        List<Map<String, String>> hospitalData = HospitalService.scrapeHospitalData(url);
       String response =  HospitalDataToJson.convertToJson(hospitalData);
       return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}