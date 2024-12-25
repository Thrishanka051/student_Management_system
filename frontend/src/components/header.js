import React, { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from '../axiosConfig';
//import AllStudents from "./AllStudents";

function Header1({ setSearchQuery, searchQuery }) {
    const [activeTab, setActiveTab] = useState(""); // State to keep track of active tab
    const [userRole, setUserRole] = useState(null);
    const { pathname } = useLocation();

    useEffect(() => {
        fetchUserRole();
    }, []);
    
    const linkStyles = {
        color: 'white',
        backgroundColor: 'green',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem',
        marginRight: '1rem',
        height: '50px',
        margin: '0 10px',
        display: 'flex',
        alignItems: 'center',
        transition: 'font-size 0.3s ease',
    };

    const fetchUserRole = async () => {
        try {
          const response = await axiosInstance.get("/user/role", { withCredentials: true });
          setUserRole(response.data.role);
        } catch (err) {
            if(err.response && err.response.status === 401){
                alert('You need to Sign back In')
            }else
               alert('Error fetching user role: ' + err.message);
        }
      };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
    const handleSearch = (e) => {
        e.preventDefault(); // Prevent form submission
        
    };
    const displaySearch= ()=>{
        return !(pathname==="/add");
    }

    const handleNavigate =()=>{
        localStorage.removeItem('user'); // Clear any user data in local storage
        window.location.href = '/login'; // Redirect to login page
    }
    

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ zIndex: '1000', width: '100%', position: 'fixed', top: 0 }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link
                                to="/"
                                className="nav-link"
                                style={{
                                    ...linkStyles,
                                    backgroundColor: activeTab === "Home" ? 'red' : 'green',
                                }}
                                onClick={() => handleTabClick("Home")}
                            >
                                Home
                            </Link>
                        </li>
                        {userRole === 'admin' && (<>
                        <li className="nav-item">
                            <Link
                                to="/add"
                                className="nav-link"
                                style={{
                                    ...linkStyles,
                                    backgroundColor: activeTab === "Create Student" ? 'red' : 'green',
                                }}
                                onClick={() => handleTabClick("Create Student")}
                            >
                                Create Student
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/marksList"
                                className="nav-link"
                                style={{
                                    ...linkStyles,
                                    backgroundColor: activeTab === "Student Marks" ? 'red' : 'green',
                                }}
                                onClick={() => handleTabClick("Student Marks")}
                            >
                                Student Marks
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/admin-notify"
                                className="nav-link"
                                style={{
                                    ...linkStyles,
                                    backgroundColor: activeTab === "Notifications" ? 'red' : 'green',
                                }}
                                onClick={() => handleTabClick("Notifications")}
                            >
                                Notifications
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/payDetails"
                                className="nav-link"
                                style={{
                                    ...linkStyles,
                                    backgroundColor: activeTab === "Payments" ? 'red' : 'green',
                                }}
                                onClick={() => handleTabClick("Payments")}
                            >
                                Payments
                            </Link>
                        </li>
                        
                        </>)}
                        
                    </ul>
                    <div className="d-flex align-items-center" style={{position:'absolute', right:'5px'}}>
                    {displaySearch() && <form class="d-flex " role="search" style={{marginRight:'4rem'}} onSubmit={handleSearch}>
                       <input
                            class="form-control bg-warning-subtle"
                            type="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>}
                    <button className="btn btn-danger" style={{marginLeft:'3rem'}} onClick={handleNavigate} >LOG OUT</button>
                    </div>
                </div>
                

            </div>
            <style>
                {`
                .bg-dark{
                    height: 50px;
                    padding: 0;
                }

                .nav-link:hover {
                    font-size: 1.1em;
                }
                `}
            </style>
        </nav>
    );
}

export default Header1;

