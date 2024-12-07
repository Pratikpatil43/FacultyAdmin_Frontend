import React,{ useState } from 'react';

export default function ForgotPasswordForm() {
    const [facultyUsername, setFacultyUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader

        try {
            const response = await fetch('https://attendancetracker-backend1.onrender.com/api/faculty/forgetpassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ facultyUsername, newPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setIsPasswordUpdated(true); // Password updated successfully
                setError('');
            } else {
                setError(data.message || 'Failed to update the password.');
                setMessage('');
            }
        } catch (err) {
            setError('Error: ' + err.message);
            setMessage('');
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    padding: '20px',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 className="text-center mb-4">Forgot Password</h2>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {isPasswordUpdated ? (
                    // Show message and login button after successful password update
                    <div className="text-center">
                        <p>Your password has been updated successfully!</p>
                        <a
                            href="/"
                            className="btn btn-success"
                            style={{
                                padding: '10px',
                                fontWeight: '600',
                                background: '#4CAF50',
                                border: 'none',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                color: '#fff',
                            }}
                        >
                            Go to Login
                        </a>
                    </div>
                ) : (
                    // Show form for password update
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="facultyUsername" className="form-label">
                                Faculty Username
                            </label>
                            <input
                                type="text"
                                id="facultyUsername"
                                className="form-control"
                                value={facultyUsername}
                                onChange={(e) => setFacultyUsername(e.target.value)}
                                required
                                style={{
                                    padding: '8px',
                                    fontSize: '14px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={{
                                    padding: '8px',
                                    fontSize: '14px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading} // Disable button while loading
                            style={{
                                padding: '10px',
                                fontWeight: '600',
                                background: '#4c56cc',
                                border: 'none',
                                borderRadius: '6px',
                            }}
                        >
                            {loading ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ marginRight: '5px' }}
                                ></span>
                            ) : null}
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
