import { Department } from "../../models";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  departments: Department[];
}

const DepartmentTable = ({ departments }: Props) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Department Name</TableCell>
          <TableCell>Add Doctor</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {departments.map((dept) => (
          <TableRow key={dept.id}>
            <TableCell>{dept.name}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/departments/${dept.id}/doctors`)
                }
              >
                Add Doctor
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentTable;
