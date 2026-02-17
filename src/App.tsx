import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
} from "@mui/material";

import DepartmentPage from "./pages/DepartmentPage";
import ShiftPage from "./pages/ShiftPage";
import RosterPage from "./pages/RosterPage";

const App = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTab(newValue);
  };

  const renderPage = () => {
    switch (tab) {
      case 0:
        return <DepartmentPage />;
      case 1:
        return <ShiftPage />;
      case 2:
        return <RosterPage />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Top App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Saudi Hospital Shift Roster
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Tabs Navigation */}
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Departments" />
          <Tab label="Shifts" />
          <Tab label="Roster" />
        </Tabs>
      </AppBar>

      {/* Page Content */}
      <Container sx={{ mt: 4 }}>
        <Box>{renderPage()}</Box>
      </Container>
    </>
  );
};

export default App;
