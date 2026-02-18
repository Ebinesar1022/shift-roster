import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import DepartmentPage from "../pages/department/DepartmentPage";
import DepartmentDoctorsPage from "../pages/department/DepartmentDoctorsPage";
import ShiftPage from "../pages/shift/ShiftPage";
import AssignShiftPage from "../pages/shift/AssignShiftPage";
import RosterPage from "../pages/roster/RosterPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/departments" element={<DashboardLayout><DepartmentPage /></DashboardLayout>} />
        <Route
          path="/departments/:id/doctors"
          element={<DashboardLayout> <DepartmentDoctorsPage /></DashboardLayout>}
        />

        <Route path="/shifts" element={<DashboardLayout><ShiftPage /></DashboardLayout>} />
        <Route
          path="/shifts/:shiftId/assign"
          element={<DashboardLayout><AssignShiftPage /></DashboardLayout>}
        />

        <Route path="/roster" element={<RosterPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
