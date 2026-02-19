import { useEffect, useState } from "react";
import { fetchAll, createItem } from "../../services/api";
import { Doctor, ShiftAssignment } from "../../models";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { getWeekDayName } from "../../utils/weekOffManager";

interface Props {
  departmentId: number;
  shiftId: number;
}

const AssignDoctorForm = ({ departmentId, shiftId }: Props) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const load = async () => {
    const allDoctors = await fetchAll<Doctor>("doctors");
    const allAssignments = await fetchAll<ShiftAssignment>("shiftAssignments");

    // Filter doctors of selected department
    const deptDoctors = allDoctors.filter(
      (d) => Number(d.departmentId) === Number(departmentId),
    );

    // 🚀 Get ALL assigned doctor IDs (any shift)
    const alreadyAssignedDoctorIds = allAssignments.map((a) =>
      Number(a.doctorId),
    );

    // 🚀 Remove doctors who are already assigned anywhere
    const availableDoctors = deptDoctors.filter(
      (d) => !alreadyAssignedDoctorIds.includes(Number(d.id)),
    );

    setDoctors(availableDoctors);
  };

  useEffect(() => {
    load();
  }, [departmentId]);

  const handleAssign = async () => {
    if (!selectedDoctor) return;

    await createItem("shiftAssignments", {
      id: Date.now(),
      departmentId: Number(departmentId),
      shiftId: Number(shiftId),
      doctorId: Number(selectedDoctor.id),
    });

    setSelectedDoctor(null);
    load();
  };

  return (
    <Box mt={3}>
      <Autocomplete
        options={doctors}
        getOptionLabel={(option) =>
          `${option.name} (WeekOff: ${getWeekDayName(option.weekOffDay)})`
        }
        value={selectedDoctor}
        onChange={(_, value) => setSelectedDoctor(value)}
        renderInput={(params) => (
          <TextField {...params} label="Select Doctor" />
        )}
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAssign}>
        Assign
      </Button>
    </Box>
  );
};

export default AssignDoctorForm;
