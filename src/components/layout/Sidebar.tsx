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
  alpha,
  Tooltip,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen"; // Nicer open icon
import ApartmentIcon from "@mui/icons-material/Apartment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShieldIcon from '@mui/icons-material/Shield'; // For a logo look
import { useNavigate, useLocation } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
 
const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
 
  const menuItems = [
    { label: "Departments", path: "/departments", icon: <ApartmentIcon /> },
    { label: "Shift Setup", path: "/shifts", icon: <ScheduleIcon /> },
    { label: "Master Roster", path: "/roster", icon: <CalendarTodayIcon /> },
    { label: "Front Desk", path: "/frontdesk", icon: <MedicalServicesIcon /> },
  ];
 
  return (
    <>
      {/* Enhanced Hamburger Button */}
      <Tooltip title="Menu" placement="right">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 1300,
            bgcolor: "#1e293b", // Deep Navy
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.1)",
            "&:hover": {
              bgcolor: "#0f172a",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s"
          }}
        >
          <MenuOpenIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
 
      {/* Modern Drawer Sidebar */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280, // Slightly wider for better breathing room
            bgcolor: "#0f172a", // Sleek Midnight Navy
            color: "white",
            borderRadius: "0 24px 24px 0",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            p: 2.5,
            boxShadow: "10px 0 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        {/* Sidebar Brand/Logo Area */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, mt: 1, px: 1 }}>
          <Box sx={{
            p: 1,
            bgcolor: alpha("#3b82f6", 0.15),
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <ShieldIcon sx={{ color: "#3b82f6" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: 0.5 }}>
              HOSPITAL
            </Typography>
            <Typography variant="caption" sx={{ color: alpha("#fff", 0.5), fontWeight: 600 }}>
              ADMIN CONSOLE
            </Typography>
          </Box>
        </Box>
 
        <Divider sx={{ borderColor: alpha("#fff", 0.08), mb: 3 }} />
 
        <Typography
          variant="caption"
          sx={{
            px: 2,
            mb: 1,
            display: 'block',
            color: alpha("#fff", 0.4),
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}
        >
          Management
        </Typography>
 
        <List sx={{ px: 0 }}>
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
                  mb: 1.5,
                  borderRadius: 3,
                  py: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  // Active State Styling
                  bgcolor: isActive ? alpha("#3b82f6", 0.1) : "transparent",
                  color: isActive ? "#3b82f6" : alpha("#fff", 0.7),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.05),
                    color: "white"
                  },
                  transition: "all 0.2s",
                }}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <Box sx={{
                    position: 'absolute',
                    left: 0,
                    height: '60%',
                    width: 4,
                    bgcolor: '#3b82f6',
                    borderRadius: '0 4px 4px 0'
                  }} />
                )}
 
                <ListItemIcon sx={{
                  color: "inherit",
                  minWidth: 45,
                  transition: "all 0.2s",
                  transform: isActive ? "scale(1.1)" : "none"
                }}>
                  {item.icon}
                </ListItemIcon>
               
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
 
        {/* Bottom User Info Section (Optional Polish) */}
        <Box sx={{ mt: 'auto', p: 2, bgcolor: alpha("#fff", 0.03), borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
           <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>
              System Admin
           </Typography>
           
        </Box>
      </Drawer>
    </>
  );
};
 
export default Sidebar;
 