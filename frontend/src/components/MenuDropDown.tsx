import { type MouseEvent, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

const pages = ["File", "Edit", "View", "Format"];

const menuOptions: Record<string, string[]> = {
  File: ["New", "Open", "Save", "Save As"],
  Edit: ["Undo", "Redo", "Cut", "Copy", "Paste"],
  View: ["Zoom In", "Zoom Out", "Full Screen"],
  Format: ["Bold", "Italic", "Underline"],
};

const MenuDropDown = () => {
  // PAGE MENU STATE
  const [anchorElPage, setAnchorElPage] = useState<null | HTMLElement>(null);
  const [activePage, setActivePage] = useState<string>("");

  // OPEN PAGE MENU
  const handleOpenPageMenu = (event: MouseEvent<HTMLElement>, page: string) => {
    setAnchorElPage(event.currentTarget);
    setActivePage(page);
  };

  const handleClosePageMenu = () => {
    setAnchorElPage(null);
    setActivePage("");
  };

  const handleMenuOptionClick = (page: string, option: string) => {
    console.log("Page:", page);
    console.log("Clicked:", option);

    // example actions
    if (page === "File" && option === "New") {
      // create new file logic
    }

    if (page === "File" && option === "Save") {
      // save logic
    }

    if (page === "Edit" && option === "Copy") {
    }

    handleClosePageMenu();
  };

  return (
    <>
      {/* ===== PAGE BUTTONS ===== */}
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {pages.map(page => (
          <Button
            key={page}
            onClick={e => handleOpenPageMenu(e, page)}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            {page}
          </Button>
        ))}
        {/* ===== PAGE DROPDOWN MENU ===== */}
        <Menu
          anchorEl={anchorElPage}
          open={Boolean(anchorElPage)}
          onClose={handleClosePageMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {(menuOptions[activePage] || []).map(option => (
            <MenuItem key={option} onClick={() => handleMenuOptionClick(activePage, option)}>
              <Typography>{option}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
};

export default MenuDropDown;
