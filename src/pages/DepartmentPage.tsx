import { useEffect, useState } from "react";
import { fetchAll, createItem } from "../services/api";
import { Department } from "../models";
import DoctorForm from "../components/DoctorForm";
import { Button, TextField } from "@mui/material";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    setDepartments(await fetchAll("departments"));
  };

  useEffect(() => {
    load();
  }, []);

  const addDepartment = async () => {
    await createItem("departments", {
      id: Date.now(),
      name,
    });
    load();
  };

  return (
    <>
      <TextField
        label="Department Name"
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={addDepartment}>Add</Button>

      {departments.map((dept) => (
        <div key={dept.id}>
          <h3>{dept.name}</h3>
          <DoctorForm
            departmentId={dept.id}
            refresh={load}
          />
        </div>
      ))}
    </>
  );
};

export default DepartmentPage;
