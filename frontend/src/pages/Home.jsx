import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
//import '../index.css';

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return; // Exit the function early if there's no token
      }

      try {
        const { data } = await axios.post(
          "http://localhost:8070/",
          {},
          { withCredentials: true }
        );
        const { status, user } = data;

        if (status) {
          setUsername(user);
          setAuthenticated(true);
          alert(`Hello ${user}`, { position: "top-right" });
        } else {
          removeCookie("token");
          navigate("/login");
          
        }
      } catch (error) {
        console.error("Error verifying cookie:", error);
        // Handle errors appropriately (e.g., display an error message)
      }
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  const GoTo = () => {
    navigate("/all")
  }

  return (
    <>
      {authenticated && ( // Render home page only if authenticated is true
        <div className="home_page">
          <h4>Welcome <span>{username}</span></h4>
          <button onClick={Logout}>LOGOUT</button>
          <button onClick={GoTo}>Go in</button>
        </div>
      )}
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
  
    </>
  );
};

export default Home;

// ... Login component remains the same ...
