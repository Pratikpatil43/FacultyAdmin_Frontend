import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AuthForm = () => {
    const [facultyUsername, setFacultyUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();

    // Check if the token exists in sessionStorage, redirect to dashboard if it does
    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('https://attendancetracker-backend1.onrender.com/api/faculty/login', {
                facultyUsername,
                password,
            });

            // Extract token and success message
            const { token, message } = response.data;
            setMessage(message);

            // Store the token in sessionStorage for subsequent requests
            sessionStorage.setItem('token', token);

            // Redirect to faculty dashboard or take further action
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="auth-form-container card p-5 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <h1 className="text-center mb-4">Faculty Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="facultyUsername" className="form-label">Faculty Username</label>
                        <input
                            type="text"
                            id="facultyUsername"
                            className="form-control form-control-lg"
                            value={facultyUsername}
                            onChange={(e) => setFacultyUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control form-control-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg">Login</button>
                    </div>
                </form>
                
                {/* Forgot Password Link */}
                <div className="text-center mt-3">
                    <Link to="/forgotpassword" className="text-decoration-none">Forgot Password?</Link>
                </div>

                {message && <p className="text-center text-danger mt-3">{message}</p>}
            </div>
        </div>
    );
};

export default AuthForm;
