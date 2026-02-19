import React from "react";
import { Box } from "@mui/material";
import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent", 
        zIndex: 9999,
      }}
    >
      <HashLoader color="#eac64e" size={60} />
    </Box>
  );
};

export default Loader;
