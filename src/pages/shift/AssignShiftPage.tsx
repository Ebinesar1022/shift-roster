import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAll } from "../../services/api";
import { Department, Shift } from "../../models";
import AssignDoctorForm from "../../components/shift/AssignDoctorForm";
import {
  Box,
  Typography,
  Button,
  Card,
  CardActionArea,
  Avatar,
  Container,
  Stack,
  alpha,
  Divider,
  Paper,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
 
const AssignShiftPage = () => {
  const { shiftId } = useParams();
  const navigate = useNavigate();
  const shiftID = Number(shiftId);
 
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
 
  const selectedDepartment = departments.find((dept) => dept.id === selectedDept);
 
  useEffect(() => {
    const load = async () => {
      const [deptData, shiftData] = await Promise.all([
        fetchAll<Department>("departments"),
        fetchAll<Shift>("shifts"),
      ]);
      setDepartments(deptData);
      setShift(shiftData.find((s) => Number(s.id) === shiftID) || null);
      if (deptData.length > 0 && !selectedDept) setSelectedDept(deptData[0].id);
    };
    load();
  }, [shiftID]);
 
  return (
    <Box sx={{
      display: 'flex',
      minHeight: "100vh",
      bgcolor: "#f1f5f9" // Soft grey background for the whole page
    }}>
     
      {/* LEFT SIDEBAR: Department Selection */}
      <Box sx={{
        width: 320,
        bgcolor: "#1e293b", // Deep slate background
        color: "white",
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: "1px solid rgba(255,255,255,0.1)",
        position: 'fixed',
        height: '100vh'
      }}>
        <Box sx={{ p: 3, bgcolor: alpha("#000", 0.2) }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: "rgba(255,255,255,0.7)", textTransform: 'none', mb: 2 }}
          >
            Back to Shifts
          </Button>
          <Typography variant="h6" fontWeight={800} sx={{ color: "white" }}>
            Departments
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Select a unit to assign staff
          </Typography>
        </Box>
 
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <Stack spacing={1}>
            {departments.map((dept) => {
              const isSelected = selectedDept === dept.id;
              return (
                <Card
                  key={dept.id}
                  elevation={0}
                  sx={{
                    bgcolor: isSelected ? "primary.main" : "transparent",
                    transition: "all 0.2s",
                    borderRadius: 2,
                    "&:hover": { bgcolor: isSelected ? "primary.main" : "rgba(255,255,255,0.05)" }
                  }}
                >
                  <CardActionArea onClick={() => setSelectedDept(dept.id)} sx={{ p: 1.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <LocalHospitalIcon sx={{ color: isSelected ? "white" : "rgba(255,255,255,0.4)" }} />
                        <Typography variant="body2" fontWeight={isSelected ? 700 : 400} sx={{ color: "white" }}>
                          {dept.name}
                        </Typography>
                      </Stack>
                      {isSelected && <ChevronRightIcon sx={{ color: "white", fontSize: 18 }} />}
                    </Stack>
                  </CardActionArea>
                </Card>
              );
            })}
          </Stack>
        </Box>
      </Box>
 
      {/* MAIN CONTENT AREA */}
      <Box sx={{
        flexGrow: 1,
        ml: { md: "320px" }, // Offset by sidebar width
        p: { xs: 2, md: 6 }
      }}>
        <Container maxWidth="md">
         
          {/* Top Info Header */}
          <Paper elevation={0} sx={{
            p: 3, mb: 4, borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid #e2e8f0",
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
                <EventNoteIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800} color="#1e293b">
                  {shift?.name || "Shift Allocation"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule Configuration & Staffing
                </Typography>
              </Box>
            </Stack>
            <Chip
              label="Active Session"
              color="success"
              size="small"
              variant="light"
              sx={{ fontWeight: 700, borderRadius: 1 }}
            />
          </Paper>
 
          {selectedDepartment ? (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <MedicalInformationIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1 }}>
                  Current Selection
                </Typography>
              </Stack>
             
              <Typography variant="h4" fontWeight={850} sx={{ color: "#0f172a", mb: 3 }}>
                Assigning to {selectedDepartment.name}
              </Typography>
 
              {/* The Form Container */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 5,
                  bgcolor: "white",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)"
                }}
              >
                <AssignDoctorForm departmentId={selectedDept!} shiftId={shiftID} />
              </Paper>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
               <Typography color="text.secondary">Select a department from the sidebar to continue.</Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};
 
// Simple Chip fallback if your MUI version doesn't support specific variant
const Chip = ({ label, color, sx }: any) => (
  <Box sx={{
    px: 1.5, py: 0.5, bgcolor: alpha('#10b981', 0.1), color: '#047857',
    borderRadius: 1, fontSize: '0.75rem', fontWeight: 700, ...sx
  }}>
    {label}
  </Box>
);
 
export default AssignShiftPage;