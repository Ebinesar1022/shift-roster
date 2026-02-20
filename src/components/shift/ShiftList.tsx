import { Shift } from "../../models";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Paper,
  Typography,
  Box,
  alpha,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
 
interface Props {
  shifts: Shift[];
}
 
const ShiftList = ({ shifts }: Props) => {
  const navigate = useNavigate();
 
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        background: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      {/* Header Section */}
      <Box
        p={3}
        sx={{
          borderBottom: "1px solid",
          borderColor: "grey.100",
          background: "linear-gradient(to right, #ffffff, #fcfdff)"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: alpha("#5970c4", 0.1), color: "#5970c4" }}>
            <EventRepeatIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
              Shift Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure staff assignments for daily rotations
            </Typography>
          </Box>
        </Stack>
      </Box>
 
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ color: "#64748b", fontWeight: 700, py: 2 }}>
                SHIFT NAME
              </TableCell>
              <TableCell sx={{ color: "#64748b", fontWeight: 700, py: 2 }}>
                SCHEDULE TIME
              </TableCell>
              <TableCell align="right" sx={{ color: "#64748b", fontWeight: 700, py: 2, pr: 4 }}>
                OPERATIONS
              </TableCell>
            </TableRow>
          </TableHead>
 
          <TableBody>
            {shifts.map((shift) => (
              <TableRow
                key={shift.id}
                sx={{
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: alpha("#5970c4", 0.02),
                  },
                }}
              >
                {/* Shift Name with Icon */}
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: "#334155" }}>
                    {shift.name}
                  </Typography>
                </TableCell>
 
                {/* Time with custom Badge styling */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                    <Chip
                      label={`${shift.startTime} — ${shift.endTime}`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: alpha("#5970c4", 0.05),
                        color: "#5970c4",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: alpha("#5970c4", 0.1)
                      }}
                    />
                  </Stack>
                </TableCell>
 
                {/* Action Button */}
                <TableCell align="right" sx={{ pr: 3 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AssignmentIndIcon />}
                    onClick={() => navigate(`/shifts/${shift.id}/assign`)}
                    sx={{
                      px: 3,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      boxShadow: "none",
                      background: "#1e293b", // Professional Slate color
                      "&:hover": {
                        background: "#0f172a",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transform: "translateY(-1px)"
                      },
                      transition: "all 0.2s"
                    }}
                  >
                    Assign Staff
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
 
      {/* Footer Info */}
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Typography variant="caption" color="text.disabled" fontWeight={500}>
          {shifts.length} Active Shifts Configured
        </Typography>
      </Box>
    </Paper>
  );
};
 
export default ShiftList;