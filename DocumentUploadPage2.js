import React, { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Box,
  Container,
  Heading,
  Text,
  Divider,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Select
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import CustomStepper from "../components/CustomStepper";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";



const DocumentUploadPage = () => {



  // useLocation gives us the location objects of the current page
  // and one of the location object is "state"
  // state - this gives us the extra data passed while navigating
  const { state } = useLocation();

  // access the forwarded values from the previous page, i.e, credit offer page
  const customer = state?.customerData;
  const customerId = state?.customerId;
  const productData = state?.productData;

  // --- files state ---
  
  const [files, setFiles] = useState({ addressProof: null, pan: null, income: null});
  const [addressProofType, setAddressProofType] = useState("aadhar");
  
  const addressProofRef = useRef(null);
  const panRef = useRef(null);
  const incomeRef = useRef(null);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0] ?? null;
    setFiles((p) => ({ ...p, [key]: file }));
  };

  const handleReset = () => {
    setFiles({ addressProof: null, pan: null, income: null });
    setAddressProofType("");
    if (addressProofRef.current) addressProofRef.current.value = "";
    if (panRef.current) panRef.current.value = "";
    if (incomeRef.current) incomeRef.current.value = "";
    toast({ title: "Cleared", status: "info", duration: 1500, isClosable: true });
  };

  const handlePrev = () => {
    navigate('/CreditOfferPage');
  };

  const handlePreview = () => {
    onOpen();
  };

  // -------------------------------Save Customer to DB-------------------------------
  const saveCustomer = async (customerData) => {
    try {
      const response = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) throw new Error("Failed to save customer");
      return await response.json(); // returns saved customer
    } catch (err) {
      console.error("Error saving customer:", err);
      return null;
    }
  };

  // --- SAVE PRODUCT TO DB ---
  const saveProduct = async (productData) => {
    try {
      const response = await fetch("http://localhost:8080/api/selections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to save product");
      return await response.json(); // returns saved product
    } catch (err) {
      console.error("Error saving product:", err);
      return null;
    }
  };
  
    // --- SAVE APPLICATION TO DB ---
  const saveApplication = async (applicationPayload) => {
    try {
      console.log("Application Payload:"+applicationPayload);
      console.log("Status:"+applicationPayload.applicationStatus);
        console.log(applicationPayload.creationDate);
        console.log(applicationPayload.deletedAt);
        console.log(applicationPayload.customerId);
        console.log(applicationPayload.productId);
        console.log(applicationPayload.staffId);

      const response = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationPayload),
      });
      if (!response.ok) throw new Error("Failed to save application");
      return await response.json();
    } catch (err) {
      console.error("Error saving application:", err);
      return null;
    }
  };  
 

  const handleSubmit = async () => {
    try {
      // --- Insert customer first ---
      const savedCustomer = await saveCustomer(customer);
      if (!savedCustomer) {
        toast({ title: "Failed to save customer", status: "error", duration: 2000, isClosable: true });
        return;
      }
  
      // --- Insert product---
      const productPayload = { ...productData, customerId: savedCustomer.customerId };
      const savedProduct = await saveProduct(productPayload);
      if (!savedProduct) {
        toast({ title: "Failed to save product", status: "error", duration: 2000, isClosable: true });
        return;
      }

       // 3️. Save application (link customer & product)
      const appPayload = {
        applicationStatus: "pending",
        creationDate: new Date().toISOString(),
        deletedAt: null,
        customerId: savedCustomer.customerId,
        productId: savedProduct.productId,
        staffId: user?.id, // from logged-in user context
      };
      const savedApp = await saveApplication(appPayload);
      if (!savedApp) {
        toast({ title: "Failed to save application", status: "error", duration: 2000, isClosable: true });
        return;
      }
//      else { 
        // --- After successful inserts ---
        toast({ title: "Application submitted", status: "success", duration: 1800, isClosable: true });
        onClose();
        navigate("/dashboard", { state: { customerData: savedCustomer, productData: savedProduct } });
//      }
    } catch (err) {
      console.error("Submit error:", err);
      toast({ title: "Submission failed", status: "error", duration: 2000, isClosable: true });
    }
  };
  
 /* const handleSubmit = () => {
    toast({ title: "Application submitted", status: "success", duration: 1800, isClosable: true });
    onClose();
    navigate("/dashboard", { state: { customerData: customer, customerId}});
  };*/

  // creating object URLs for current files (so that the "View" can open them in a new tab)
  const previewUrls = useMemo(() => {
    const make = (f) => (f ? URL.createObjectURL(f) : null);
    return {
      addressProof: make(files.addressProof),
      pan: make(files.pan),      
      income: make(files.income),
    };
  }, [files]);

  const allFilesChosen = !!(files.addressProof && files.pan && files.income);

  const { user, isAuthenticated} = useUser()

  useEffect(()=>
  {
      
      if(!isAuthenticated){
          console.log(user)
          navigate('/')
      }
      if(isAuthenticated){
        console.log(user);
        console.log("Customer Data:", customer);      
        console.log("Product Data:", productData);    
      }
  },[])
  

  return (
    <>
      <Navbar />

      {/* Progress line */}
      <Container maxW="5xl" pt={6} pb={2}>
        <CustomStepper currentStep={2} /> {/* 0-based index: 0=Step1, 1=Step2, 2=Step3 */}
        </Container>

      {/* Card */}
      <Container maxW="6xl" pb={10}>
        <Box maxW="5xl" mx="auto" bg="white" rounded="xl" boxShadow="xl" p={{ base: 6, md: 8 }}>
          <Heading size="md" mb={2}>
            Step 3: <Text as="span" fontWeight="semibold">Documents Upload</Text>
          </Heading>

          <Divider my={4} />

          <Stack spacing={5}>
          <FormControl isRequired>
            <FormLabel>Select Address Proof</FormLabel>
            <Select
              value={addressProofType}
              onChange={(e) => setAddressProofType(e.target.value)}
              >
              <option value="aadhar"> Aadhar Card</option>
              <option value="voter"> Voter Card</option>
              <option value="passport"> Passport</option>
            </Select>
            <FormLabel mt={5} mb={0}>Upload Address Proof</FormLabel>
            <Input
              mt={2}
              ref={addressProofRef}
              type="file"
              accept=".pdf, .png, .jpg, .jpeg"
              isDisabled={!addressProofType}
              title={!addressProofType ? "Please select the Address Proof type first" : ""}
              borderColor={!addressProofType ? "red.300" : "gray.300"}
              _hover={{ borderColor: !addressProofType ? "red.400" : "blue.400" }}
              _disabled={{ opacity: 0.7, cursor: "not-allowed"}}
              onChange={(e) => handleFileChange("addressProof", e)}
            />
          </FormControl>

            <FormControl isRequired>
              <FormLabel >Upload PAN Card</FormLabel>
              <Input
                ref={panRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange("pan", e)}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Upload Income Proof</FormLabel>
              <Input
                ref={incomeRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange("income", e)}
              />
            </FormControl>
          
          
          </Stack>

          <HStack mt={8} justify="space-between">
            <HStack>
              <Button colorScheme="scbBlue" onClick={handlePrev}>Previous</Button>
              <Button colorScheme="scbBlue" onClick={handleReset}>Reset</Button>
            </HStack>

            <Button colorScheme="scbGreen" onClick={handlePreview} isDisabled={!allFilesChosen}>
              Preview
            </Button>
          </HStack>
        </Box>
      </Container>

      {/* Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent rounded="xl">
          <ModalHeader>Credit Card Application Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Tbody>
                {/*<Tr><Th>Customer ID</Th><Td>{app.customerId}</Td></Tr>*/}
                <Tr><Th>Customer ID</Th><Td>{customer.customerId}</Td></Tr>
                <Tr><Th>Creation Date</Th><Td>{customer.creationDate}</Td></Tr>
                <Tr><Th>Full Name</Th><Td>{customer.fullName}</Td></Tr>
                <Tr><Th>Date of Birth</Th><Td>{customer.dob}</Td></Tr>
                <Tr><Th>Customer Type</Th><Td>{customer.customerType}</Td></Tr>
                <Tr><Th>Email</Th><Td>{customer.email}</Td></Tr>
                <Tr><Th>Contact Number</Th><Td>{customer.contact}</Td></Tr>
                <Tr><Th>Address Line 1</Th><Td>{customer.addr1}</Td></Tr>
                <Tr><Th>Address Line 2</Th><Td>{customer.addr2}</Td></Tr>
                <Tr><Th>Address Line 3</Th><Td>{customer.addr3}</Td></Tr>
                <Tr><Th>Address Line 4</Th><Td>{customer.addr4}</Td></Tr>
                <Tr><Th>City</Th><Td>{customer.city}</Td></Tr>
                <Tr><Th>State</Th><Td>{customer.state}</Td></Tr>
                <Tr><Th>Pincode</Th><Td>{customer.pincode}</Td></Tr>
                <Tr><Th>Country</Th><Td>{customer.country}</Td></Tr>
                <Tr><Th>Aadhar Number</Th><Td>{customer.aadhar}</Td></Tr>
                <Tr><Th>Pan Number</Th><Td>{customer.pan}</Td></Tr>
                {<Tr><Th>Monthly Income</Th><Td>{customer.income}</Td></Tr>}
                {/* Files rows with "View" buttons */}
                <Tr>
                  <Th>PAN CARD</Th>
                  <Td>
                    <Button
                        leftIcon={<ViewIcon />}
                        size="sm"
                        colorScheme="scbBlue"
                        variant="solid"
                        isDisabled={!previewUrls.pan}
                        onClick={() => previewUrls.pan && window.open(previewUrls.pan, "_blank")}
                        >
                        View
                    </Button>

                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {`ADDRESS PROOF${addressProofType ? ` (${addressProofType.toUpperCase()})` : ""}`}
                  </Th>
                  <Td>
                    <Button
                        leftIcon={<ViewIcon />}
                        size="sm"
                        colorScheme="scbBlue"
                        variant="solid"
                        isDisabled={!previewUrls.addressProof}
                        onClick={() => previewUrls.addressProof && window.open(previewUrls.addressProof, "_blank")}
                        >
                        View
                    </Button>

                  </Td>
                </Tr>
                <Tr>
                  <Th>INCOME PROOF</Th>
                  <Td>
                    <Button
                      leftIcon={<ViewIcon />}
                      size="sm"
                      colorScheme="scbBlue"
                      variant="solid"
                      isDisabled={!previewUrls.income}
                      onClick={() => previewUrls.income && window.open(previewUrls.income, "_blank")}
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>

          <ModalFooter gap={3}>
            {/*<Button colorScheme="scbBlue" onClick={onClose}>Edit</Button>*/}
            <Button colorScheme="scbBlue" onClick={handleSubmit} isDisabled={!allFilesChosen}>
              Submit
            </Button>
            <Button colorScheme="scbGreen" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DocumentUploadPage;
