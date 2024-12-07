import React, { useState } from 'react';
import axios from 'axios';

const SetSelection = () => {
    const [branch, setBranch] = useState('');
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState([]);
    const [date, setDate] = useState('');
    const [subjectsInput, setSubjectsInput] = useState('');
    const [message, setMessage] = useState('');

    // Retrieve token from localStorage (or sessionStorage, or cookies)
    const token = sessionStorage.getItem('token'); // Ensure 'authToken' is set upon login

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare the data to be sent
        const data = {
            branch,
            className,
            subject,
            date
        };

        try {
            const response = await axios.post('https://attendancetracker-backend1.onrender.com/api/faculty/setSelection', data, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach the token to the request headers
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.message}`);
            } else {
                setMessage('Error setting faculty selection.');
            }
            console.error('Error:', error);
        }
    };

    const handleAddSubject = () => {
        if (subjectsInput && !subject.includes(subjectsInput)) {
            setSubject([...subject, subjectsInput]);
            setSubjectsInput('');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Set Faculty Selection</h3>
            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="branch" className="form-label">Branch</label>
                    <input
                        type="text"
                        id="branch"
                        className="form-control"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="className" className="form-label">Class Name</label>
                    <input
                        type="text"
                        id="className"
                        className="form-control"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="subjects" className="form-label">Subjects</label>
                    <div className="input-group">
                        <input
                            type="text"
                            id="subjects"
                            className="form-control"
                            value={subjectsInput}
                            onChange={(e) => setSubjectsInput(e.target.value)}
                            placeholder="Enter subject"
                        />
                        <button type="button" className="btn btn-primary" onClick={handleAddSubject}>
                            Add Subject
                        </button>
                    </div>
                    <ul className="mt-2">
                        {subject.map((sub, index) => (
                            <li key={index}>{sub}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Set Selection</button>
            </form>
        </div>
    );
};

export default SetSelection;
