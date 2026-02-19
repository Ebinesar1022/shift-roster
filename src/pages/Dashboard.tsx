import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
 
const Dashboard = () => {
  const navigate = useNavigate();
 
  const cards = [
    { title: "Department", icon: <ApartmentIcon sx={{ fontSize: 50, color: "primary.main" }} />, path: "/departments", color: "primary.main" },
    { title: "Shift", icon: <ScheduleIcon sx={{ fontSize: 50, color: "success.main" }} />, path: "/shifts", color: "success.main" },
    { title: "Roster", icon: <CalendarTodayIcon sx={{ fontSize: 50, color: "error.main" }} />, path: "/roster", color: "error.main" },
  ];
 
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url("/bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dark overlay for readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        }}
      />
 
      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ mb: 6, fontWeight: 700, color: "white", textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
        >
          Doctor Shift Roster Dashboard
        </Typography>
 
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
        >
          {cards.map((card) => (
            <Grid size={{xs:12,sm:6,md:4}} key={card.title}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "0.4s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 12 },
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: 3,
                  minWidth: 250,
                  maxWidth: 300,
                }}
                onClick={() => navigate(card.path)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    py: 6,
                  }}
                >
                  {card.icon}
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate(card.path)}
                    sx={{
                      mt: 2,
                      backgroundColor: card.color,
                      "&:hover": { backgroundColor: card.color },
                      px: 5,
                    }}
                  >
                    Go
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
 