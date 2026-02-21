import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Doctor } from "../../models";
import { fetchAll, deleteItem } from "../../services/api";
import DoctorForm from "../../components/department/DoctorForm";
import {
  Box,
  Typography,
  Paper,
  Grid as Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  alpha,
  Container,
  Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupIcon from "@mui/icons-material/Group";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { getWeekDayName } from "../../utils/weekOffManager";
 
const DepartmentDoctorsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const departmentId = Number(id);
  const [departmentName, setDepartmentName] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
 
  const loadData = async () => {
    const [deptData, docData] = await Promise.all([
      fetchAll<{ id: number; name: string }>("departments"),
      fetchAll<Doctor>("doctors"),
    ]);
    const dept = deptData.find((d) => d.id === departmentId);
    if (dept) setDepartmentName(dept.name);
    setDoctors(docData.filter((d) => d.departmentId === departmentId));
  };
 
  useEffect(() => { loadData(); }, [departmentId]);
 
  const handleDelete = async (doctorId: number) => {
    if (window.confirm("Remove this doctor from the registry?")) {
      await deleteItem("doctors", doctorId);
      loadData();
    }
  };
 
  return (
    <Box sx={{
      minHeight: "100vh",
      position: "relative",
      bgcolor: "#f8fafc", // Light slate base
      overflow: "hidden",
      pb: 10
    }}>
     
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <Box sx={{
        position: 'fixed', top: -150, left: -150, width: 500, height: 500,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0, animation: 'pulse 10s infinite alternate',
        '@keyframes pulse': { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.2)' } }
      }} />
      <Box sx={{
        position: 'fixed', bottom: -100, right: -100, width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0
      }} />
 
      {/* --- HERO SECTION --- */}
      <Box sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          pt: 8,
          pb: 16,
          color: "white",
          position: "relative",
          zIndex: 1,
          borderBottomLeftRadius: { xs: 0, md: 80 }, // Stylized curved bottom
        }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  color: alpha("#fff", 0.6),
                  mb: 2,
                  bgcolor: alpha("#fff", 0.05),
                  borderRadius: 2,
                  px: 2,
                  textTransform: 'none',
                  "&:hover": { color: '#fff', bgcolor: alpha("#fff", 0.1) }
                }}
              >
                Back to Departments
              </Button>
              <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: "-0.04em", mb: 1 }}>
                {departmentName || "Department"}
                <Box component="span" sx={{ color: '#60a5fa', display: 'block' }}>Medical Team</Box>
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ display: 'flex', px: 1.5, py: 0.5, borderRadius: 5, bgcolor: alpha("#10b981", 0.2), border: '1px solid', borderColor: alpha("#10b981", 0.3) }}>
                    <VerifiedUserIcon sx={{ fontSize: 16, color: '#34d399', mr: 1 }} />
                    <Typography variant="caption" sx={{ color: "#34d399", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Verified Unit
                    </Typography>
                </Box>
              </Stack>
            </Box>
 
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: "#3b82f6",
                color: "white",
                px: 4, py: 2, borderRadius: 4, fontWeight: 800, textTransform: 'none',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                "&:hover": { bgcolor: "#2563eb", transform: 'translateY(-3px)' },
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              Add New Doctor
            </Button>
          </Stack>
        </Container>
      </Box>
 
      {/* --- CONTENT AREA --- */}
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
       
        {/* Stats Summary Bar */}
        <Paper elevation={0} sx={{
            p: 2, px: 4, mb: 6, borderRadius: 10,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            display: 'inline-flex', alignItems: 'center', gap: 3,
            boxShadow: "0 15px 35px -5px rgba(0,0,0,0.05)"
          }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#3b82f6", width: 44, height: 44 }}>
              <GroupIcon />
            </Avatar>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>{doctors.length}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL STAFF</Typography>
            </Box>
          </Stack>
        </Paper>
 
        {doctors.length === 0 ? (
          <Paper sx={{
            p: 8, textAlign: "center", borderRadius: 8,
            bgcolor: alpha("#fff", 0.6), border: '2px dashed #e2e8f0',
            backdropFilter: 'blur(4px)'
          }}>
            <PersonOutlineIcon sx={{ fontSize: 80, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h4" fontWeight={800} color="#1e293b">Team not formed yet</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}>
                Begin building your department by adding qualified medical professionals to the roster.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {doctors.map((doc) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4, borderRadius: 8, bgcolor: "white",
                    border: "1px solid #f1f5f9",
                    position: "relative", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 30px 60px -12px rgba(15, 23, 42, 0.12)",
                      borderColor: "#3b82f6"
                    },
                  }}
                >
                  {/* Delete Action Overlay */}
                  <IconButton
                    onClick={() => handleDelete(doc.id)}
                    sx={{
                        position: 'absolute', top: 15, right: 15,
                        color: alpha('#121111d7', 0.2),
                        "&:hover": { color: 'error.main', bgcolor: alpha('#ef4444', 0.1) }
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
 
                  <Stack alignItems="center" textAlign="center">
                    <Avatar sx={{
                      width: 85, height: 85, mb: 2,
                      fontWeight: 900, fontSize: '2rem',
                      boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                    }}>
                      {doc.name?.charAt(0)}
                    </Avatar>
 
                    <Typography variant="h5" fontWeight={900} sx={{ color: "#0f172a", mb: 0.5 }}>
                      Dr. {doc.name}
                    </Typography>
                   
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.7rem' }}>
                      {departmentName}
                    </Typography>
 
                    {/* Schedule Badge */}
                    <Box sx={{
                      width: '100%', p: 1.5, borderRadius: 4, bgcolor: "#f8fafc",
                      border: '1px solid #f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5
                    }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                      <Typography variant="body2" fontWeight={800} sx={{ color: '#334155' }}>
                        Weekly Off: <Box component="span" sx={{ color: '#3b82f6' }}>{getWeekDayName(doc.weekOffDay)}</Box>
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
 
      {/* Modernized Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
            sx: {
                borderRadius: 8,
                p: 2,
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)',
                backgroundImage: 'none' // Remove default paper texture
            }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.75rem', textAlign: 'center', color: '#1e293b' }}>
            New Staff Member
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <DoctorForm departmentId={departmentId} onCreated={() => { loadData(); setOpenDialog(false); }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
 
export default DepartmentDoctorsPage;