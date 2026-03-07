import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { docAtom } from "../store/atom/docAtom";

const Popup = () => {
  const doc = useRecoilValue(docAtom);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const addCollabEmail = async () => {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/doc/collab`,
      { docId: doc.id, email: email },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setEmail("");
    handleClose();
  };

  const [email, setEmail] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
  );
};

export default Popup;
