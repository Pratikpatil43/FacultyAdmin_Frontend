import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStudentForm = () => {
    const [facultyData, setFacultyData] = useState({
        branches: [],
        classes: [],
        dates: [],
    });
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedClassName, setSelectedClassName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentUSN, setStudentUSN] = useState('');
    const [isLateralEntry, setIsLateralEntry] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for loading

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        axios.get('https://attendancetracker-backend1.onrender.com/api/faculty/getSelection', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            setFacultyData({
                branches: response.data.branches || [],
                classes: response.data.classes || [],
                dates: response.data.dates || [],
            });
        })
        .catch((error) => {
            setMessage('Error fetching faculty data.');
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true

        const studentData = {
            studentName,
            studentUSN,
            isLateralEntry, // Include the isLateralEntry state
            selectedBranch,
            selectedClassName,
            selectedDate,
        };

        const token = sessionStorage.getItem('token');

        axios.post('https://attendancetracker-backend1.onrender.com/api/faculty/addStudent', studentData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            // Clear form and show success message
            setStudentName('');
            setStudentUSN('');
            setIsLateralEntry(false);
            setSelectedBranch('');
            setSelectedClassName('');
            setSelectedDate('');
            setMessage('Student added successfully.');
            setErrorMessage(''); // Clear any previous error messages
            setLoading(false); // Set loading state to false
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.message) {
                // If the error is related to the duplicate USN, show it
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error submitting student data.');
            }
            setMessage(''); // Clear success message if there's an error
            setLoading(false); // Set loading state to false
        });
    };

    return (
        <div className="container mt-4">
            <h3>Add Student</h3>

            {/* Success or Error message */}
            {message && <div className="mt-3 alert alert-success">{message}</div>}
            {errorMessage && <div className="mt-3 alert alert-danger">{errorMessage}</div>}

            {/* Student Name */}
            <div className="mb-3">
                <label htmlFor="studentName" className="form-label">Student Name</label>
                <input
                    type="text"
                    id="studentName"
                    className="form-control"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                />
            </div>

            {/* Student USN */}
            <div className="mb-3">
                <label htmlFor="studentUSN" className="form-label">Student USN</label>
                <input
                    type="text"
                    id="studentUSN"
                    className="form-control"
                    value={studentUSN}
                    onChange={(e) => setStudentUSN(e.target.value)}
                />
            </div>

            {/* Lateral Entry */}
            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    id="lateralEntry"
                    className="form-check-input"
                    checked={isLateralEntry}
                    onChange={() => setIsLateralEntry(!isLateralEntry)} // Toggle the value
                />
                <label htmlFor="lateralEntry" className="form-check-label">Lateral Entry</label>
            </div>

            {/* Select Branch */}
            <div className="mb-3">
                <label htmlFor="branch" className="form-label">Branch</label>
                <select
                    id="branch"
                    className="form-control"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                >
                    <option value="">Select Branch</option>
                    {facultyData.branches.map((branch) => (
                        <option key={branch} value={branch}>
                            {branch}
                        </option>
                    ))}
                </select>
            </div>

            {/* Select Class */}
            <div className="mb-3">
                <label htmlFor="className" className="form-label">Class</label>
                <select
                    id="className"
                    className="form-control"
                    value={selectedClassName}
                    onChange={(e) => setSelectedClassName(e.target.value)}
                >
                    <option value="">Select Class</option>
                    {facultyData.classes.map((className) => (
                        <option key={className} value={className}>
                            {className}
                        </option>
                    ))}
                </select>
            </div>

            {/* Select Date */}
            <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <select
                    id="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    <option value="">Select Date</option>
                    {facultyData.dates.map((date) => (
                        <option key={date} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submit Button with Loader */}
            <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading} // Disable button while loading
            >
                {loading ? (
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    'Submit'
                )}
            </button>
        </div>
    );
};

export default AddStudentForm;
