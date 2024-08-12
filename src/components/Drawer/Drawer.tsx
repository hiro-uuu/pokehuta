import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  open: boolean;
  anchor: "left" | "top" | "right" | "bottom";
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Drawer({ children, anchor, open, setOpen }: Props) {
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  return (
    <div>
      <React.Fragment key={"drawer"}>
        <SwipeableDrawer
          anchor={anchor}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          allowSwipeInChildren
          disableSwipeToOpen
          disableDiscovery
        >
          {children}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
