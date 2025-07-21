'use client';

import React from "react";
import { useDrawerStack } from "./DrawerStackContext";
import CustomerDrawer from "./drawers/CustomerDrawer";
import AddressCodeDrawer from "./drawers/AddressCodeDrawer";

export default function DrawerStackManager() {
  const { drawerStack, closeTopDrawer } = useDrawerStack();

  // Map drawer types to components
  const drawerComponents = {
    customer: CustomerDrawer,
    country: (props) => <AddressCodeDrawer {...props} type="country" />, // Use AddressCodeDrawer for country
    zone: (props) => <AddressCodeDrawer {...props} type="zone" />,      // Optionally add for zone
    city: (props) => <AddressCodeDrawer {...props} type="city" />,      // Optionally add for city
    district: (props) => <AddressCodeDrawer {...props} type="district" />, // Optionally add for district
    // Add other drawer types here
  };

  return (
    <>
      {drawerStack.map((drawer, idx) => {
        const DrawerComponent = drawerComponents[drawer.type];
        if (!DrawerComponent) return null;
        return (
          typeof DrawerComponent === 'function' && DrawerComponent.prototype?.isReactComponent
            ? <DrawerComponent
                key={idx}
                {...drawer.props}
                isOpen={true}
                onClose={closeTopDrawer}
                zIndex={1300 + idx * 10}
              />
            : DrawerComponent({
                key: idx,
                ...drawer.props,
                isOpen: true,
                onClose: closeTopDrawer,
                zIndex: 1300 + idx * 10,
              })
        );
      })}
    </>
  );
} 