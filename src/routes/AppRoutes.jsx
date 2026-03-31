import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Tracks from "../pages/Tracks";
import AddTrack from "../pages/AddTrack";
import EditTrack from "../pages/EditTrack";
import Alerts from "../pages/Alerts";
import Maintenance from "../pages/Maintenance";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/add-track" element={<AddTrack />} />
        <Route path="/edit-track/:id" element={<EditTrack />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/maintenance" element={<Maintenance/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;