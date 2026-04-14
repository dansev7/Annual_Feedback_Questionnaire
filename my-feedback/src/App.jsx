import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Survey from './pages/Survey';
import DashboardLayout from './pages/Dashboard';
import Overview from './pages/dashboard/Overview';
import Responses from './pages/dashboard/Responses';
import SWOTDeepDive from './pages/dashboard/SWOTDeepDive';
import PulseStrategic from './pages/dashboard/PulseStrategic';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Survey />} />
        <Route path="/results" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/results/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="responses" element={<Responses />} />
          <Route path="swot" element={<SWOTDeepDive />} />
          <Route path="pulse" element={<PulseStrategic />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
