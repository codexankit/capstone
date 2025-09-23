package com.scb.creditcardapp.controllers;

import com.scb.creditcardapp.dto.ApplicationDashboardDto;
import com.scb.creditcardapp.dto.ApplicationRequest;
import com.scb.creditcardapp.dto.ApplicationResponse;
import com.scb.creditcardapp.entities.Application;
import com.scb.creditcardapp.entities.enums.ApplicationStatus;
import com.scb.creditcardapp.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // ===== Dashboard listing with sorting =====
    /*@GetMapping
    public ResponseEntity<List<ApplicationDashboardDto>> getApplications(
            @RequestParam(defaultValue = "applicationNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        // Normalize direction and validate sortBy
        String direction = sortDirection.equalsIgnoreCase("desc") ? "DESC" : "ASC";
        if (!sortBy.equals("applicationNumber") &&
                !sortBy.equals("creationDate") &&
                !sortBy.equals("applicationStatus")) {
            sortBy = "applicationNumber";
        }

        List<ApplicationDashboardDto> applications =
                applicationService.getAllApplicationsForDashboard(sortBy, direction);
        return ResponseEntity.ok(applications);
    }*/

    @GetMapping
    public ResponseEntity<List<ApplicationDashboardDto>> getAllApplications() {
        List<ApplicationDashboardDto> applications = applicationService.getAllApplicationsForDashboard();
        return ResponseEntity.ok(applications);
    }

    // ===== Create a new application =====
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(@RequestBody ApplicationRequest request) {
        // Default status to PENDING if not provided
        ApplicationStatus status = request.getApplicationStatus() == null
                ? ApplicationStatus.PENDING
                : ApplicationStatus.valueOf(request.getApplicationStatus().toUpperCase());
        System.out.println("Application Status:"+status);
        // Delegate creation to the service layer — service sets creationDate and deletedAt=null
        Application savedApp = applicationService.createApplication(
                request.getCustomerId(),
                request.getProductId(),
                request.getStaffId(),
                status
        );
        System.out.println("Cust Id: "+request.getCustomerId());
        System.out.println("Prod Id: "+request.getProductId());
        System.out.println("Staf Id: "+request.getStaffId());

        // Map entity → response DTO
        System.out.println("-------RESPONSE---------");
        System.out.println("Application Number: "+savedApp.getApplicationNumber());
        System.out.println("Application Status: "+savedApp.getApplicationStatus());
        System.out.println("Creation Date: "+savedApp.getCreationDate());
        System.out.println("Deleted At:"+savedApp.getDeletedAt());
        System.out.println("Cust Id: "+savedApp.getCustomer());
        System.out.println("Prod Id: "+savedApp.getProduct());
        System.out.println("Staf Id: "+savedApp.getStaff());
        ApplicationResponse response = new ApplicationResponse(
                savedApp.getApplicationNumber(),
                savedApp.getApplicationStatus(),
                savedApp.getCreationDate(),
                savedApp.getDeletedAt(),
                savedApp.getCustomer().getCustomerId(),
                savedApp.getProduct().getProductId(),
                savedApp.getStaff().getBankid()
        );

        return ResponseEntity.ok(response);
    }

    // ===== Get application by applicationNumber =====
    @GetMapping("/{applicationNumber}")
    public ResponseEntity<ApplicationResponse> getApplicationByNumber(@PathVariable Integer applicationNumber) {
        Application app = applicationService.getApplicationByNumber(applicationNumber);

        ApplicationResponse response = new ApplicationResponse(
                app.getApplicationNumber(),
                app.getApplicationStatus(),
                app.getCreationDate(),
                app.getDeletedAt(),
                app.getCustomer().getCustomerId(),
                app.getProduct().getProductId(),
                app.getStaff().getBankid()
        );
        return ResponseEntity.ok(response);
    }

    // ===== Update application details or status =====
    @PutMapping("/{applicationNumber}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Integer applicationNumber,
            @RequestBody Application updated) {
        Application app = applicationService.updateApplication(applicationNumber, updated);
        return ResponseEntity.ok(app);
    }

    // ===== Soft delete (mark deleted_at) =====
    @DeleteMapping("/{applicationNumber}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Integer applicationNumber) {
        applicationService.softDeleteApplication(applicationNumber, LocalDateTime.now());
        return ResponseEntity.noContent().build();
    }
}
