import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/jobs";

function JobResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filters = {
    title: queryParams.get("title") || "",
    location: queryParams.get("location") || "",
    company: queryParams.get("company") || "",
    skills: queryParams.get("skills") || "",
    jobType: queryParams.get("jobType") || "",
  };

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL).then(response => {
      if (response.data.jobs) {
        setJobs(response.data.jobs);
      }
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });
  }, []);

  const filteredJobs = jobs.filter(job =>
    (!filters.title || job.title?.toLowerCase().includes(filters.title.toLowerCase().trim())) ||
    (!filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase().trim())) ||
    (!filters.company || job.company?.toLowerCase().includes(filters.company.toLowerCase().trim())) ||
    (!filters.skills || job.skills?.toLowerCase().includes(filters.skills.toLowerCase().trim())) ||
    (!filters.jobType || job.job_type?.toLowerCase().includes(filters.jobType.toLowerCase().trim()))
  );

  return (
    <div className="container mt-5">
      <h1 className="text-primary text-center">📌 Job Listings</h1>

      {loading ? (
        <p className="text-muted text-center">Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-danger text-center">❌ No jobs found. Try modifying your search.</p>
      ) : (
        <div className="table-responsive">
          <h2 className="text-success text-center">✅ {filteredJobs.length} job{filteredJobs.length > 1 ? "s" : ""} found!</h2>
          <table className="table table-bordered table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Date Posted</th>
                <th>Job Type</th>
                <th>Skills</th>
                <th>Apply</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <tr key={index}>
                  <td>{job.title}</td>
                  <td>{job.company || "Unknown"}</td>
                  <td>{job.location}</td>
                  <td>{job.date_posted}</td>
                  <td>{job.job_type || "N/A"}</td>
                  <td>{job.skills || "N/A"}</td>
                  <td>
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      Apply
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default JobResults;
