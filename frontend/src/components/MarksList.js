import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosConfig';
import '../styles/markList.css'; 

export default function MarksList(){
    const [students, setStudents] = useState([]);
    const [isEdit, setIsEdit]= useState(false);
    //const [marks,setMarks] = useState('');
    const [originalStudents, setOriginalStudents] = useState([]);


    useEffect(() => {
        /*getStudents();*/
        getSubjects();
        
    }, []);

    /*Purpose:
        To ensure a deep copy of the students array, creating independent nested objects, preventing changes in one array from affecting the original.

        JSON.stringify(students): Converts the students array into a JSON string, including all nested objects.
        JSON.parse(): Converts the JSON string back into a JavaScript object, resulting in a new array with new, independent objects.
        setOriginalStudents(): Sets the state of originalStudents to this newly created deep copy.

        Why Use This?
        Deep Copy vs Shallow Copy: Direct assignment creates a shallow copy, where changes to nested objects affect the original. 
        Using JSON.stringify and JSON.parse together ensures a deep copy, making nested objects completely independent.*/

    useEffect(() => {
        setOriginalStudents(JSON.parse(JSON.stringify(students)));
      }, [students]);

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
    const handleEdit = (students)=>{
        setIsEdit(true);
        
        //setMarks({...students.marks});
    }

    const handleInputChange = (index, subject, value) => {
        const updatedStudents = [...students];
        updatedStudents[index].marks[subject] = value;
        setStudents(updatedStudents);
      };

    const handleSave = async () => {
        
    
          try {
            const response = await axiosInstance.post("/subject/marks", {students:students} ,  {withCredentials: true });
            console.log('Marks updated successfully');
            alert ('Marks updated successfully');
          } catch (error) {
            alert( error);
          }
          console.log('array:',students)
        setIsEdit(false);
        getSubjects();
    };
    

    
   
        return (
            <div className="container container2 " style={{ paddingTop: "70px" }}>
                <h2 style={{color:'white'}}>Student Grades</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Maths</th>
                            <th>Chemistry</th>
                            <th>Physics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                    <td data-label="Name">{student.name}</td>
                                    <td data-label="Email">{student.email}</td>
                                    {isEdit ? (
                                        <>
                                        <td data-label="Maths"><input className="form-control form-control2" type="number" value={student.marks.maths} onChange={(e) => handleInputChange(index, 'maths', e.target.value)} placeholder="Marks" /></td>
                                        <td data-label="Chemistry"><input className="form-control form-control2" type="number" value={student.marks.chemistry} onChange={(e) => handleInputChange(index, 'chemistry', e.target.value)} placeholder="Marks" /></td>
                                        <td data-label="Physics"><input className="form-control form-control2" type="number" value={student.marks.physics} onChange={(e) => handleInputChange(index, 'physics', e.target.value)} placeholder="Marks" /></td>
                                        </>
                                    ):(
                                    <>
                                    <td data-label="Maths">{student.marks.maths}</td>
                                    <td data-label="Chemistry">{student.marks.chemistry}</td>
                                    <td data-label="Physics">{student.marks.physics}</td>
                                    </>
                                )}
                                
                            </tr>
                        ))}
                    </tbody>
                    {isEdit ? (
                        <button  className="btn2 btn-primary" onClick={handleSave}>Save</button>
                    ):<button onClick={() => handleEdit(students)} className="btn2 btn-primary">Edit Marks Sheet</button>}
                    
                </table>
            </div>
        );
    
}