import { useEffect, useState } from "react";
import { fetchAll, createItem } from "../../services/api";
import { Doctor, ShiftAssignment, Shift } from "../../models";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { PersonAdd as PersonAddIcon, AssignmentInd as AssignmentIcon } from "@mui/icons-material";
import { getWeekDayName } from "../../utils/weekOffManager";
 
interface Department {
  id: number;
  name: string;
}
 
interface Props {
  departmentId: number;
  shiftId: number;
}
 
const AssignDoctorForm = ({ departmentId, shiftId }: Props) => {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
 
  const load = async () => {
    const doctors = await fetchAll<Doctor>("doctors");
    const allAssignments = await fetchAll<ShiftAssignment>("shiftAssignments");
    const allShifts = await fetchAll<Shift>("shifts");
    const allDepartments = await fetchAll<Department>("departments");
 
    setAllDoctors(doctors);
    setShifts(allShifts);
    setDepartments(allDepartments);
    setAssignments(allAssignments);
 
    filterAvailableDoctors(doctors, allAssignments);
  };
 
  const filterAvailableDoctors = (
  doctors: Doctor[],
  assignments: ShiftAssignment[]
) => {
  // Doctors belonging to this department
  const deptDoctors = doctors.filter(
    (d) => Number(d.departmentId) === Number(departmentId)
  );

  // 🔥 Get doctors already assigned in this department (ANY shift)
  const assignedDoctorIds = assignments
    .filter((a) => Number(a.departmentId) === Number(departmentId))
    .map((a) => Number(a.doctorId));

  // Remove them from available list
  const available = deptDoctors.filter(
    (d) => !assignedDoctorIds.includes(Number(d.id))
  );

  setAvailableDoctors(available);
};
 
  useEffect(() => {
    load();
  }, [departmentId, shiftId]);
 
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
 
  const currentAssignments = assignments.filter(
    (a) => Number(a.departmentId) === Number(departmentId) && Number(a.shiftId) === Number(shiftId)
  );
 
  return (
    <Box mt={4} sx={{ maxWidth: 900, mx: "auto", px: 2 }}>
      {/* Assignment Control Card */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, bgcolor: "background.paper" }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <PersonAddIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Assign Doctor to Shift
          </Typography>
        </Stack>
 
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
          <Autocomplete
            fullWidth
            options={availableDoctors}
            getOptionLabel={(option) => `${option.name} (Off: ${getWeekDayName(option.weekOffDay)})`}
            value={selectedDoctor}
            onChange={(_, value) => setSelectedDoctor(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Available Doctors"
                variant="outlined"
                placeholder="Type doctor name..."
              />
            )}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleAssign}
            disabled={!selectedDoctor}
            startIcon={<AssignmentIcon />}
            sx={{ px: 4, height: 56, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
          >
            Assign
          </Button>
        </Stack>
      </Paper>
 
      {/* Table Section */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="600" color="text.primary">
          Current Schedule
        </Typography>
        <Chip label={`${currentAssignments.length} Assigned`} color="secondary" variant="outlined" />
      </Box>
 
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", py: 2 }}>Doctor Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Shift Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Week Off</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAssignments.length > 0 ? (
              currentAssignments.map((a) => {
                const doctor = allDoctors.find((d) => Number(d.id) === Number(a.doctorId));
                const dept = departments.find((d) => Number(d.id) === Number(a.departmentId));
                const shift = shifts.find((s) => Number(s.id) === Number(a.shiftId));
 
                return (
                  <TableRow key={a.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Typography fontWeight="500">{doctor?.name || "Unknown Doctor"}</Typography>
                    </TableCell>
                    <TableCell>{dept?.name || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={shift?.name || "-"}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: "500" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={doctor ? getWeekDayName(doctor.weekOffDay) : "-"}
                        size="small"
                        color="info"
                        sx={{ minWidth: 90, borderRadius: 1 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No doctors assigned to this shift yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
 
export default AssignDoctorForm;