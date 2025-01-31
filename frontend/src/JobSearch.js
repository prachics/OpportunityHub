import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function JobSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    location: "",
    company: "",
    skills: "",
    jobType: "",
  });

  const handleInputChange = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const queryString = new URLSearchParams(searchQuery).toString();
    navigate(`/results?${queryString}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex flex-col items-center justify-center text-white p-10">
      <h1 className="text-4xl font-bold mb-6">JobCruncher - Find Your Dream Job</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-gray-900">
        <h2 className="text-2xl font-semibold text-center mb-4">Search for Jobs</h2>

        <div className="flex flex-col space-y-4">
          <input type="text" name="title" placeholder="Job Title" value={searchQuery.title} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="location" placeholder="Location" value={searchQuery.location} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="company" placeholder="Company Name" value={searchQuery.company} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="skills" placeholder="Technical Skills" value={searchQuery.skills} onChange={handleInputChange} className="p-2 border rounded" />
          <select name="jobType" value={searchQuery.jobType} onChange={handleInputChange} className="p-2 border rounded">
            <option value="">All Job Types</option>
            <option value="Full-time">Full-Time</option>
            <option value="Part-time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>

          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobSearch;
