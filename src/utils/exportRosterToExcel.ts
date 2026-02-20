import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Roster, Doctor, Shift, Department } from "../models";

export const exportRosterToExcel = (
  roster: Roster[],
  doctors: Doctor[],
  shifts: Shift[],
  departments: Department[],
  fileName: string
) => {

  const getDoctorName = (id: number) =>
    doctors.find((d) => d.id === id)?.name || "";

  const getShiftName = (shiftId: number | null) =>
    shifts.find((s) => s.id === shiftId)?.name || "OFF";

  const getDepartmentName = (id: number) =>
    departments.find((d) => d.id === id)?.name || "";

  const formattedData = roster.map((r) => ({
    Date: new Date(r.date).toLocaleDateString(),
    Doctor: getDoctorName(r.doctorId),
    Shift: r.status === "OFF" ? "OFF" : getShiftName(r.shiftId),
    Department: getDepartmentName(r.departmentId),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Roster");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(data, `${fileName}.xlsx`);
};
