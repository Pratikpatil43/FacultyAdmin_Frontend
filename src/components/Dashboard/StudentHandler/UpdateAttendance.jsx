import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './updateAttendance.css';

const UpdateAttendance = () => {
    const [branch, setBranch] = useState('');
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [branches, setBranches] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecords, setFilteredRecords] = useState([]);

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchSelections();
    }, [token]);

    const fetchSelections = async () => {
        try {
            const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/faculty/getfacultySelection', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setBranches(response.data.branches);
            setClasses(response.data.classes);
            setSubjects(response.data.subject);
        } catch (error) {
            setErrorMessage('Error fetching selections.');
        }
    };

    const fetchAttendance = async () => {
        if (!branch || !className || !subject || !attendanceDate) {
            setErrorMessage('Please select branch, class, subject, and date.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `https://attendancetracker-backend1.onrender.com/api/faculty/attendance/getAttendance?branch=${branch}&className=${className}&subject=${subject}&attendanceDate=${attendanceDate}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.attendanceRecords.length === 0) {
                setMessage('No attendance records found for the selected date.');
                setAttendanceRecords([]);
            } else {
                const sortedRecords = response.data.attendanceRecords.sort((a, b) =>
                    a.studentUSN.slice(-3).localeCompare(b.studentUSN.slice(-3))
                );
                setAttendanceRecords(sortedRecords);
                setFilteredRecords(sortedRecords);  // Initialize filtered records with all data
                setMessage('');
            }
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('No attendance record found.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = attendanceRecords.filter((record) => 
            record.studentUSN.includes(e.target.value) || record.studentName.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredRecords(filtered);
    };

    const updateStatus = async (recordId, newStatus) => {
        if (newStatus !== 'present' && newStatus !== 'absent') {
            setErrorMessage('Invalid status selected.');
            return;
        }

        try {
            const response = await axios.put(
                `https://attendancetracker-backend1.onrender.com/api/faculty/attendance/updateAttendance/${recordId}`,
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setMessage(response.data.message);
            fetchAttendance(); // Re-fetch to update attendance records
        } catch (error) {
            setErrorMessage('Error updating attendance.');
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center">Fetch Attendance</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="row">
                <div className="col-md-3 col-sm-12 mb-3">
                    <label htmlFor="branch">Branch</label>
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

                <div className="col-md-3 col-sm-12 mb-3">
                    <label htmlFor="className">Class</label>
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

                <div className="col-md-3 col-sm-12 mb-3">
                    <label htmlFor="subject">Subject</label>
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

                <div className="col-md-3 col-sm-12 mb-3">
                    <label htmlFor="attendanceDate">Date</label>
                    <input
                        type="date"
                        id="attendanceDate"
                        className="form-control"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by USN or Name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <button onClick={fetchAttendance} className="btn btn-primary" disabled={loading}>
                {loading ? <ClipLoader size={20} /> : 'Fetch Attendance'}
            </button>

            <div className="mt-4">
                {attendanceRecords.length === 0 ? (
                    <p>No attendance records found for the selected date.</p>
                ) : (
                    <table className="table table-striped table-responsive mt-4">
                        <thead>
                            <tr>
                                <th>USN</th>
                                <th>Name</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(searchTerm ? filteredRecords : attendanceRecords).map((record) => (
                                <tr key={record.studentUSN} className={`status-${record.status}`}>
                                    <td>{record.studentUSN}</td>
                                    <td>{record.studentName}</td>
                                    <td>
                                        <select
                                            value={record.status}
                                            onChange={(e) => updateStatus(record._id, e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="present">Present</option>
                                            <option value="absent">Absent</option>
                                        </select>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UpdateAttendance;
