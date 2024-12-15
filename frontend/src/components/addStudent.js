import React, { useState } from "react";
import axiosInstance from '../axiosConfig';

export default function AddStudent() {
    let [name, setName] = useState("");
    let [age, setAge] = useState("");
    let [email, setEmail] = useState("");
    const [generatedPassword, setGeneratedPassword] = useState(null);

    async function setData(e) {
        e.preventDefault();
        const newStudent = {
            name,
            age,
            email
        };
        await axiosInstance.post("/student/add", newStudent, { withCredentials: true })
            .then((res) => {
                alert("Student added");
                setGeneratedPassword(res.data.password);
            })
            .catch((err) => {
                if(err.response && err.response.status === 401){
                    alert('You need to Sign back In')
                }else
                  alert(err);
            });
    }

    return (
        <div className="container" style={{ margin:'70px auto', padding: "20px 40px", background: '#b3d9ff', borderRadius: '20px', boxShadow:' 0px 0px 10px rgba(0, 0, 0, 1);' }}>
            {/* Added padding to the container */}
            <form onSubmit={setData} style={{ marginTop: "20px" }}>
                {/* Added margin-top to the form */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" placeholder="Enter student full name" required
                        onChange={(e) => {
                            setName(e.target.value)
                        }} />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input type="number" className="form-control" name="age" min="1" max="120" placeholder="Enter student age" required
                        onChange={(e) => {
                            setAge(e.target.value)
                        }} />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input type="text" className="form-control" name="email" placeholder="Enter student address"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            {generatedPassword && (
        <div className="alert alert-success mt-3">
          <p>Student added successfully. The generated password was sent to email</p>
        </div>
      )}
            <style>
                {`
                    .form-label{
                        font-weight: 500 !important;
                        font-size:18px;
                        color:#000;
                    }
                    .form-control{
                        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
                    }
                    .container{
                        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
                    }
                `}
            </style>
        </div>
    );
}
