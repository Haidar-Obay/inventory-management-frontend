'use client'
import React from 'react';
import { Drawer, Slide, Box, styled } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

interface SidePanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number | string;
  children: React.ReactNode;
  zIndex?: number;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    position: 'absolute',
    overflow: 'visible',
  },
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[16],
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const SidePanelDrawer: React.FC<SidePanelDrawerProps> = ({
  isOpen,
  onClose,
  width = 400,
  children,
  zIndex = 1200,
}) => {
  // Prevent background scrolling when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <StyledDrawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      slotProps={{ transition: { direction: "left" } }}
      sx={{
        '& .MuiDrawer-paper': {
          width: width,
          zIndex: zIndex,
        },
      }}
    >
      <DrawerContent>{children}</DrawerContent>
    </StyledDrawer>
  );
};

export default SidePanelDrawer;