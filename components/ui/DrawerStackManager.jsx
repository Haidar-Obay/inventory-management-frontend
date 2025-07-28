'use client';

import React from "react";
import { useDrawerStack } from "./DrawerStackContext";
import CustomerDrawer from "./drawers/CustomerDrawer";
import AddressCodeDrawer from "./drawers/AddressCodeDrawer";
import SectionDrawer from "./drawers/SectionDrawer";
import CustomerGroupDrawer from "./drawers/customerGroup/CustomerGroupDrawer";
import PaymentDrawer from "./drawers/PaymentDrawer";
import SalesmanDrawer from "./drawers/salesmen/SalesmanDrawer";
import GeneralFilesDrawer from "./drawers/GeneralFilesDrawer";

export default function DrawerStackManager() {
  const { drawerStack, closeTopDrawer } = useDrawerStack();

  // Map drawer types to components
  const drawerComponents = {
    customer: CustomerDrawer,
    country: (props) => <AddressCodeDrawer {...props} type="country" />, // Use AddressCodeDrawer for country
    zone: (props) => <AddressCodeDrawer {...props} type="zone" />,      // Optionally add for zone
    city: (props) => <AddressCodeDrawer {...props} type="city" />,      // Optionally add for city
    district: (props) => <AddressCodeDrawer {...props} type="district" />, // Optionally add for district
    trade: (props) => <SectionDrawer {...props} type="trade" />, // Add trade drawer
    companyCode: (props) => <SectionDrawer {...props} type="companyCode" />, // Add company code drawer
    customerGroup: (props) => <CustomerGroupDrawer {...props} />, // Add customer group drawer
    paymentTerm: (props) => <PaymentDrawer {...props} type="paymentTerm" />, // Add payment method drawer
    paymentMethod: (props) => <PaymentDrawer {...props} type="paymentMethod" />, // Add payment method drawer
    salesman: (props) => <SalesmanDrawer {...props} />, // Use the new SalesmanDrawer
    // General Files Drawers
    businessType: (props) => <GeneralFilesDrawer {...props} type="businessType" />,
    salesChannel: (props) => <GeneralFilesDrawer {...props} type="salesChannel" />,
    distributionChannel: (props) => <GeneralFilesDrawer {...props} type="distributionChannel" />,
    mediaChannel: (props) => <GeneralFilesDrawer {...props} type="mediaChannel" />,
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