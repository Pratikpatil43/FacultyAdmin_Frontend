import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import { Box, Toolbar } from '@mui/material';
import MarkAttendance from '../components/Dashboard/StudentHandler/MarkAttendance';
import AddStudentForm from '../components/Dashboard/StudentHandler/AddStudentForm';
import FetchStudents from '../components/Dashboard/StudentHandler/FetchStudents';
import SetSelection from '../components/Dashboard/StudentHandler/SetSelection'
import UpdateAttendance from '../components/Dashboard/StudentHandler/UpdateAttendance';






const Dashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <Sidebar />
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f9f9f9',
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Routes>
           
                    <Route path="mark-attendance" element={<MarkAttendance />} />
                    <Route path="add-student" element={<AddStudentForm />} />
                    <Route path="view-students" element={<FetchStudents />} />
                    <Route path="set-selection" element={<SetSelection />} />
                    <Route path="update-attendance" element={<UpdateAttendance />} />



                </Routes>
            </Box>
        </Box>
    );
};

export default Dashboard;
