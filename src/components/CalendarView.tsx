import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Chip,
  Box,
  Avatar,
  Stack,
  alpha,
  TableContainer,
} from "@mui/material";
import { Roster } from "../models";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
 
interface Props {
  roster: Roster[];
}
 
const CalendarView = ({ roster }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 5,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        background: "#ffffff",
      }}
    >
      {/* Header with Icon and Gradient Background */}
      <Box
        sx={{
          p: 4,
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: alpha("#fff", 0.2), width: 50, height: 50 }}>
            <CalendarMonthIcon sx={{ color: "white" }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              Monthly Roster
            </Typography>
            <Typography variant="body2" sx={{ color: alpha("#fff", 0.7) }}>
              Operational schedule for hospital practitioners
            </Typography>
          </Box>
        </Stack>
      </Box>
 
      <TableContainer sx={{ px: 2, pb: 2, mt: -2 }}>
        <Table
          sx={{
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ color: "#64748b", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                Date & Timeline
              </TableCell>
              <TableCell sx={{ color: "#64748b", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                Shift Assignment
              </TableCell>
              <TableCell sx={{ color: "#64748b", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                Assigned Practitioner
              </TableCell>
            </TableRow>
          </TableHead>
 
          <TableBody>
            {roster.map((r) => (
              <TableRow
                key={r.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                }}
              >
                {/* Date Cell */}
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{
                      textAlign: 'center',
                      bgcolor: '#f1f5f9',
                      p: 1,
                      borderRadius: 2,
                      minWidth: 45
                    }}>
                      <Typography variant="caption" fontWeight={700} color="primary" sx={{ display: 'block', lineHeight: 1 }}>
                        DAY
                      </Typography>
                      <Typography variant="body1" fontWeight={900}>
                        {r.date.slice(8, 10)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      {new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </Typography>
                  </Stack>
                </TableCell>
 
                {/* Shift Cell */}
                <TableCell>
                  {r.shiftId ? (
                    <Chip
                      icon={<QueryBuilderIcon sx={{ fontSize: '16px !important' }} />}
                      label={`Shift ID: ${r.shiftId}`}
                      sx={{
                        fontWeight: 700,
                        bgcolor: alpha("#3b82f6", 0.1),
                        color: "#2563eb",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: alpha("#3b82f6", 0.2)
                      }}
                    />
                  ) : (
                    <Chip
                      label="OFF DAY"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        color: "#ef4444",
                        borderColor: "#fecaca",
                        bgcolor: "#fef2f2"
                      }}
                    />
                  )}
                </TableCell>
 
                {/* Doctor Cell */}
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#ecfdf5", color: "#10b981" }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" fontWeight={700} color="#1e293b">
                      Doctor ID: {r.doctorId}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
 
export default CalendarView;