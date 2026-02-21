import { Department } from "../../models";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  TableContainer,
  Typography,
  Box,
  Stack
} from "@mui/material";
import {
  NavigateNext as NextIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
 
interface Props {
  departments: Department[];
}
 
const DepartmentTable = ({ departments }: Props) => {
  const navigate = useNavigate();
 
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{
            background: "linear-gradient(90deg, #36f181c6 0%, #28d070c6 100%)",
          }}>
            <TableCell sx={{ color: "#1a3e2a", fontWeight: "bold", py: 2 }}>
              Department Name
            </TableCell>
            <TableCell sx={{ color: "#1a3e2a", fontWeight: "bold" }} align="right">
              Management
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.length > 0 ? (
            departments.map((dept) => (
              <TableRow
                key={dept.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                  cursor: "default"
                }}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        bgcolor: "success.light",
                        p: 1,
                        borderRadius: 1.5,
                        display: "flex",
                        color: "white"
                      }}
                    >
                      <BusinessIcon fontSize="small" />
                    </Box>
                    <Typography variant="body1" fontWeight="600" color="text.primary">
                      {dept.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PersonAddIcon />}
                    endIcon={<NextIcon />}
                    onClick={() => navigate(`/departments/${dept.id}/doctors`)}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        boxShadow: "0px 4px 10px rgba(54, 241, 129, 0.3)",
                      }
                    }}
                  >
                    Manage Doctors
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No departments found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
 
export default DepartmentTable;