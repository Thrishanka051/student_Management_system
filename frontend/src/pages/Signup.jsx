import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue, //spread operator to create a shallow copy of the current state 
      [name]: value, //only changed value is set in the inputvalues object and other values' states are in current state(not changed) 
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const { data } = await axios.post(
            "http://localhost:8070/signup",
            {
              ...inputValue,
            },
            { withCredentials: true }
          );
          const { success, message } = data;
          if (success) {
            handleSuccess(message);
            navigate( "/"); // Navigate to the Home page or the specified location
          } else {
            handleError(message);
          }
        } catch (error) {
          console.log(error);
        }
        setInputValue({
          ...inputValue,
          email: "",
          password: "",
          username: "",
        });
      };

  return (
    <div className="form_container">
      <h2>Signup Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="email">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
      <ToastContainer />
      <style>
    {`
       *,
       ::before,
       ::after {
         box-sizing: border-box;
         padding: 0;
         margin: 0;
       }
       
       label {
         font-size: 1.2rem;
         color: #656262;
       }
       
       html,
       body {
         height: 100%;
         width: 100%;
       }
       
       body {
         display: flex;
         justify-content: center;
         align-items: center;
         background: linear-gradient(
           90deg,
           rgba(2, 0, 36, 1) 0%,
           rgba(143, 187, 204, 1) 35%,
           rgba(0, 212, 255, 1) 100%
         );
         font-family: Verdana, Geneva, Tahoma, sans-serif;
       }
       
       .form_container {
         background-color: #fff;
         padding: 2rem 3rem;
         border-radius: 0.5rem;
         width: 100%;
         max-width: 400px;
         box-shadow: 8px 8px 24px 0px rgba(66, 68, 90, 1);
       }
       
       .form_container > h2 {
         margin-block: 1rem;
         padding-block: 0.6rem;
         color: rgba(0, 212, 255, 1);
       }
       
       .form_container > form {
         display: flex;
         flex-direction: column;
         gap: 1.4rem;
       }
       
       .form_container div {
         display: flex;
         flex-direction: column;
         gap: 0.3rem;
       }
       
       .form_container input {
         border: none;
         padding: 0.5rem;
         border-bottom: 1px solid gray;
         font-size: 1.1rem;
         outline: none;
       }
       
       .form_container input::placeholder {
         font-size: 0.9rem;
         font-style: italic;
       }
       
       .form_container button {
         background-color: rgba(0, 212, 255, 1);
         color: #fff;
         border: none;
         padding: 0.6rem;
         font-size: 1rem;
         cursor: pointer;
         border-radius: 0.3rem;
       }
       
       span a {
         text-decoration: none;
         color: rgba(0, 212, 255, 1);
       }
       
       .home_page {
         height: 100vh;
         width: 100vw;
         background: #000;
         color: white;
         display: flex;
         justify-content: center;
         align-items: center;
         text-transform: uppercase;
         font-size: 3rem;
         flex-direction: column;
         gap: 1rem;
       }
       
       .home_page span {
         color: rgba(0, 212, 255, 1);
       }
       
       .home_page button {
         background-color: rgb(27, 73, 83);
         color: #fff;
         cursor: pointer;
         padding: 1rem 3rem;
         font-size: 2rem;
         border-radius: 2rem;
         transition: ease-in 0.3s;
         border: none;
       }
       
       .home_page button:hover {
         background-color: rgba(0, 212, 255, 1);
       }
       
       
       @media only screen and (max-width: 1200px){
         .home_page{
           font-size: 1.5rem;
         }
         .home_page button {
           padding: 0.6rem 1rem;
           font-size: 1.5rem;
         }
       } 

    `}
</style>

    </div>
  );
};

export default Signup;