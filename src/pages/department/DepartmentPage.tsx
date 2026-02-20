import { useEffect, useState } from "react";
import { Department } from "../../models";
import { fetchAll, createItem } from "../../services/api";
import DepartmentTable from "../../components/department/DepartmentTable";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Container,
  InputAdornment,
  alpha,
  Grid as Grid, // Using standard MUI Grid2 for better layout
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BusinessIcon from '@mui/icons-material/Business';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LayersIcon from '@mui/icons-material/Layers';
 
const DepartmentPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
 
  const loadDepartments = async () => {
    const data = await fetchAll<Department>("departments");
    setDepartments(data);
  };
 
  useEffect(() => {
    loadDepartments();
  }, []);
 
  const handleCreate = async () => {
    if (!name) return;
    await createItem("departments", {
      id: Date.now(),
      name,
    });
    setName("");
    loadDepartments();
  };
 
  return (
    <Box sx={{
      width: "100%",
      minHeight: "100vh",
      bgcolor: "#f8fafc",
      pb: 10
    }}>
     
      {/* Header Section */}
      <Box sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          pt: 10,
          pb: 15,
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
        {/* Abstract Background Decoration */}
        <Box sx={{
          position: 'absolute', top: -100, right: -100, width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)'
        }} />
 
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Box sx={{ p: 1, bgcolor: alpha("#6366f1", 0.2), borderRadius: 2, display: 'flex' }}>
                  <BusinessIcon sx={{ fontSize: 32, color: '#818cf8' }} />
                </Box>
                <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.04em" }}>
                  Unit <Box component="span" sx={{ color: '#818cf8' }}>Registry</Box>
                </Typography>
              </Stack>
              <Typography sx={{ color: alpha("#fff", 0.6), fontSize: "1.1rem", maxWidth: 500, fontWeight: 500 }}>
                Define hospital departments, manage specialty focus areas, and organize clinical hierarchies.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>
 
      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ mt: -8 }}>
        <Grid container spacing={4}>
         
          {/* Action Area: Create Department */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 6,
                border: "1px solid",
                borderColor: alpha("#e2e8f0", 0.8),
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                bgcolor: "white",
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, color: "#334155", display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddCircleOutlineIcon sx={{ color: '#6366f1' }} fontSize="small" />
                Register New Department
              </Typography>
             
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Enter unit name (e.g., Radiology)..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      bgcolor: "#f8fafc",
                      transition: 'all 0.2s',
                      "&:hover": { bgcolor: "#f1f5f9" },
                      "&.Mui-focused": { bgcolor: "#fff" }
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disableElevation
                  sx={{
                    px: 6,
                    py: { xs: 1.5, sm: 0 },
                    borderRadius: 4,
                    fontWeight: 800,
                    textTransform: "none",
                    bgcolor: "#6366f1",
                    "&:hover": { bgcolor: "#4f46e5" }
                  }}
                >
                  Create Unit
                </Button>
              </Stack>
            </Paper>
          </Grid>
 
          {/* Quick Stats Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 6,
                background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.3)",
              }}
            >
              <LayersIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 140, opacity: 0.1 }} />
              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 800, letterSpacing: 2 }}>
                  System Capacity
                </Typography>
                <Typography variant="h2" fontWeight={900}>{departments.length}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, bgcolor: alpha("#fff", 0.1), py: 0.5, px: 1.5, borderRadius: 2, display: 'inline-block', width: 'fit-content' }}>
                  Total Departments Active
                </Typography>
              </Stack>
            </Paper>
          </Grid>
 
          {/* Table Section */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 6,
                border: "1px solid",
                borderColor: "#e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                bgcolor: "white"
              }}
            >
              <Box sx={{
                p: 3,
                px: 4,
                borderBottom: "1px solid #f1f5f9",
                bgcolor: "#fff",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AnalyticsIcon sx={{ color: '#64748b' }} />
                  <Typography variant="h6" fontWeight={800} color="#1e293b">
                    Department Directory
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Verified Units Only
                </Typography>
              </Box>
             
              <Box sx={{ p: 2 }}>
                <DepartmentTable departments={departments} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
 
export default DepartmentPage;