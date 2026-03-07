import React, { type ChangeEvent, type MouseEvent, useState } from "react";
import AdbIcon from "@mui/icons-material/Adb";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { docAtom } from "../store/atom/docAtom";
import MenuDropDown from "./MenuDropDown";
import Popup from "./Popup";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

type DocToolbarProps = {
  onSave: () => void;
  autoSave: boolean;
  onToggleAutoSave: (value: boolean) => void;
};

const DocToolBar = ({ onSave, autoSave, onToggleAutoSave }: DocToolbarProps) => {
  const doc = useRecoilValue(docAtom);

  // USER MENU STATE
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // USER MENU
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChangeSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    if (doc.title && doc.title !== "undefined") {
      onToggleAutoSave(event.target.checked);
    } else {
      alert("Please enter title to enable auto save");
    }
  };

  const [title, setTitle] = useState(doc.title);
  const onUpdateTitle = async () => {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/doc/update`,
      { docId: doc.id, title: title },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <MenuDropDown />
          {/* ===== DOCUMENT TITLE ===== */}
          <Popup />
          <Box>
            <FormControlLabel
              control={
                <Switch color="secondary" checked={autoSave} onChange={handleChangeSwitch} />
              }
              label="Auto Save"
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder={title === "" ? "Enter Title" : title}
              sx={{ bgcolor: "white", borderRadius: 1 }}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Button variant="contained" onClick={onUpdateTitle}>
              Update title
            </Button>
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
};

export default React.memo(DocToolBar);
