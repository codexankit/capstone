public class DocumentRequest {

    private Integer applicationNumber;   // FK from Application table
    private Integer customerId;          // FK from Customer table
    private String addressProofType;     // e.g. AADHAAR, VOTER_ID, etc.

    // Uploaded files
    private MultipartFile addressProof;
    private MultipartFile panProof;
    private MultipartFile incomeProof;

    // Getters & Setters
    public Integer getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(Integer applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getAddressProofType() {
        return addressProofType;
    }

    public void setAddressProofType(String addressProofType) {
        this.addressProofType = addressProofType;
    }

    public MultipartFile getAddressProof() {
        return addressProof;
    }

    public void setAddressProof(MultipartFile addressProof) {
        this.addressProof = addressProof;
    }

    public MultipartFile getPanProof() {
        return panProof;
    }

    public void setPanProof(MultipartFile panProof) {
        this.panProof = panProof;
    }

    public MultipartFile getIncomeProof() {
        return incomeProof;
    }

    public void setIncomeProof(MultipartFile incomeProof) {
        this.incomeProof = incomeProof;
    }
}
