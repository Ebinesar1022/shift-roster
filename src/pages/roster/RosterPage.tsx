import { useEffect, useState } from "react";
import { fetchAll, createItem } from "../../services/api";
import {
  Department,
  Doctor,
  Shift,
  ShiftAssignment,
  Roster,
} from "../../models";
import { generateMonthlyRoster } from "../../utils/rosterEngine";
import RosterFilter from "../../components/roster/RosterFilter";
import RosterCalendar from "../../components/roster/RosterCalendar";
import { Box } from "@mui/material";
import Loader from "../../components/common/Loader";

const RosterPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [roster, setRoster] = useState<Roster[]>([]);
  const [selectedDept, setSelectedDept] = useState<number | "ALL">("ALL");
  const [selectedShift, setSelectedShift] = useState<number | "ALL">("ALL");
  const [loading,setLoading]=useState(false);
  const filteredRoster =
  selectedShift === "ALL"
    ? roster
    : roster.filter(
        (r) => r.shiftId === selectedShift
      );


  useEffect(() => {
    const load = async () => {
      setDepartments(await fetchAll("departments"));
      setDoctors(await fetchAll("doctors"));
      setShifts(await fetchAll("shifts"));
      setAssignments(await fetchAll("shiftAssignments"));
    };

    load();
  }, []);

  const handleGenerate = async () => {
     try {
    setLoading(true);
    const deptIds =
      selectedDept === "ALL" ? departments.map((d) => d.id) : [selectedDept];

    const data = generateMonthlyRoster(
      2, // March (0-based index)
      2026,
      deptIds,
      doctors,
      shifts,
      assignments,
    );
  for (const item of data) {
    await createItem("rosters", item);
  }
    setRoster(data);
  }
   catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box p={4}>
      <RosterFilter
        departments={departments}
        selectedDept={selectedDept}
        shifts={shifts}
        selectedShift={selectedShift}
        onShiftChange={setSelectedShift}
        onDeptChange={setSelectedDept}
        onGenerate={handleGenerate}
      />

{loading ? (
  <Loader />
) : (
  <RosterCalendar
    roster={filteredRoster}
    shifts={shifts}
    doctors={doctors}
  />
)}
    </Box>
  );
};

export default RosterPage;
