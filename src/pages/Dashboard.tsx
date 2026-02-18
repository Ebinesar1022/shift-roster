import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        onClick={() => navigate("/departments")}
        sx={{ mr: 2 }}
      >
        Department
      </Button>

      <Button
        variant="contained"
        onClick={() => navigate("/shifts")}
        sx={{ mr: 2 }}
      >
        Shift
      </Button>

      <Button
        variant="contained"
        onClick={() => navigate("/roster")}
      >
        Roster
      </Button>
    </Box>
  );
};

export default Dashboard;
