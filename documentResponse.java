public class DocumentResponse {

    private Integer documentId;          // PK of document table
    private Integer applicationNumber;   // FK
    private Integer customerId;          // FK
    private String addressProofType;

    // Stored file paths (not actual files)
    private String addressProofPath;
    private String panProofPath;
    private String incomeProofPath;

    // Status of each document (e.g., UPLOADED / VERIFIED)
    private String addressProofStatus;
    private String panProofStatus;
    private String incomeProofStatus;

    // Getters & Setters
    public Integer getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Integer documentId) {
        this.documentId = documentId;
    }

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

    public String getAddressProofPath() {
        return addressProofPath;
    }

    public void setAddressProofPath(String addressProofPath) {
        this.addressProofPath = addressProofPath;
    }

    public String getPanProofPath() {
        return panProofPath;
    }

    public void setPanProofPath(String panProofPath) {
        this.panProofPath = panProofPath;
    }

    public String getIncomeProofPath() {
        return incomeProofPath;
    }

    public void setIncomeProofPath(String incomeProofPath) {
        this.incomeProofPath = incomeProofPath;
    }

    public String getAddressProofStatus() {
        return addressProofStatus;
    }

    public void setAddressProofStatus(String addressProofStatus) {
        this.addressProofStatus = addressProofStatus;
    }

    public String getPanProofStatus() {
        return panProofStatus;
    }

    public void setPanProofStatus(String panProofStatus) {
        this.panProofStatus = panProofStatus;
    }

    public String getIncomeProofStatus() {
        return incomeProofStatus;
    }

    public void setIncomeProofStatus(String incomeProofStatus) {
        this.incomeProofStatus = incomeProofStatus;
    }
}
