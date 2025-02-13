import React from "react";
import { Label } from "@radix-ui/react-label";
import { Box, Button, TextField } from "@radix-ui/themes";
import Image from "next/image";
import * as Menubar from "@radix-ui/react-menubar";
import { menuItems } from "../../constants/index.js";
import { useGlobalState } from "../../context/GlobalState.tsx";

const Navbar = () => {
  const [state] = useGlobalState();
  const mode = state;
  return (
    <Box className="navbar">
      <Box className="navbar-sidebar-btn">
        <Button className="sidebar-btn">
          <Image
            src="./images/chevron-left.svg"
            alt="chevron-left"
            width={18}
            height={18}
            style={{ filter: mode === "dark" ? "invert(100%)" : "invert(0%)" }}
          />
        </Button>
        <Button className="navbar-btn">
          <Image
            src="./images/hamburger-menu.svg"
            alt="hamburger-menu"
            width={18}
            height={18}
          />
        </Button>
      </Box>
      <Box className="navbar-menu">
        {/* Render search box */}
        <Box className="search-box">
          <Box className="search-icon">
            <Image
              src="./images/magnifying-glass.svg"
              alt="magnifying-glass"
              width={16}
              height={16}
              style={{
                filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
              }}
            />
          </Box>
          <Box className="search-input">
            <Label htmlFor="search" className="search-label"></Label>
            <TextField.Root
              id="search"
              type="search"
              placeholder="Search ShowOps"
              className="search-field"
            />
          </Box>
          <Box className="search-button">
            <Button>
              <Image
                src="./images/ShiftTab.svg"
                alt="ShiftTab"
                width={27}
                height={24}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
            </Button>
          </Box>
        </Box>

        {/* Render profile and notification menus */}
        <Box className="profile-notification">
          <Menubar.Root>
            {menuItems.map((item, index) => (
              <Menubar.Menu key={index}>
                <Menubar.Trigger>
                  <Image
                    src={item.imageSrc}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                  />
                </Menubar.Trigger>
              </Menubar.Menu>
            ))}
          </Menubar.Root>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
