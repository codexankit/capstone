package com.scb.axessspringboottraining.controller;

import com.scb.axessspringboottraining.dto.DocumentRequest;
import com.scb.axessspringboottraining.dto.DocumentResponse;
import com.scb.axessspringboottraining.entities.Document;
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
     * POST /api/documents
     * Create a new Document. Accepts form-data with files.
     *
     * Note:
     *  - Service returns Document (entity). We map it to DocumentResponse here.
     *  - If your DocumentRequest adds status fields, you can set them to "UPLOADED" below.
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

            // If your DocumentRequest has these fields, you can keep them;
            // if not, remove these three lines (service can set defaults).
            // request.setAddressProofStatus("UPLOADED");
            // request.setPanProofStatus("UPLOADED");
            // request.setIncomeProofStatus("UPLOADED");

            // Service returns entity
            Document saved = documentService.createDocument(request);

            // Map entity -> response DTO
            DocumentResponse resp = toResponse(saved);

            return new ResponseEntity<>(resp, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * GET /api/documents/{id}
     * Retrieve a Document by id. Maps entity → response DTO.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable("id") Integer documentId) {
        try {
            // Service returns entity
            Document doc = documentService.getDocumentById(documentId);

            // Map entity -> response DTO
            DocumentResponse resp = toResponse(doc);

            return new ResponseEntity<>(resp, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- Mapper: Document entity -> DocumentResponse DTO ---
    private static DocumentResponse toResponse(Document d) {
        DocumentResponse resp = new DocumentResponse();
        resp.setDocumentId(d.getDocumentId());
        resp.setApplicationNumber(d.getApplicationNumber());
        resp.setCustomerId(d.getCustomerId());
        resp.setAddressProofType(d.getAddressProofType());

        resp.setAddressProofPath(d.getAddressProofAddress());
        resp.setPanProofPath(d.getPanAddress());
        resp.setIncomeProofPath(d.getIncomeProofAddress());

        resp.setAddressProofStatus(d.getAddressProofStatus());
        resp.setPanProofStatus(d.getPanStatus());
        resp.setIncomeProofStatus(d.getIncomeProofStatus());
        return resp;
    }
}
