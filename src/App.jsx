import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/AuthForm';
import Dashboard from './pages/Dashboard';
import Viewprofile from './components/Dashboard/Faculty/Viewprofile';
import ForgotPassword from './pages/ForgotPassword'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthForm type="login" />} />
                <Route path="/profile" element={<Viewprofile />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />

                {/* Dashboard with nested routes */}
                <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
