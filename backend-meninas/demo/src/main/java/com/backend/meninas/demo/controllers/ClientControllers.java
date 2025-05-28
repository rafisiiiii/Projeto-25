package com.backend.meninas.demo.controllers;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.backend.meninas.demo.controllers.dtos.ClientControllerDtos;
import com.backend.meninas.demo.helpers.exceptions.NotFoundException;
import com.backend.meninas.demo.services.ClientServices;
import com.backend.meninas.demo.services.dtos.ClientServiceDTOs;
import com.backend.meninas.demo.services.ReportServices;



import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/client")
public class ClientControllers {
    
    @Autowired
    ClientServices clientServices;

    private final ReportServices reportServices;

    public ClientControllers(ReportServices reportServices) {
        this.reportServices = reportServices;
    }

    @GetMapping("/report")
    public ResponseEntity<ByteArrayResource> generateReport() throws IOException {
        byte[] excelBytes = reportServices.generateClientsReportExcel();
        ByteArrayResource resource = new ByteArrayResource(excelBytes);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_clientes.xlsx");
        headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(excelBytes.length));

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }


    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody ClientControllerDtos.RegisterDto dto, HttpServletRequest request) {
        try{
            var authorId = UUID.fromString(request.getAttribute("userId").toString());
            var clientServiceDto = new ClientServiceDTOs.RegisterClientDTO(
                dto.getName(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getHomepage(),  
                dto.getAreaCode(),
                dto.getTaxId(),
                dto.getTradeName(),
                dto.getOpeningDate(),
                dto.getType(),
                dto.getAddress(),
                dto.getState(),
                dto.getNeighborhood(),
                dto.getCity(),
                dto.getCityCode(),
                dto.getCountry(),
                dto.getZipCode(),
                dto.getStoreCode(),
                authorId
            );

            this.clientServices.register(clientServiceDto);
            return ResponseEntity.ok().build();
        }catch(Exception e) {
            if(e instanceof NotFoundException){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        }
    }

    @PatchMapping("/{code}")
    public ResponseEntity<Object> update(@Valid @RequestBody ClientControllerDtos.UpdateDto dto, @PathVariable(value = "code") String code) {

        try{
            var toServiceDto = new ClientServiceDTOs.UpdateClientDTO(
                code, 
                dto.getName(), 
                dto.getEmail(), 
                dto.getPhone(), 
                dto.getHomepage(), 
                dto.getAreaCode(),
                dto.getAddress(),
                dto.getState(),
                dto.getNeighborhood(),
                dto.getCity(),
                dto.getCountry(),
                dto.getCityCode(),
                dto.getZipCode()
            );

            this.clientServices.update(toServiceDto);
            return ResponseEntity.ok().build();

        }catch(Exception e){
            if(e instanceof NotFoundException){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        var result = this.clientServices.listClients();
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Object> delete(@PathVariable(value = "code") String code) {
        try{
            this.clientServices.deleteClient(code);
            return ResponseEntity.ok().build();
        }catch(Exception e) {
            if(e instanceof NotFoundException){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }



}
