import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchStudents = () => {
    const [branch, setBranch] = useState('');
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [updateName, setUpdateName] = useState('');
    const [branches, setBranches] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchSelections();
    }, [token]);

    // Fetch selection data (branches, classes, subjects)
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

    // Fetch students based on branch, class, and subject
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

            const sortedStudents = response.data.students.sort((a, b) =>
                a.studentUSN.slice(-3).localeCompare(b.studentUSN.slice(-3))
            );

            setStudents(sortedStudents);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error fetching students.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = (student) => {
        setSelectedStudent(student);
        setUpdateName(student.studentName);
        setUpdateLateralEntry(student.isLateralEntry); // Set to true or false based on the current status
    };

    // Update student details
    const handleUpdateStudent = async () => {
        if (!selectedStudent) {
            setErrorMessage('No student selected for update.');
            return;
        }

        try {
            await axios.put(
                'https://attendancetracker-backend1.onrender.com/api/faculty/updateStudent',
                { studentUSN: selectedStudent.studentUSN, studentName: updateName },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('Student updated successfully.');
            fetchStudents();
            setSelectedStudent(null);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error updating student.');
        }
    };

    // Delete student
    const handleDeleteStudent = async (studentUSN) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(
                    'https://attendancetracker-backend1.onrender.com/api/faculty/deleteStudent',
                    {
                        data: { studentUSN },
                        headers: { 'Authorization': `Bearer ${token}` },
                    }
                );
                setMessage('Student deleted successfully.');
                fetchStudents();
            } catch (error) {
                setErrorMessage('Error deleting student.');
            }
        }
    };

    // Filter students based on search term
    const filteredStudents = students.filter(
        (student) =>
            student.studentUSN.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h3>Fetch Students</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Branch Selection */}
            <div className="mb-3">
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

            {/* Class Selection */}
            <div className="mb-3">
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

            {/* Subject Selection */}
            <div className="mb-3">
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

            {/* Fetch Students Button */}
            <button onClick={fetchStudents} className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Students'}
            </button>

            {/* Search Bar */}
            <div className="mt-4 mb-3">
                <label htmlFor="search">Search</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by USN or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Students Table */}
            <div className="mt-4">
                {filteredStudents.length === 0 ? (
                    <p>No students found.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>USN</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.studentUSN}>
                                    <td>{student.studentUSN}</td>
                                    <td>
                                        {selectedStudent?.studentUSN === student.studentUSN ? (
                                            <input
                                                type="text"
                                                value={updateName}
                                                onChange={(e) => setUpdateName(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            student.studentName
                                        )}
                                    </td>
                                    <td>
                                        {selectedStudent?.studentUSN === student.studentUSN ? (
                                            <button
                                                onClick={handleUpdateStudent}
                                                className="btn btn-success btn-sm"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateClick(student)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student.studentUSN)}
                                                    className="btn btn-danger btn-sm ml-2"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
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

export default FetchStudents;
