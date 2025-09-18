// Import React (required for JSX components)
import React from "react";

// Import Chakra UI components for layout, styling, and interactivity
import {
  Box,         // A container component (like <div>) with built-in styling props
  Flex,        // Flexbox container for arranging children in row/column
  Image,       // For displaying images
  Menu,        // Wrapper for a dropdown menu
  MenuButton,  // Button that toggles the dropdown menu
  MenuList,    // Container for dropdown menu items
  MenuItem,    // Individual items inside the dropdown menu
  Avatar,      // Displays user avatar/profile picture
  IconButton,  // A button that shows only an icon (no text)
} from "@chakra-ui/react";

// Import icon from Chakra UI's icon library
import { ChevronDownIcon } from "@chakra-ui/icons";

// Functional component for Navbar
const Navbar = () => {
  return (
    // Box acts like a container for the navbar
    <Box
      bg="white"        // Background color white
      px={6}            // Horizontal padding (left + right)
      py={3}            // Vertical padding (top + bottom)
      boxShadow="xl"    // Extra-large shadow for elevation effect
      position="sticky" // Navbar stays fixed when scrolling
      top="0"           // Stick to the top of the viewport
      zIndex="1000"     // High stacking order so navbar stays on top of other elements
    >
      {/* Flex container to space out logo (left) and profile menu (right) */}
      <Flex justify="space-between" align="center">
        
        {/* Left - Bank Logo */}
        <Image
          src="/scb-logo.png"    // Path of logo (must be placed in 'public' folder)
          // Example: public\scb-logo.png
          // This component file is src\components\Navbar\Navbar.jsx
          alt="SCB Logo"         // Alternative text for accessibility
          h="35px"               // Height of the logo
        />

        {/* Right - Profile Menu */}
        <Menu>
          {/* MenuButton triggers dropdown on click */}
          <MenuButton
            as={IconButton} // Renders as an icon-only button
            icon={
              <Avatar 
                size="sm"               // Small avatar size
                name="AnkitPrem"        // User's name (used for initials if no image)
                bg="scbGreen.500"       // Background color (from custom theme color palette)
                color="white"           // Text/icon color
              />
            }
            variant="ghost"            // Transparent button style
            rightIcon={<ChevronDownIcon />} // Dropdown indicator arrow
          />

          {/* Dropdown menu items */}
          <MenuList>
            <MenuItem>Profile</MenuItem>  {/* Navigate to profile */}
            <MenuItem>Logout</MenuItem>   {/* Trigger logout */}
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

// Export Navbar so it can be imported in other files
export default Navbar;
