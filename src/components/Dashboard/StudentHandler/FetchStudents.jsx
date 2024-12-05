import React, { useState } from 'react';
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
    const [updateLateralEntry, setUpdateLateralEntry] = useState(false);

    const fetchStudents = () => {
        if (!branch || !className || !subject) {
            setErrorMessage('Please enter branch, class, and subject.');
            return;
        }

        setLoading(true);
        const token = sessionStorage.getItem('token');
        axios.post('http://localhost:5000/api/faculty/getStudents', {
            branch,
            className,
            subject,
        }, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then((response) => {
            setStudents(response.data.students);
            setMessage('Students fetched successfully.');
            setErrorMessage('');
        })
        .catch((error) => {
            setErrorMessage('Error fetching students.');
            setMessage('');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleUpdateClick = (student) => {
        setSelectedStudent(student);
        setUpdateName(student.studentName);
        setUpdateLateralEntry(student.isLateralEntry); // Set to true or false based on the current status
    };

    const handleUpdateStudent = () => {
        const token = sessionStorage.getItem('token');
        if (!selectedStudent) {
            setErrorMessage('No student selected to update');
            return;
        }

        if (!selectedStudent.studentUSN) {
            setErrorMessage('Student USN is missing');
            return;
        }

        axios.put('http://localhost:5000/api/faculty/updateStudent', {
            studentUSN: selectedStudent.studentUSN,
            studentName: updateName,
            isLateralEntry: updateLateralEntry, // Will send true/false based on the checkbox state
        }, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(() => {
            fetchStudents(); // Refresh the student list
            setSelectedStudent(null); // Close the modal
            setMessage('Student updated successfully.');
        })
        .catch((error) => {
            setErrorMessage('Error updating student.');
        });
    };

    const handleDeleteStudent = (studentUSN) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this student?');
        if (confirmDelete) {
            const token = sessionStorage.getItem('token');
            axios.delete('http://localhost:5000/api/faculty/deleteStudent', {
                data: { studentUSN },
                headers: { 'Authorization': `Bearer ${token}` },
            })
            .then(() => {
                fetchStudents(); // Refresh the student list
                setMessage('Student deleted successfully.');
            })
            .catch((error) => {
                setErrorMessage('Error deleting student.');
            });
        }
    };

    const filteredStudents = students.filter(student => {
        return (
            student.studentUSN.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="container mt-4">
            <h3>Manage Students</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Input fields for branch, class, and subject */}
            <div className="mb-3">
                <label htmlFor="branch" className="form-label">Branch</label>
                <input
                    type="text"
                    id="branch"
                    className="form-control"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Enter Branch"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="className" className="form-label">Class</label>
                <input
                    type="text"
                    id="className"
                    className="form-control"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Enter Class"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                    type="text"
                    id="subject"
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter Subject"
                />
            </div>

            <button onClick={fetchStudents} className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Fetch Students'}
            </button>

            {/* Search Input */}
            <div className="mt-4 mb-3">
                <label htmlFor="search" className="form-label">Search Students</label>
                <input
                    id="search"
                    type="text"
                    className="form-control"
                    placeholder="Search by USN or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Display Student Data */}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>USN</th>
                            <th>Name</th>
                            <th>Lateral Entry</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.studentUSN}>
                                <td>{student.studentUSN}</td>
                                <td>{student.studentName}</td>
                                <td>{student.isLateralEntry ? 'Yes' : 'No'}</td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateClick(student)}
                                        className="btn btn-warning btn-sm"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDeleteStudent(student.studentUSN)}
                                        className="btn btn-danger btn-sm ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Update Modal */}
            {selectedStudent && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Student</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setSelectedStudent(null)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="updateName" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="updateName"
                                        className="form-control"
                                        value={updateName}
                                        onChange={(e) => setUpdateName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Lateral Entry</label>
                                    <input
                                        type="checkbox"
                                        checked={updateLateralEntry}
                                        onChange={(e) => setUpdateLateralEntry(e.target.checked)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedStudent(null)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateStudent}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FetchStudents;
