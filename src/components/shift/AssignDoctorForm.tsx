import { useEffect, useState } from "react";
import { fetchAll, createItem } from "../../services/api";
import { Doctor, ShiftAssignment } from "../../models";
import { Autocomplete, TextField, Button, Box } from "@mui/material";

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

    const deptDoctors = allDoctors.filter(
      (d) => d.departmentId === departmentId
    );

    const alreadyAssignedDoctorIds = allAssignments
      .filter((a) => a.shiftId === shiftId)
      .map((a) => a.doctorId);

    const availableDoctors = deptDoctors.filter(
      (d) => !alreadyAssignedDoctorIds.includes(d.id)
    );

    setDoctors(availableDoctors);
    setAssignments(allAssignments);
  };

  useEffect(() => {
    load();
  }, [departmentId]);

  const handleAssign = async () => {
    if (!selectedDoctor) return;

    await createItem("shiftAssignments", {
      id: Date.now(),
      departmentId,
      shiftId,
      doctorId: selectedDoctor.id,
    });

    setSelectedDoctor(null);
    load();
  };

  return (
    <Box mt={3}>
      <Autocomplete
        options={doctors}
        getOptionLabel={(option) =>
          `${option.name} (WeekOff: ${option.weekOffDay})`
        }
        value={selectedDoctor}
        onChange={(_, value) => setSelectedDoctor(value)}
        renderInput={(params) => (
          <TextField {...params} label="Select Doctor" />
        )}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleAssign}
      >
        Assign
      </Button>
    </Box>
  );
};

export default AssignDoctorForm;
