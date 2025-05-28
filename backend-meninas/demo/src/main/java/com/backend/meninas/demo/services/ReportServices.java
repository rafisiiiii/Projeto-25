package com.backend.meninas.demo.services;

import com.backend.meninas.demo.domain.entities.Client;
import com.backend.meninas.demo.repositories.JpaClientRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ReportServices {

    private final JpaClientRepository clientRepository;

    public ReportServices(JpaClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public byte[] generateClientsReportExcel() throws IOException {
        List<Client> clients = clientRepository.findAll(); // Busca todos os clientes

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Clientes");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Código", "Nome", "Razão Social/Nome Fantasia", "CPF/CNPJ", "Tipo", "Endereço", "Cidade", "Estado", "Email", "Telefone"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Client client : clients) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(client.getId().toString()); 
                row.createCell(1).setCellValue(client.getCode());
                row.createCell(2).setCellValue(client.getName());
                row.createCell(3).setCellValue(client.getTradeName() != null ? client.getTradeName() : client.getName());
                row.createCell(4).setCellValue(client.getTaxId());
                row.createCell(5).setCellValue(client.getType());
                row.createCell(6).setCellValue(client.getAddress());
                row.createCell(7).setCellValue(client.getCity());
                row.createCell(8).setCellValue(client.getState());
                row.createCell(9).setCellValue(client.getEmail());
                String fullPhone = (client.getAreaCode() != null ? "(" + client.getAreaCode() + ") " : "") +
                                   (client.getPhone() != null ? client.getPhone() : "");
                row.createCell(10).setCellValue(fullPhone.isEmpty() ? "N/A" : fullPhone);

                for (int i = 0; i < headers.length; i++) {
                    sheet.autoSizeColumn(i);
                }
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
