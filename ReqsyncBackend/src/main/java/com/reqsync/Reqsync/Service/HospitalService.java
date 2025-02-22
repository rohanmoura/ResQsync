package com.reqsync.Reqsync.Service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.reqsync.Reqsync.CustomException.NoHeader;
import com.reqsync.Reqsync.CustomException.NoRowsFound;
import com.reqsync.Reqsync.CustomException.NoTableFound;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.RuntimeErrorException;

public class HospitalService {

    public static List<Map<String, String>> scrapeHospitalData(String url) {
        List<Map<String, String>> hospitalData = new ArrayList<>();

        try {
            // Fetch the HTML page
            Document document = Jsoup.connect(url).get();

            // Locate the table (adjust the selector based on the actual HTML structure)
            Element table = document.select("table").first();
            if (table != null) {
                // Extract table headers (column names)
                Elements headers = table.select("tr th"); // Adjust if headers are in a different structure
                List<String> columnNames = new ArrayList<>();
                if (!headers.isEmpty()) {
                    for (Element header : headers) {
                        columnNames.add(header.text());
                    }
                } else {
                    throw new NoHeader("No headers found in the table.");
                   
                }

                // Extract table rows
                Elements rows = table.select("tr"); // Adjust if rows are in a different structure
                if (!rows.isEmpty()) {
                    for (Element row : rows) {
                        Elements columns = row.select("td");
                        if (!columns.isEmpty() && columns.size() == columnNames.size()) {
                            Map<String, String> rowData = new HashMap<>();
                            for (int i = 0; i < columns.size(); i++) {
                                rowData.put(columnNames.get(i), columns.get(i).text());
                            }
                            hospitalData.add(rowData);
                        }
                    }
                } else {
                	 throw new NoRowsFound("No rows found in the table.");
                }
            } else {
            	throw new NoTableFound("No table found on the page.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return hospitalData;
    }
}