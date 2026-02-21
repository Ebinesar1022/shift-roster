import {
  Box,
  Grid as Grid,
  Card,
  CardContent,
  Typography,
  Button,
  alpha,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Departments",
      subtitle: "Manage hospital units",
      icon: <ApartmentIcon sx={{ fontSize: 40 }} />,
      path: "/departments",
      color: "#3b82f6", // Modern Blue
    },
    {
      title: "Shifts",
      subtitle: "Configure timings",
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      path: "/shifts",
      color: "#10b981", // Modern Emerald
    },
    {
      title: "Roster",
      subtitle: "View schedule",
      icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
      path: "/roster",
      color: "#6366f1", // Modern Indigo
    },
    {
      title: "Front Desk",
      subtitle: "Patient appointment management",
      icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />,
      path: "/frontdesk",
      color: "#ec4899", // Modern Pink
    },
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        // Modern gradient background with your image
        background: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url("/bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Decorative background blur elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 300,
          height: 300,
          bgcolor: alpha("#3b82f6", 0.15),
          filter: "blur(100px)",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 300,
          height: 300,
          bgcolor: alpha("#6366f1", 0.15),
          filter: "blur(100px)",
          borderRadius: "50%",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: 3,
          maxWidth: 1200,
        }}
      >
        <Stack spacing={1} sx={{ mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: "#3b82f6",
              fontWeight: 800,
              letterSpacing: 3,
              fontSize: "0.9rem",
            }}
          >
            Hospital Management System
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
              fontSize: { xs: "2.5rem", md: "3.75rem" },
            }}
          >
            Doctor Shift{" "}
            <Box component="span" sx={{ color: "#3b82f6" }}>
              Roster
            </Box>
          </Typography>
        </Stack>

        <Grid container spacing={4} justifyContent="center">
          {cards.map((card) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
              <Card
                onClick={() => navigate(card.path)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: alpha("#ffffff", 0.05),
                  backdropFilter: "blur(12px)",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: alpha("#ffffff", 0.1),
                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: alpha(card.color, 0.5),
                    background: alpha(card.color, 0.08),
                    boxShadow: `0 20px 40px ${alpha(card.color, 0.2)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 5 }}>
                  {/* Icon Container with Glow */}
                  <Box
                    sx={{
                      mb: 4,
                      display: "inline-flex",
                      p: 2,
                      borderRadius: 4,
                      bgcolor: alpha(card.color, 0.1),
                      color: card.color,
                      boxShadow: `0 8px 20px ${alpha(card.color, 0.2)}`,
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: "white", mb: 1 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: alpha("#fff", 0.6), mb: 4, fontWeight: 500 }}
                  >
                    {card.subtitle}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={
                      <ArrowForwardIosIcon
                        sx={{ fontSize: "12px !important" }}
                      />
                    }
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      textTransform: "none",
                      bgcolor: card.color,
                      "&:hover": {
                        bgcolor: card.color,
                        filter: "brightness(1.1)",
                      },
                    }}
                  >
                    Open Module
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
