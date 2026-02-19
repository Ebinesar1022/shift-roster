import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Doctor } from "../../models";
import { fetchAll } from "../../services/api";
import DoctorForm from "../../components/department/DoctorForm";
import { Box, Typography, Paper, Grid, Divider } from "@mui/material";
import { getWeekDayName } from "../../utils/weekOffManager";

const DepartmentDoctorsPage = () => {
  const { id } = useParams();
  const departmentId = Number(id);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const loadDoctors = async () => {
    const data = await fetchAll<Doctor>("doctors");
    setDoctors(data.filter((d) => d.departmentId === departmentId));
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        backgroundColor: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
        Department Doctors
      </Typography>

      {/* Doctor Form Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Add New Doctor
        </Typography>

        <DoctorForm departmentId={departmentId} onCreated={loadDoctors} />
      </Paper>

      {/* Doctors List */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Doctor List
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {doctors.map((doc) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {doc.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1 }}
                >
                  Week Off: {getWeekDayName(doc.weekOffDay)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default DepartmentDoctorsPage;
