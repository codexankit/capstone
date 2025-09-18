import React, { useRef, useState, useMemo } from "react";
/*
Hooks:
1. useRef - to keep reference to each file input DOM elements - to reset the file input to blank
2. useState - keeps track of the selected file objects, updated whenever a new file is uploaded
            - later we are using it to build preview URLs and to check if all files are chosen
3. useMemo - wrapped in useMemo so that the URLs are recomputed only when a file changes ocuurs and not on 
              every render
*/
import { useNavigate } from "react-router-dom"; // for navigation
import Navbar from "../components/Navbar";
import {
  Box, // a generic container just like a div, i am using it for card wrapper
  Container, //a responsive container - centers and adds horizontal padding
  Heading, // used for Step 3: Documents Upload
  Text, // for inline text
  Divider, // horizontal line to separate the title and form
  FormControl, //wraps each field and handles isRequired, validation states
  FormLabel, // label for input field
  Input, // input box for file uploads
  HStack, // lays children side by side - previous, reset, preview
  Button,
  Stack, // for spacing vertically
  useDisclosure, // hook that controls modal open/close
  Modal, // wrapper component for the popup
  ModalOverlay, // darkened background behind the model
  ModalContent, // the white box that holds everything inside the modal
  ModalHeader, // title bar of the modal
  ModalCloseButton, // a small button in corner to close the modal
  ModalBody, // scrollable content area
  ModalFooter, // the bottom row for action buttons - submit, close
  Table, // table inside the preview modal
  Tbody, // body section of the table
  Tr, // table row
  Th, // table header
  Td, // table data cell
  useToast, // hook for showing a small popup
  Select // for selecting the address proof document type
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
//import CustomStepper from "../components/Stepper/CustomStepper";
import CustomStepper from "../components/CustomStepper";


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

  // files states
  
  const [files, setFiles] = useState({ addressProof: null, pan: null, income: null});
// useState initializes a state variable 'files' - it starts with an object where all three file slots are currently null.
// setFiles - this is the function to update the state variable when file is uploaded

            

            
  const [addressProofType, setAddressProofType] = useState("");
// another state variable - stores which type of address proof
// set address proof type - function to change whenever user chooses from the dropdown

            
  
  const addressProofRef = useRef(null);
  const panRef = useRef(null);
  const incomeRef = useRef(null);
// About the above 3 lines:
// these are refs pointing to the actual files elements in the dom
// useful because react cant directly reset a file input by just changing the state
// they are getting used in handleReset

            

  const navigate = useNavigate();
// for navigation between the pages

            

  const toast = useToast();
// a hook for showing small popup

            
            
  const { isOpen, onOpen, onClose } = useDisclosure();
// useDisclosure is also a hook - this is getting used in Modal
// isOpen - boolean - modal is opened or not
// onOpen - function to open the modal
// onClose - function to close the modal

            

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0] ?? null;
    setFiles((p) => ({ ...p, [key]: file }));
  };
/* the above code block is Event handler for file input
// basics - this is javascript arrow function - 
there are two inputs:
1. key - a string telling us which field is getting updated
2. e - event object

e.target - the element that triggered the event
for an <input type="file"> the browser provides an array-like object called a FileList - it contains all the files user selected
e.target.files - array like list of files chosen - a FileList
[0] - by writing zero we are taking the first file in the list - why? - because we are allowing only one file per field - so we only need the array[0]
?? - if nothing is selected, use null as fallback - if user selects a file then 'file' becomes a 'File' object, otherwise it is null

setFiles is the updater function for react state files
p - previous state (before update) - example: p = { addressProof: FileObj, pan: null, income: FileObj }
{ ...p, [key]: file } = make a new object
...p = copy everything from the previous state
[key]: file = overwrite only the field specified by file

so if key = pan, then new state p is: p = { addressProof: (old value), pan: File("pan.pdf"), income: (old value) }

How its called? - 
<Input
  type="file"
  onChange={(e) => handleFileChange("pan", e)}
/>

*/


            

  const handleReset = () => { // an array function that runs when the user clicks the reset button
    setFiles({ addressProof: null, pan: null, income: null }); // this resets the file states to null
    setAddressProofType(""); // clears the dropdown value
    if (addressProofRef.current) addressProofRef.current.value = "";
    if (panRef.current) panRef.current.value = "";
    if (incomeRef.current) incomeRef.current.value = "";
    toast({ title: "Cleared", status: "info", duration: 1500, isClosable: true });
  };
/*
const handleReset = () => {      defining an arrow function - this runs when the user clicks the reset button
what is useRef? - when we write const addressProofRef = useRef(null)
basically it means we are creating a ref object
and this object looks like: { current: null }
by passing ref = {addressProofRef} we tell react that put a reference to this <Input> element inside addressProofRef.current
and since chakra's ui is ultimately built on HTML so after rendering addressProofRef.current = HTMLInputElement


what is addressProofRef.current.value?
- this will hold the file path string 
- and when addressProofRef.current.value = ""     // we are forcing the input's value to be empty



TOAST

toast({ title: "Cleared", status: "info", duration: 1500, isClosable: true });
Explanation of each thing:
Shows a small popup notification (toast) at the corner of the screen.
1. title: "Cleared" → text shown in the toast.
2. status: "info" → styling (blue/info look).
3. duration: 1500 → visible for 1.5 seconds.
4. isClosable: true → user can dismiss it early by clicking ✖️.
*/

 
            
            
  const handlePrev = () => {
    // wire to our stepper/router later
    console.log("Prev clicked");
  };
/*
When we click the previous button the handlePrev function will run

Rn this function is just the placeholder for the 'Previous' button
 - later on we will wire it to router and stepper
 - for the stepper, update the currentState - decrease it
*/

  
            
            
const handlePreview = () => {
    onOpen();
};
/*
Arrow function that runs when the Preview button is clicked
- no arguments
- what is onOpen()?    
    - its a chakra's hook
    - onOpen - a function to set isOpen = true

So for now when we clicking the Preview - handlePreview is getting called - and inside that onOpen is
getting called - and it is changing isOpen -> true


WHY??

Because our Modal is written like this
< Modal isOpen={isOpen} onClose={onClose} .... >
....
</Modal>

That means:
- when isOpen=false, the Modal is hidden
- when isOpen=true, the Modal is displayed




Where the handlePreview is getting used?

<Button colorScheme="scbGreen" onClick={handlePreview} isDisabled={!allFilesChosen}>
  Preview
</Button>

- When the user clicks Preview, react runs the handlePreview
- inside the handlePreview, onOpen() sets the Modal state to true
- Result - the Preview Modal pops up
*/

  const handleSubmit = () => {
    // TODO: call the backend API with `files` + form data
    toast({ title: "Application submitted", status: "success", duration: 1800, isClosable: true });
    onClose();
    navigate('/dashboard');
  };

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
            <FormLabel>Upload Address Proof</FormLabel>
            <Select
              placeholder="Select Address Proof"
              value={addressProofType}
              onChange={(e) => setAddressProofType(e.target.value)}
              >
              <option value="aadhar"> Aadhar Card</option>
              <option value="voter"> Voter Card</option>
              <option value="passport"> Passport</option>
            </Select>
            <Input
              mt={3}
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
