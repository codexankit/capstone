import React from "react";
import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Navbar = () => {
  return (
    <Box
      bg="white"
      px={6}
      py={3}
      boxShadow="xl"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex justify="space-between" align="center">
        {/* Left - Logo */}
        <Image
          src="/scb-logo.png" // put your logo in public folder
          // public\scb-logo.png
          // src\components\Navbar\Navbar.jsx
          alt="SCB Logo"
          h="35px"
        />

        {/* Right - Profile Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Avatar size="sm" name="AnkitPrem" bg="scbGreen.500" color="white" />}
            variant="ghost"
            rightIcon={<ChevronDownIcon />}
          />
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Navbar;
