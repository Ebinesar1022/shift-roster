import { useEffect, useState } from "react";
import { fetchAll, createItem } from "../../services/api";
import DownloadIcon from "@mui/icons-material/Download";
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
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import Loader from "../../components/common/Loader";
import { exportRosterToExcel } from "../../utils/exportRosterToExcel";
import TableChartIcon from "@mui/icons-material/TableChart";

const RosterPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [roster, setRoster] = useState<Roster[]>([]);
  const [selectedDept, setSelectedDept] = useState<number | "ALL">("ALL");
  const [selectedShift, setSelectedShift] = useState<number | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | "ALL">("ALL");
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [currentDate, setCurrentDate] = useState(
    new Date(currentYear, currentMonth, 1),
  );

  const filteredRoster = roster.filter((r) => {
  const shiftMatch =
    selectedShift === "ALL" || r.shiftId === selectedShift;

  const doctorMatch =
    selectedDoctor === "ALL" || r.doctorId === selectedDoctor;

  const deptMatch =
    selectedDept === "ALL" || r.departmentId === selectedDept;

  return shiftMatch && doctorMatch && deptMatch;
});

  useEffect(() => {
    const load = async () => {
      setDepartments(await fetchAll("departments"));
      setDoctors(await fetchAll("doctors"));
      setShifts(await fetchAll("shifts"));
      setAssignments(await fetchAll("shiftAssignments"));
    };
    load();
  }, []);
  useEffect(() => {
    const loadMonthRoster = async () => {
      setLoading(true);

      const existing = await fetchAll<Roster>("rosters");

      const monthRoster = existing.filter(
        (r) => r.month === currentMonth && r.year === currentYear,
      );

      setRoster(monthRoster);
      setLoading(false);
    };

    loadMonthRoster();
  }, [currentMonth, currentYear]);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const deptIds =
        selectedDept === "ALL" ? departments.map((d) => d.id) : [selectedDept];

      // 🔥 Fetch existing rosters first
      const existing = await fetchAll<Roster>("rosters");

      // 🔥 Check if month already exists
      const monthRoster = existing.filter(
        (r) => r.month === currentMonth && r.year === currentYear,
      );

      if (monthRoster.length > 0) {
        setRoster(monthRoster);
        setLoading(false);
        return;
      }

      // 🔥 Generate new roster with continuation
      const data = generateMonthlyRoster(
        currentMonth,
        currentYear,
        deptIds,
        doctors,
        shifts,
        assignments,
        existing, // 👈 now it is defined
      );

      for (const item of data) {
        await createItem("rosters", item);
      }

      setRoster(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc", // Clean, soft professional background
        pb: 8,
      }}
    >
      {/* Top Header Section */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e2e8f0",
          mb: 4,
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{ p: 1, bgcolor: alpha("#0ea5e9", 0.1), borderRadius: 2 }}
              >
                <TableChartIcon sx={{ color: "#0ea5e9", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} color="#1e293b">
                  Master Schedule
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and export medical staff rotations
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() =>
                exportRosterToExcel(
                  filteredRoster,
                  doctors,
                  shifts,
                  departments,
                  "Filtered_Roster",
                )
              }
              sx={{
                px: 3,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2.5,
                bgcolor: "#10b981", // Modern Emerald Green
                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
                "&:hover": {
                  bgcolor: "#059669",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.23)",
                },
              }}
            >
              Export Report (Excel)
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Filter Control Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            background: "white",
          }}
        >
          <RosterFilter
            departments={departments}
            selectedDept={selectedDept}
            shifts={shifts}
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            selectedShift={selectedShift}
            onShiftChange={setSelectedShift}
            onDeptChange={setSelectedDept}
            onDoctorChange={setSelectedDoctor}
            onGenerate={handleGenerate}
          />
        </Paper>

        {/* Main Content Area */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <Loader />
          </Box>
        ) : (
          <Box
            sx={{
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
            }}
          >
            <RosterCalendar
              roster={filteredRoster}
              shifts={shifts}
              doctors={doctors}
              departments={departments}
              currentDate={currentDate}
              onMonthChange={(month, year) => {
                setCurrentMonth(month);
                setCurrentYear(year);
                setCurrentDate(new Date(year, month, 1));
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default RosterPage;
