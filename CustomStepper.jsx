import React from "react"; 
// Importing React for building the component

import {
  Box,                // A Chakra UI container component (like <div>)
  Step,               // Represents a single step in the Stepper
  StepDescription,    // Text under the title of the step
  StepIcon,           // Default icon shown when step is complete
  StepIndicator,      // Container for step icon/number
  StepNumber,         // Step number indicator
  StepSeparator,      // Line separator between steps
  StepStatus,         // Renders UI based on step status (active, complete, incomplete)
  StepTitle,          // Title of the step
  Stepper,            // Wrapper component that manages all steps
  useSteps,           // Hook to manage active step logic
} from "@chakra-ui/react";



/**
 * Props:
 *   currentStep: number (0-based index of active step)
 */
const CustomStepper = ({ currentStep = 0 }) => {
  // Array of step definitions (title + description for each step)
  const steps = [
    { title: "Step 1", description: "Customer Info" },
    { title: "Step 2", description: "Product Selection" },
    { title: "Step 3", description: "Documents Upload" },
  ];

  // useSteps hook gives us activeStep based on props
  const { activeStep } = useSteps({
    index: currentStep,   // The current active step (from props)
    count: steps.length,  // Total number of steps
  });

  return (
    // Stepper container
    <Stepper index={activeStep} colorScheme="scbGreen" size="lg">
      {/* Map through steps to render each step */}
      {steps.map((step, index) => (
        <Step key={index}>
          {/* Indicator showing number or icon depending on status */}
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}    // If step is complete → show check icon
              incomplete={<StepNumber />} // If not started → show step number
              active={<StepNumber />}     // If currently active → show step number
            />
          </StepIndicator>

          {/* Step title and description */}
          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>             {/* e.g., Step 1 */}
            <StepDescription>{step.description}</StepDescription> {/* e.g., Customer Info */}
          </Box>

          {/* Separator line to connect steps */}
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

export default CustomStepper; 
// Exporting the component so it can be used in other files
