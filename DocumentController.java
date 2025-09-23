package com.scb.axessspringboottraining.controller;

import com.scb.axessspringboottraining.dto.DocumentRequest;
import com.scb.axessspringboottraining.dto.DocumentResponse;
import com.scb.axessspringboottraining.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /**
     * Endpoint to create a new Document.
     *
     * Expects:
     *   - applicationNumber
     *   - customerId
     *   - addressProofType
     *   - addressProof, panProof, incomeProof (all MultipartFile, required)
     *
     * Sets statuses as "UPLOADED" by default.
     */
    @PostMapping
    public ResponseEntity<DocumentResponse> createDocument(
            @RequestParam("applicationNumber") Integer applicationNumber,
            @RequestParam("customerId") Integer customerId,
            @RequestParam("addressProofType") String addressProofType,
            @RequestParam("addressProof") MultipartFile addressProof,
            @RequestParam("panProof") MultipartFile panProof,
            @RequestParam("incomeProof") MultipartFile incomeProof
    ) {
        try {
            // Build request DTO
            DocumentRequest request = new DocumentRequest();
            request.setApplicationNumber(applicationNumber);
            request.setCustomerId(customerId);
            request.setAddressProofType(addressProofType);
            request.setAddressProof(addressProof);
            request.setPanProof(panProof);
            request.setIncomeProof(incomeProof);

            // Set default statuses
            request.setAddressProofStatus("UPLOADED");
            request.setPanProofStatus("UPLOADED");
            request.setIncomeProofStatus("UPLOADED");

            DocumentResponse response = documentService.createDocument(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint to fetch Document by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable("id") Integer documentId) {
        try {
            DocumentResponse response = documentService.getDocumentById(documentId);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
