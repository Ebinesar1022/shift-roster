import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { fetchAll } from "../../services/api";
import { Department, Shift, Doctor, Roster } from "../../models";
import AppointmentForm from "../../components/frontdesk/AppointmentForm";

const FrontDeskPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [roster, setRoster] = useState<Roster[]>([]);

  useEffect(() => {
    const load = async () => {
      setDepartments(await fetchAll("departments"));
      setShifts(await fetchAll("shifts"));
      setDoctors(await fetchAll("doctors"));
      setRoster(await fetchAll("rosters"));
    };
    load();
  }, []);

  return (
    <Box p={4}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Front Desk - Assign Patient
        </Typography>

        <AppointmentForm
          departments={departments}
          shifts={shifts}
          doctors={doctors}
          roster={roster}
        />
      </Paper>
    </Box>
  );
};

export default FrontDeskPage;