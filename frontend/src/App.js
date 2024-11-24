import React, { useState } from 'react';
import './App.css';
import AddStudent from './components/addStudent';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AllStudents from './components/AllStudents';
import { Home, Login, Signup } from "./pages";
import Header1 from './components/header';
import StudentProfile from './components/studentProfile';
import MarksList from './components/MarksList';
import PaymentSlipUpload from './components/UploadSlip'
import AdminNotifications from './components/adminNotifications'
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
   const { pathname } = useLocation();

  // Function to determine whether to display the header
  const shouldDisplayHeader = () => {
    return !(pathname === "/login" || pathname === "/signup" || pathname==="/home");
  };

  return (
    //<Router>
    
      <div>
        {shouldDisplayHeader() && <Header1 searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} {/* Render header if user is logged in */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login  />} /> {/* Pass setIsLoggedIn as prop to Login component */}
          <Route path="/signup" element={<Signup  />} /> {/* Pass setIsLoggedIn as prop to Signup component */}
          <Route path="/add" exact element={<AddStudent />} />
          <Route path="/" exact element={<AllStudents searchQuery={searchQuery} />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/marksList" element={<MarksList />} />
          <Route path="/upload-slip" component={PaymentSlipUpload} />
          <Route path="/admin-notify" element={<AdminNotifications />} />
        </Routes>

      <style>{`
      body {
        
         background: linear-gradient(
           90deg,
            rgba(44, 62, 80, 1) 0%,    /* Midnight Blue */
            rgba(52, 73, 94, 1) 50%,   /* Wet Asphalt */
            rgba(127, 140, 141, 1) 100%  /* Gray */
         );
        }
      `}
    </style>
      </div>
      
    //</Router>

    
    
  );
}

export default App;
