import React, { useRef, useState, useMemo } from "react";
import Navbar from "../components/Navbar/Navbar";
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
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import CustomStepper from "../components/Stepper/CustomStepper";


const DocumentUploadPage = () => {
  const app = {
    customerId: "abc3",
    fullName: "abcs",
    dob: "1999-06-09",
    address: "chennai",
    contact: "9876543212",
    aadharNo: "765435678965",
    panNo: "HHYPP8803T",
    email: "a@a.com",
    monthlyIncome: "6000000",
    product: "Gold",
  };

  // --- files state ---
  const [files, setFiles] = useState({ aadhar: null, pan: null, income: null });

  const aadharRef = useRef(null);
  const panRef = useRef(null);
  const incomeRef = useRef(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0] ?? null;
    setFiles((p) => ({ ...p, [key]: file }));
  };

  const handleReset = () => {
    setFiles({ aadhar: null, pan: null, income: null });
    if (aadharRef.current) aadharRef.current.value = "";
    if (panRef.current) panRef.current.value = "";
    if (incomeRef.current) incomeRef.current.value = "";
    toast({ title: "Cleared", status: "info", duration: 1500, isClosable: true });
  };

  const handlePrev = () => {
    // wire to our stepper/router later
    console.log("Prev clicked");
  };

  const handlePreview = () => {
    onOpen();
  };

  const handleSubmit = () => {
    // TODO: call the backend API with `files` + form data
    toast({ title: "Application submitted", status: "success", duration: 1800, isClosable: true });
    onClose();
  };

  // creating object URLs for current files (so that the "View" can open them in a new tab)
  const previewUrls = useMemo(() => {
    const make = (f) => (f ? URL.createObjectURL(f) : null);
    return {
      pan: make(files.pan),
      aadhar: make(files.aadhar),
      income: make(files.income),
    };
  }, [files]);

  const allFilesChosen = !!(files.aadhar && files.pan && files.income);

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
              <FormLabel>Upload Aadhar Card</FormLabel>
              <Input
                ref={aadharRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange("aadhar", e)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Upload PAN Card</FormLabel>
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
                <Tr><Th>Customer ID</Th><Td>{app.customerId}</Td></Tr>
                <Tr><Th>Full Name</Th><Td>{app.fullName}</Td></Tr>
                <Tr><Th>Date of Birth</Th><Td>{app.dob}</Td></Tr>
                <Tr><Th>Address</Th><Td>{app.address}</Td></Tr>
                <Tr><Th>Contact Number</Th><Td>{app.contact}</Td></Tr>
                <Tr><Th>Aadhar Number</Th><Td>{app.aadharNo}</Td></Tr>
                <Tr><Th>PAN Card Number</Th><Td>{app.panNo}</Td></Tr>
                <Tr><Th>Email</Th><Td>{app.email}</Td></Tr>
                <Tr><Th>Monthly Income</Th><Td>{app.monthlyIncome}</Td></Tr>
                <Tr><Th>Product</Th><Td>{app.product}</Td></Tr>

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
                  <Th>AADHAR CARD</Th>
                  <Td>
                    <Button
                        leftIcon={<ViewIcon />}
                        size="sm"
                        colorScheme="scbBlue"
                        variant="solid"
                        isDisabled={!previewUrls.aadhar}
                        onClick={() => previewUrls.aadhar && window.open(previewUrls.aadhar, "_blank")}
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
            <Button colorScheme="scbBlue" onClick={onClose}>Edit</Button>
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
