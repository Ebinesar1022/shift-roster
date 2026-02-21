import {
  Typography,
  Box,
  Paper,
  Stack,
  alpha,
  Divider,
  Avatar,
  Chip
} from "@mui/material";
import { Roster, Shift } from "../../models";
 
// Icons
import ApartmentIcon from '@mui/icons-material/Apartment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
 
interface Props {
  departmentName: string;
  roster: Roster[];
  shifts: Shift[];
}
 
const DepartmentRosterSection = ({
  departmentName,
  roster,
  shifts,
}: Props) => {
 
  // Helper to get shift color based on name
  const getShiftTheme = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('morning')) return { color: '#10b981', bg: alpha('#10b981', 0.1) };
    if (n.includes('evening')) return { color: '#f59e0b', bg: alpha('#f59e0b', 0.1) };
    if (n.includes('night')) return { color: '#3b82f6', bg: alpha('#3b82f6', 0.1) };
    return { color: '#6366f1', bg: alpha('#6366f1', 0.1) };
  };
 
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#ffffff"
      }}
    >
      {/* Department Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
          <ApartmentIcon />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
          {departmentName}
        </Typography>
      </Stack>
 
      <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
 
      <Stack spacing={4}>
        {shifts.map((shift) => {
          const theme = getShiftTheme(shift.name);
          const shiftRoster = roster.filter((r) => r.shiftId === shift.id);
 
          return (
            <Box key={shift.id}>
              {/* Shift Title Badge */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <ScheduleIcon sx={{ fontSize: 18, color: theme.color }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: theme.color,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  {shift.name} Shift
                </Typography>
                <Chip
                  label={`${shiftRoster.length} Assigned`}
                  size="small"
                  sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20, bgcolor: theme.bg, color: theme.color }}
                />
              </Stack>
 
              {/* Roster Entries */}
              <Stack spacing={1} sx={{ pl: 3.5 }}>
                {shiftRoster.length > 0 ? (
                  shiftRoster.map((r) => (
                    <Paper
                      key={r.id}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: '0.2s',
                        '&:hover': { bgcolor: '#f1f5f9', transform: 'translateX(4px)' }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={600} color="#334155">
                          {new Date(r.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Stack>
 
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PersonIcon sx={{ fontSize: 16, color: theme.color }} />
                        <Typography variant="body2" fontWeight={700}>
                          Doctor ID: {r.doctorId}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                    No rotations scheduled for this shift.
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};
 
export default DepartmentRosterSection;