@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;

    @Value("${upload.root:uploads}") // default to ./uploads if not set
    private String uploadRoot;

    public DocumentServiceImpl(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @Override
    public DocumentResponse createDocument(DocumentRequest request) throws IOException {
        // 1) Validate required inputs from UI (all three files are mandatory)
        if (request == null) throw new IllegalArgumentException("Request cannot be null");
        if (request.getApplicationNumber() == null) throw new IllegalArgumentException("applicationNumber is required");
        if (request.getCustomerId() == null) throw new IllegalArgumentException("customerId is required");
        if (!hasFile(request.getAddressProof())) throw new IllegalArgumentException("addressProof file is required");
        if (!hasFile(request.getPanProof()))      throw new IllegalArgumentException("panProof file is required");
        if (!hasFile(request.getIncomeProof()))   throw new IllegalArgumentException("incomeProof file is required");

        // 2) Prepare target dir: uploads/{applicationNumber}
        Path appDir = Path.of(uploadRoot, String.valueOf(request.getApplicationNumber()));
        Files.createDirectories(appDir);

        // 3) Save files with original names
        String addressProofPath = store(appDir, request.getAddressProof());
        String panProofPath     = store(appDir, request.getPanProof());
        String incomeProofPath  = store(appDir, request.getIncomeProof());

        // 4) Build & persist entity (initial statuses = "UPLOADED")
        Document doc = new Document();
        doc.setApplicationNumber(request.getApplicationNumber());
        doc.setCustomerId(request.getCustomerId());
        doc.setAddressProofType(request.getAddressProofType());

        doc.setAddressProofAddress(addressProofPath);
        doc.setPanAddress(panProofPath);
        doc.setIncomeProofAddress(incomeProofPath);

        doc.setAddressProofStatus("UPLOADED");
        doc.setPanStatus("UPLOADED");
        doc.setIncomeProofStatus("UPLOADED");

        Document saved = documentRepository.save(doc);

        // 5) Map to response
        DocumentResponse resp = new DocumentResponse();
        resp.setDocumentId(saved.getDocumentId());
        resp.setApplicationNumber(saved.getApplicationNumber());
        resp.setCustomerId(saved.getCustomerId());
        resp.setAddressProofType(saved.getAddressProofType());

        resp.setAddressProofPath(saved.getAddressProofAddress());
        resp.setPanProofPath(saved.getPanAddress());
        resp.setIncomeProofPath(saved.getIncomeProofAddress());

        resp.setAddressProofStatus(saved.getAddressProofStatus());
        resp.setPanProofStatus(saved.getPanStatus());
        resp.setIncomeProofStatus(saved.getIncomeProofStatus());

        return resp;
    }

    @Override
    public DocumentResponse getDocumentById(Integer documentId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + documentId));

        DocumentResponse resp = new DocumentResponse();
        resp.setDocumentId(doc.getDocumentId());
        resp.setApplicationNumber(doc.getApplicationNumber());
        resp.setCustomerId(doc.getCustomerId());
        resp.setAddressProofType(doc.getAddressProofType());

        resp.setAddressProofPath(doc.getAddressProofAddress());
        resp.setPanProofPath(doc.getPanAddress());
        resp.setIncomeProofPath(doc.getIncomeProofAddress());

        resp.setAddressProofStatus(doc.getAddressProofStatus());
        resp.setPanProofStatus(doc.getPanStatus());
        resp.setIncomeProofStatus(doc.getIncomeProofStatus());

        return resp;
    }

    // --- helpers ---
    private static boolean hasFile(MultipartFile f) {
        return f != null && !f.isEmpty();
    }

    private static String safeOriginalName(MultipartFile f) {
        String name = f.getOriginalFilename();
        name = (name == null) ? "file" : name;
        return StringUtils.getFilename(name); // strips any path info
    }

    private static String store(Path dir, MultipartFile file) throws IOException {
        String filename = safeOriginalName(file);
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return target.toString();
    }
}
