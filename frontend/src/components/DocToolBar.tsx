import React, { useState, type ChangeEvent, type MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Popover from "@mui/material/Popover";
import axios from "axios";

const pages = ["File", "Edit", "View", "Format"];

const menuOptions: Record<string, string[]> = {
  File: ["New", "Open", "Save", "Save As"],
  Edit: ["Undo", "Redo", "Cut", "Copy", "Paste"],
  View: ["Zoom In", "Zoom Out", "Full Screen"],
  Format: ["Bold", "Italic", "Underline"],
};

const settings = ["Profile", "Account", "Dashboard", "Logout"];

type DocToolbarProps = {
  onSave: () => void;
  doc: any;
  checkedSwitch: boolean;
  setCheckedSwitch: (checked: boolean) => void;
};

function ResponsiveAppBar({
  doc,
  onSave,
  checkedSwitch,
  setCheckedSwitch,
}: DocToolbarProps) {
  // PAGE MENU STATE

  const [anchorElPage, setAnchorElPage] = useState<null | HTMLElement>(null);
  const [activePage, setActivePage] = useState<string>("");

  // USER MENU STATE
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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

  // USER MENU
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChangeSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    if ((doc.title !== "undefined" || doc.title !== "") && checkedSwitch === true)
      setCheckedSwitch(event.target.checked);
    else {
      alert("Please enter title to enable auto save");
      return;
    }
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [email, setEmail] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addCollabEmail = async () => {
    console.log(email);
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/doc/collab`, {docId:doc.id,email:email}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setEmail("");
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

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
          </Box>

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

          {/* ===== DOCUMENT TITLE ===== */}
          <Box>
            <Button variant="contained" onClick={handleClick}>
              Add Email
            </Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Button variant="contained" onClick={addCollabEmail}>
                  Add
                </Button>
              </Box>
            </Popover>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch color="secondary" checked={checkedSwitch} onChange={handleChangeSwitch} />
              }
              label="Auto Save"
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder={doc.title === "" ? "Enter Title" : doc.title}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />
          </Box>
          <Box>
            <Button variant="contained" endIcon={<AdbIcon />} onClick={onSave}>
              Save
            </Button>
          </Box>

          {/* ===== USER AVATAR ===== */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {settings.map(setting => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
