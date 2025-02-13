import React, { useState } from "react";
import { Box, Link } from "@radix-ui/themes";
import Image from "next/image";
import * as Menubar from "@radix-ui/react-menubar";
import SwitchDemo from "../Switch/switch";
import { navigationItems, profileItems } from "../../constants/index.js";
import { useGlobalState } from "../../context/GlobalState";

const Sidebar = () => {
  const [state] = useGlobalState();
  const { mode } = state;
  return (
    <Box>
      <Box className="sidebar">
        <Box className="navigation-bar">
          <Box>
            <Box className="navbar-logo">
              <Image
                width={150}
                height={27}
                src="./images/Logo.svg"
                alt="Logo"
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
            </Box>
            <Box className="navigation-menu-wrapper">
              <Menubar.Root className="navigation-menu for-dark-mode">
                {navigationItems.map((item, index) => (
                  <Menubar.Menu key={index}>
                    <Menubar.Trigger className={index == 0 ? "active" : ""}>
                      <Image
                        width={16}
                        height={16}
                        src={item.imageSrc}
                        alt={item.alt}
                        style={{
                          filter:
                            mode === "dark" ? "invert(100%)" : "invert(0%)",
                        }}
                      />
                      <h1>{item.text}</h1>
                    </Menubar.Trigger>
                  </Menubar.Menu>
                ))}
              </Menubar.Root>
            </Box>
            <Box className="today-events">
              <Box className="todays-event-head">
                <h1>Todays Events</h1>
              </Box>
              <Menubar.Root className="today-events-profile">
                {profileItems.map((item, index) => (
                  <Menubar.Menu key={index}>
                    <Menubar.Trigger>
                      <Image
                        width={40}
                        height={40}
                        src={item.imageSrc}
                        alt={item.alt}
                      />
                      <Box className="profile-content">
                        <label>{item.label}</label>
                        <h1>{item.text}</h1>
                      </Box>
                    </Menubar.Trigger>
                  </Menubar.Menu>
                ))}
              </Menubar.Root>
            </Box>
          </Box>
          <Box>
            <SwitchDemo></SwitchDemo>
          </Box>

          <Box className="sidebar-footer">
            <Box className="terms-policy">
              <Link href="#">Terms of Use</Link>
              <Link href="#">Privacy Policy</Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
