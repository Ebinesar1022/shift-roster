import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 200,
        p: 2,
        borderRight: "1px solid #ddd",
        height: "100vh",
      }}
    >
      <Button
        fullWidth
        sx={{ mb: 2 }}
        variant="contained"
        onClick={() => navigate("/departments")}
      >
        Department
      </Button>

      <Button
        fullWidth
        sx={{ mb: 2 }}
        variant="contained"
        onClick={() => navigate("/shifts")}
      >
        Shift
      </Button>

      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate("/roster")}
      >
        Roster
      </Button>
    </Box>
  );
};

export default Sidebar;
