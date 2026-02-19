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
} from "@mui/material";
 
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
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 6,
        color: "white",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        Departments
      </Typography>
 
      {/* Create Department Card */}
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          transition: "0.4s",
          boxSizing: "border-box",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            transform: "translateY(-4px)",
          },
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "white",
              textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            Create New Department
          </Typography>
 
          <TextField
            fullWidth
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          />
 
          <Button
            variant="contained"
            sx={{
              alignSelf: "flex-end",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: "#ff4081",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#f50057",
                transform: "scale(1.05)",
              },
            }}
            onClick={handleCreate}
          >
            Create
          </Button>
        </Stack>
      </Paper>
 
      {/* Department Table Card */}
      <Paper
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          borderRadius: 3,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          transition: "0.4s",
          overflowX: "auto",
          boxSizing: "border-box",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          },
        }}
      >
        <DepartmentTable departments={departments} />
      </Paper>
    </Box>
  );
};
 
export default DepartmentPage;