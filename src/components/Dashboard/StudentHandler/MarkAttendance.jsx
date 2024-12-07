import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MarkAttendance = () => {
    const [branch, setBranch] = useState('');
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [branches, setBranches] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState('');
    const [attendanceData, setAttendanceData] = useState({});
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    // Fetch faculty selection data (branches, classes, subjects)
    const fetchSelections = async () => {
        if (!token) {
            setErrorMessage('You are not authorized. Please log in.');
            return;
        }

        try {
            const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/faculty/getfacultySelection', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setBranches(response.data.branches);
            setClasses(response.data.classes);
            setSubjects(response.data.subject);
        } catch (error) {
            setErrorMessage('Error fetching faculty selection.');
        }
    };

    // Fetch students based on selected branch, class, and subject
    const fetchStudents = async () => {
        if (!branch || !className || !subject) {
            setErrorMessage('Please select branch, class, and subject.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'https://attendancetracker-backend1.onrender.com/api/faculty/getStudents',
                { branch, className, subject },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Sort students by the last 3 digits of their studentUSN
            const sortedStudents = response.data.students.sort((a, b) => {
                const lastThreeA = a.studentUSN.slice(-3);
                const lastThreeB = b.studentUSN.slice(-3);
                return lastThreeA.localeCompare(lastThreeB);
            });

            setStudents(sortedStudents);

            // Set default attendance status to 'present' for all students
            const defaultAttendance = {};
            sortedStudents.forEach((student) => {
                defaultAttendance[student.studentUSN] = 'present';
            });
            setAttendanceData(defaultAttendance);

            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error fetching students.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Attendance Status Change (For Present or Absent)
    const handleAttendanceChange = (usn, status) => {
        setAttendanceData((prev) => ({
            ...prev,
            [usn]: status,
        }));
    };

    // Function to confirm and save attendance data
    const confirmAttendance = async () => {
        if (!attendanceDate || Object.keys(attendanceData).length === 0) {
            setErrorMessage('Please select a date and mark attendance for students.');
            return;
        }

        try {
            const response = await axios.post(
                'https://attendancetracker-backend1.onrender.com/api/faculty/attendance/markAttendance',
                {
                    subject,
                    branch,
                    className,
                    attendanceDate,
                    attendanceData,
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );
            toast.success(response.data.message); // Show success toast

            // Clear the form and reset states after successful attendance marking
            setBranch('');
            setClassName('');
            setSubject('');
            setStudents([]);
            setAttendanceDate('');
            setAttendanceData({});
            setSearchTerm('');
        } catch (error) {
            toast.error('Error marking attendance.'); // Show error toast
        }
    };

    // Fetch available selections when the component mounts
    useEffect(() => {
        fetchSelections();
    }, [token]);

    // Filter students based on search term
    const filteredStudents = students.filter(
        (student) =>
            student.studentUSN.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h3>Mark Attendance</h3>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Branch Selection */}
            <div className="mb-3">
                <label htmlFor="branch" className="form-label">Branch</label>
                <select
                    id="branch"
                    className="form-control"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                >
                    <option value="">Select Branch</option>
                    {branches.map((b, index) => (
                        <option key={index} value={b}>{b}</option>
                    ))}
                </select>
            </div>

            {/* Class Selection */}
            <div className="mb-3">
                <label htmlFor="className" className="form-label">Class</label>
                <select
                    id="className"
                    className="form-control"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                >
                    <option value="">Select Class</option>
                    {classes.map((c, index) => (
                        <option key={index} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Subject Selection */}
            <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <select
                    id="subject"
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                >
                    <option value="">Select Subject</option>
                    {subjects.map((s, index) => (
                        <option key={index} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Date Picker for Attendance Date */}
            <div className="mb-3">
                <label htmlFor="attendanceDate" className="form-label">Attendance Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                />
            </div>

            {/* Fetch Students Button */}
            <button
                onClick={fetchStudents}
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Fetch Students'}
            </button>

            {/* Search Bar */}
            <div className="mt-4 mb-3">
                <label htmlFor="searchTerm" className="form-label">Search by USN or Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="searchTerm"
                    placeholder="Search students"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Display Students */}
            <div className="mt-4">
                <h5>Students</h5>
                {filteredStudents.length === 0 ? (
                    <p>No students found for the selected criteria.</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>USN</th>
                                <th>Name</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.studentUSN}>
                                    <td>{student.studentUSN}</td>
                                    <td>{student.studentName}</td>
                                    <td>
                                        <select
                                            value={attendanceData[student.studentUSN] || 'present'}
                                            onChange={(e) => handleAttendanceChange(student.studentUSN, e.target.value)}
                                            className="form-control"
                                            style={{
                                                borderColor: attendanceData[student.studentUSN] === 'present' ? 'green' : attendanceData[student.studentUSN] === 'absent' ? 'red' : 'none',
                                            }}
                                        >
                                            <option value="present">Present</option>
                                            <option value="absent">Absent</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Confirm Attendance Button */}
            <button
                onClick={confirmAttendance}
                className="btn btn-success mt-4"
            >
                Confirm Attendance
            </button>
        </div>
    );
};

export default MarkAttendance;
