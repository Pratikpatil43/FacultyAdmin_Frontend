// src/components/ViewProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Or get token from wherever you store it
        const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/faculty/viewProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.user); // Assuming your API response structure
      } catch (err) {
        setError('Error fetching profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleBackClick = () => {
    navigate('/dashboard'); // Navigate back to dashboard
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Faculty Profile</h3>
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : profile ? (
            <>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Name:</div>
                <div className="col-md-8">{profile.name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Username:</div>
                <div className="col-md-8">{profile.facultyUsername}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Branch:</div>
                <div className="col-md-8">{profile.branch}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Subject:</div>
                <div className="col-md-8">{profile.subject}</div>
              </div>
            </>
          ) : (
            <div className="text-center">Loading...</div>
          )}
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-primary" onClick={handleBackClick}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
