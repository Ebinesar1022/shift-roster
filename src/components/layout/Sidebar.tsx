import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate, useLocation } from "react-router-dom";
 
const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
 
  const menuItems = [
    { label: "Department", path: "/departments", icon: <ApartmentIcon /> },
    { label: "Shift", path: "/shifts", icon: <ScheduleIcon /> },
    { label: "Roster", path: "/roster", icon: <CalendarTodayIcon /> },
  ];
 
  return (
    <>
      {/* Hamburger button */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <MenuIcon />
      </IconButton>
 
      {/* Drawer Sidebar */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 220,
            bgcolor: "primary.main",
            color: "white",
            borderRadius: "0 20px 20px 0",
            p: 2,
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}
        >
          Admin Panel
        </Typography>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.5)", mb: 2 }} />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: isActive ? "white" : "transparent",
                  color: isActive ? "primary.main" : "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)", color: "primary.main" },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};
 
export default Sidebar;