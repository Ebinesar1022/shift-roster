import { useEffect, useState } from "react";
import { Department } from "../../models";
import { fetchAll, createItem } from "../../services/api";
import DepartmentTable from "../../components/department/DepartmentTable";
import { Box, Button, TextField, Typography } from "@mui/material";

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
    <Box p={4}>
      <Typography variant="h5">Departments</Typography>

      <Box mt={2} mb={2}>
        <TextField
          label="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleCreate}>
          Create
        </Button>
      </Box>

      <DepartmentTable departments={departments} />
    </Box>
  );
};

export default DepartmentPage;
