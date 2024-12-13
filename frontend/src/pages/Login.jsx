import React, { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  useEffect(() => {
    // Change body background color only for the Login page
    document.body.style.background = '90deg, rgba(0, 34, 64, 1) 0%, rgba(26, 51, 84, 1) 50%, rgba(41, 82, 113, 1) 100%';

    // Clean up the background color when leaving the page
    return () => {
      document.body.style.background = ''; // Reset background
    };
  }, []);

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8070/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
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
    });
  };

  return (
    <div className="container">
      {/* Left Side */}
      <div className="left">
        
        <h2>What's New in Eduman v5.2?</h2>
        <ul>
          <li>Exciting New Dashboard</li>
          <li>Lorem Ipsum Dolor Set Amet</li>
          <li>Volup Taruin Denotis Bliko Triolas</li>
          <li>Exciting New Dashboard</li>
        </ul>
      </div>

      {/* Right Side */}
      <div className="right animated">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button className="btn" type="submit">Login</button>
        </form>
        <div className="footer">
          <a href="#">Forgot Password?</a>
        </div>
      </div>

      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .container {
            display: flex;
           background:  linear-gradient(135deg, rgba(129, 212, 250, 0.6), rgba(79, 195, 247, 0.6)), url('https://communications.catholic.edu/_media/magazine/2021/winter-2021/faculty-essay.jpg') no-repeat center center;
            width: 900px;
            height: 500px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .left {
          flex: 1;  
          background-size: cover;
          color: black;
          font-weight: bold;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

          .left img {
            max-width: 100%;
            height: auto;
            margin-bottom: 20px;
            border-radius: 10px;
          }

          .left h2 {
            font-size: 24px;
            margin-bottom: 20px;
            color:black;
            font-weight: bold;
          }

          .left ul {
            list-style: none;
          }

          .left ul li {
            margin: 10px 0;
            display: flex;
            align-items: center;
            font-size: 18px;
          }

          .left ul li:before {
            content: '\u2713';
            color: black;
            font-weight: bold;
            margin-right: 10px;
          }

           .right {
          flex: 1;
          background: #2c2f3f;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          transform: translateX(300px); /* Initial position off-screen */
          opacity: 0;
        }

        .animated {
          animation: slideIn 1s ease-out forwards;
        }

        @keyframes slideIn {
          0% {
            transform: translateX(300px); /* Start from off-screen */
            opacity: 0;
          }
          100% {
            transform: translateX(0); /* Final position */
            opacity: 1;
          }
        }

          .right h2 {
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 15px;
            width: 100%;
          }

          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
          }

          .form-group input {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            outline: none;
            background: #44475a;
            color: white;
          }

          .btn {
            background: #6c63ff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
          }

          .btn:hover {
            background: #5753e5;
          }

          .footer {
            margin-top: 15px;
            font-size: 14px;
            color: #999;
          }

          .footer a {
            color: #6c63ff;
            text-decoration: none;
          }
        `}
      </style>
    </div>
  );


  
};

export default Login;
