import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobSearch from "./JobSearch";
import JobResults from "./JobResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobSearch />} />
        <Route path="/results" element={<JobResults />} />
      </Routes>
    </Router>
  );
}

export default App;
