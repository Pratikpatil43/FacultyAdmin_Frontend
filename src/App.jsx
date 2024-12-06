import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/AuthForm';
import Dashboard from './pages/Dashboard';
import Viewprofile from './components/Dashboard/Faculty/Viewprofile';
import ForgotPassword from './pages/ForgotPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <div className="App">
            <Router>
                {/* Add the ToastContainer to show the toasts */}
                <ToastContainer
                    position="top-right" // Position of the toast
                    autoClose={5000} // Auto-close after 5 seconds
                    hideProgressBar={false} // Display progress bar
                    newestOnTop={false} // Whether the newest toast appears at the top
                    closeOnClick={true} // Allows to close the toast by clicking on it
                    rtl={false} // Set to true if your app supports right-to-left languages
                    pauseOnFocusLoss={false} // Whether the toast will be paused when focus is lost
                    draggable={false} // Whether the toast can be dragged
                    pauseOnHover={true} // Whether the toast will pause on hover
                />
                <Routes>
                    <Route path="/" element={<AuthForm type="login" />} />
                    <Route path="/profile" element={<Viewprofile />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />

                    {/* Dashboard with nested routes */}
                    <Route path="/dashboard/*" element={<Dashboard />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
