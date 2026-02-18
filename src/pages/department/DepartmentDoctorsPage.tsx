import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Doctor } from "../../models";
import { fetchAll } from "../../services/api";
import DoctorForm from "../../components/department/DoctorForm";
import { Box, Typography } from "@mui/material";

const DepartmentDoctorsPage = () => {
  const { id } = useParams();
  const departmentId = Number(id);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const loadDoctors = async () => {
    const data = await fetchAll<Doctor>("doctors");
    setDoctors(
      data.filter((d) => d.departmentId === departmentId)
    );
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5">Doctors</Typography>

      <DoctorForm
        departmentId={departmentId}
        onCreated={loadDoctors}
      />

      <Box mt={3}>
        {doctors.map((doc) => (
          <Typography key={doc.id}>
            {doc.name} – Week Off Day: {doc.weekOffDay}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default DepartmentDoctorsPage;
