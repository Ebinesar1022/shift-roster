import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAll } from "../../services/api";
import { Department, Shift } from "../../models";
import AssignDoctorForm from "../../components/shift/AssignDoctorForm";
import { Box, Typography, Button } from "@mui/material";

const AssignShiftPage = () => {
  const { shiftId } = useParams();
  const shiftID = Number(shiftId);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);

  useEffect(() => {
    const load = async () => {
      const dept = await fetchAll<Department>("departments");
      const shifts = await fetchAll<Shift>("shifts");

      setDepartments(dept);
      setShift(shifts.find((s) => s.id === shiftID) || null);
    };

    load();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5">
        Assign Doctors – {shift?.name}
      </Typography>

      {departments.map((dept) => (
        <Button
          key={dept.id}
          sx={{ mr: 2, mt: 2 }}
          variant="outlined"
          onClick={() => setSelectedDept(dept.id)}
        >
          {dept.name}
        </Button>
      ))}

      {selectedDept && shift && (
        <AssignDoctorForm
          departmentId={selectedDept}
          shiftId={shiftID}
        />
      )}
    </Box>
  );
};

export default AssignShiftPage;
