import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LeadForm from "./components/LeadForm.jsx";
import LeadList from "./pages/LeadList.jsx";


function App() {
  return (
    <Router>
      

      <Routes>
        <Route path="/" element={<LeadForm />} />
        <Route path="/leads" element={<LeadList />} />
      </Routes>
    </Router>
  );
}

export default App;
