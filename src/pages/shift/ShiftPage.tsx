import { useEffect, useState } from "react";
import { fetchAll } from "../../services/api";
import { Shift } from "../../models";
import ShiftForm from "../../components/shift/ShiftForm";
import ShiftList from "../../components/shift/ShiftList";
import { Box, Typography } from "@mui/material";
 
const ShiftPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
 
  const loadShifts = async () => {
    const data = await fetchAll<Shift>("shifts");
    setShifts(data);
  };
 
  useEffect(() => {
    loadShifts();
  }, []);
 
  return (
    <Box p={4}>
      <Typography variant="h5" sx={{textAlign:"center"}}><strong>SHIFTS</strong></Typography>
 
      <ShiftForm onCreated={loadShifts}  />
 
      <ShiftList shifts={shifts} />
    </Box>
  );
};
 
export default ShiftPage;