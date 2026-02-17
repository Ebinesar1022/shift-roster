import { useEffect, useState } from "react";
import { fetchAll } from "../services/api";
import { Shift } from "../models";
import ShiftForm from "../components/ShiftForm";

const ShiftPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);

  const load = async () => {
    setShifts(await fetchAll("shifts"));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <ShiftForm refresh={load} />

      {shifts.map((shift) => (
        <div key={shift.id}>
          {shift.name} ({shift.startTime} - {shift.endTime})
        </div>
      ))}
    </>
  );
};

export default ShiftPage;
