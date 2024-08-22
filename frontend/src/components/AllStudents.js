import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosConfig'; // Import the configured Axios instance
import UserProfile from "./studentProfile";

//import Header1 from "./header";

export default function AllStudents({ searchQuery }) {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null); // State to store the student being edited
    const [userRole, setUserRole] = useState(null);
    const[userId,setUserID]=useState(null);
    const [isOpen, setisOpen] = useState(false);
    const [marks, setMarks] = useState (null);
   

    
    const cardColors = ['#b3b3ff', '#ff9999', '#99ff99', '#ffcc99'];
    //The functions inside useEffect re-executes based on changes in dependencies( [] -->this case empty dependency array ), not just re-renders of the component.
    useEffect(() => {
        /*getStudents();*/
        getSubjects();
        fetchUserRole();
        fetchUserID();
    }, []);//Ensures the effect runs once after the initial render and doesn't re-run unless the component is remounted.

    /*const getStudents = async () => {
        await axiosInstance.get("/student/").then((res) => {
            console.log("Students Data:", res.data);
            setStudents(res.data);
        }).catch((err) => {
            if(err.response && err.response.status === 401){
                alert('You need to Sign back In')
            }else
              alert(err.message);
        });
    };*/

    const getSubjects = async () => {
        try{
            const response = await axiosInstance.get("/subject/students",{withCredentials:true});
            setStudents(response.data);
            console.log(response);
        } catch(err){
            if(err.response && err.response.status === 401){
                alert('You need to Sign back In')
            }else
              alert('Error fetching Marks: ' + err.message);
        }
        
    }

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
      const fetchUserID = async () =>{
        try {
            const res = await axiosInstance.get("/user/id", { withCredentials: true });
            setUserID(res.data.id);
        } catch(err){
            alert(err);
        }
      };

    const handleEdit = (student) => {
        setEditingStudent({ ...student }); // Set the student being edited
        setMarks({...student.marks});
    };

    const handleDelete = async(student) => {
        await axiosInstance.delete(`/student/delete/${student._id}`,{ withCredentials: true })
            .then(() => {
                alert("Student deleted successfully");
                getSubjects(); // Fetch updated student list
            })
            .catch((err) => {
                if(err.response && err.response.status === 401){
                    alert('You need to Sign back In')
                }else
                  alert(err.message);
            });
    };

    const handleSave = async() => {
        try{
            await axiosInstance.put(`/student/update/${editingStudent._id}`, editingStudent,{ withCredentials: true });
            alert("Student updated successfully");
            setEditingStudent(null); // Clear the editing state after saving
            getSubjects(); // Fetch updated student list

            await axiosInstance.post(`/subject/students/${editingStudent._id}/marks`, marks,{ withCredentials: true } );
            setMarks(null);
            getSubjects();

        }catch(err) {
                if(err.response && err.response.status === 401){
                    alert('You need to Sign back In')
                }else
                  alert(err.message);
            };
    };
    const onClose = ()=>{
        setisOpen(false);
    }

    const handleProfile = ()=>{
        setisOpen(true);
    }

    const handleKeyPress = (e, student) => {
        if (e.key === 'Enter') {
            handleDelete(student); // Delete the student when Enter is pressed
        }
    };

    // Function to filter students based on search query
    const filteredStudents = Array.isArray(students) ? students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];
    
   // <Header1 filteredStudents={filteredStudents} />
    

    return (
      
        <div className="container" style={{ paddingTop: "70px" }}>
            <h1 className="h1" style={{ color: '#fff', fontWeight: 'bold' ,float:'left'}}>All students</h1>
            
            <div style={{float:'right'}} >
                {userRole== 'user' &&(<button onClick={handleProfile} className="btn btn-primary">profile</button>)}
                
            </div>
        
           
            <div className="row" style={{clear:'both'}}>
                {filteredStudents.map((student, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="customCard shadow-sm card" style={{ cursor: 'pointer', transition: 'transform 0.3s ease', background: cardColors[index % cardColors.length] }}>
                            <div className="customCard-body card-body">
                            {editingStudent && editingStudent._id === student._id ? (
                                    <div>
                                        {/* Edit form */}
                                        <input className="form-control" type="text" value={editingStudent.name} onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })} />
                                        <div className="container">
                                        <div className="row">
                                            
                                            <div className="form-group d-flex align-items-start">
                                                <label htmlFor="age" className="form-label" style={{ marginRight: '5px', width: '100px' }}>Age:</label>
                                                <input className="form-control" type="number" value={editingStudent.age} onChange={(e) => setEditingStudent({ ...editingStudent, age: e.target.value })} />
                                            </div>
                                            <div className="form-group d-flex align-items-start">
                                                <label htmlFor="maths" className="form-label" style={{ marginRight: '5px', width: '100px' }}>Maths:</label>
                                                <input className="form-control" type="number" value={marks.maths} onChange={(e) => setMarks({ ...marks, maths: e.target.value })} placeholder="Marks" />
                                            </div>
                                            <div className="form-group d-flex align-items-start">
                                                <label htmlFor="chemistry" className="form-label" style={{ marginRight: '5px', width: '100px' }}>Chemistry:</label>
                                                <input className="form-control" type="number" value={marks.chemistry} onChange={(e) => setMarks({ ...marks, chemistry: e.target.value })} placeholder="Marks" />
                                            </div>
                                            <div className="form-group d-flex align-items-start">
                                                <label htmlFor="physics" className="form-label" style={{ marginRight: '5px', width: '100px' }}>Physics:</label>
                                                <input className="form-control" type="number" value={marks.physics} onChange={(e) => setMarks({ ...marks, physics: e.target.value })} placeholder="Marks" />
                                            </div>
                                            
                                        </div>
                                        </div>
                                        <button onClick={handleSave} className="btn btn-primary">Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <h5 class="customCard-header card-header flex-wrap " style={{wordWrap:'break-word' , overflowWrap:'break-word'}}>
                                            <i class="fas fa-user"></i> {student.name}
                                        </h5>
                                        <p class="customCard-text card-text">
                                            <i class="fas fa-birthday-cake"></i> Age: {student.age}
                                        </p>
                                        <p class="customCard-text card-text">
                                            <i class="fas fa-envelope"></i> Email: {student.email}
                                        </p>
                                        <p class="customCard-text card-text">
                                             Maths: {student.marks.maths}<br/>
                                             Chemistry : {student.marks.chemistry}<br/>
                                             Physics: {student.marks.physics}
                                        </p>

                                                                            <>
                                        {userRole === 'admin' && (
                                            <>
                                            <button className="btn btn-primary" onClick={() => handleEdit(student)}>Edit</button>
                                            <button className="btn btn-primary" onClick={() => handleDelete(student)}>Delete</button>
                                            </>
                                        )}
                                        </>
  
                                    </div>
                                )}
                               
                            </div>
                        </div>
                        {userId === student.user && <UserProfile isOpen={isOpen} onClose={onClose} userId={student._id} getAll={getSubjects}/>}
                    </div>
                    
                ))}
            </div>
            
           
            <style>
                {`
                .customCard {
                    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
                    border-radius: 15px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    display: flex;
                    padding: 20px;
                    margin: 20px;
                    max-width: 400px;
                    min-width: 250px;
                    transition: transform 0.3s, box-shadow 0.3s;
                    font-family: 'Arial', sans-serif;
                }
                
                

                .customCard:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                }

                .customCard-header {
                    font-size: 1.75em;
                    margin-bottom: 15px;
                    color: #333;
                    display: flex;
                    align-items: center;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                .customCard-header i {
                    margin-right: 10px;
                    color: #007bff;
                }

                .customCard-text {
                    font-size: 1.1em;
                    margin-bottom: 10px;
                    color: #555;
                    display: flex;
                    align-items: center;
                }

                .customCard-text i {
                    margin-right: 10px;
                    color: #007bff;
                }

                
                .bg-lightblue {
                    background-color: lightblue;
                }
                .customCard:hover {
                    transform: scale(1.05);
                }
                .customCard-header{
                    background:#fff;
                }
                .customCard-text{
                    font-weight: 500;
                }
                .btn{
                    margin:10px;
                }
                .form-control{
                    margin:5px auto;
                }

                @media (max-width: 1200px) {
                    .customCard {
                        margin: 15px;
                    }
                }

                @media (max-width: 992px) {
                    .customCard {
                        display:flex;
                        margin: 10px;
                        
                    }
                    .container {
                        diplay:flex;
                        padding:5px;
                    }
                }

                @media (max-width: 768px) {
                    .customCard {
                        margin: 5px;
                        width: 100%;
                    }
                    
                }

                @media (max-width: 576px) {
                    .customCard {
                        margin: 2px;
                    }
                }
                `}
            </style>
        </div>
    )
}
