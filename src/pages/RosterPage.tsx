import { useEffect, useState } from "react";
import { fetchAll, createItem } from "../services/api";
import { Department, Doctor, Shift } from "../models";
import { generateMonthlyRoster } from "../utils/rosterEngine";
import CalendarView from "../components/CalendarView";

const RosterPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setDepartments(await fetchAll("departments"));
    setDoctors(await fetchAll("doctors"));
    setShifts(await fetchAll("shifts"));
  };

  const generate = () => {
    const data = generateMonthlyRoster(
      doctors,
      shifts,
      departments[0].id,
      4,
      2026
    );
    setRoster(data);
  };

  return (
    <>
      <button onClick={generate}>Generate Roster</button>
      <CalendarView roster={roster} />
    </>
  );
};

export default RosterPage;
