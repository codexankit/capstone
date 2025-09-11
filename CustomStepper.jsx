import React from "react";
import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";



/**
 * Props:
 *   currentStep: number (0-based index of active step)
 */
const CustomStepper = ({ currentStep = 0 }) => {
  const steps = [
    { title: "Step 1", description: "Customer Info" },
    { title: "Step 2", description: "Product Selection" },
    { title: "Step 3", description: "Documents Upload" },
  ];

  const { activeStep } = useSteps({
    index: currentStep,
    count: steps.length,
  });

  return (
    
    <Stepper index={activeStep} colorScheme="scbGreen" size="lg">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

export default CustomStepper;
