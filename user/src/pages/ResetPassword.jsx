import { useState } from "react";
import { resetPasswordRoute } from "../utils/APIRoutes";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
    const [values, setValues] = useState({ password: "", confirm_password: "" });
    const navigate = useNavigate();
    const { token } = useParams(); // Get token from URL

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { password, confirm_password } = values;

        console.log("Reset Route:", resetPasswordRoute);
        console.log("Token:", token);
        console.log("Password:", values.password);

        
        console.log("FFF", password, confirm_password);
    
        if (confirm_password !== password || password.length < 8) {
            toast.error("Both Passwords must be the same and above 8 characters!", toastOptions);
            return;
        }
    
        try {
            const { data } = await axios.post(`${resetPasswordRoute}/${token}`, { password });
    
            if (data.status === false) {
                toast.error(data.message, toastOptions);
            } else {
                toast.success(data.message, toastOptions);
                navigate("/");
            }
        } catch (error) {
            console.error("Error submitting reset password:", error.response?.data?.message); // Logs the error
            toast.error(error.response?.data?.message || "Something went wrong", toastOptions);
        }
    };
    

    return (
        <>
        <FormContainer>
            <form action="" className="min-w-1/3" onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} className="w-15"  alt="logo" />
                <h1 className="text-red-200">Reset Password</h1>
            </div>
            <input
                type="password"
                placeholder="New Password"
                name="password"
                onChange={(e) => handleChange(e)}
                min="3"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                onChange={(e) => handleChange(e)}
            />
            <div className="flex flex-col"> 
            <button type="submit">Submit</button>
            <Link to="/" className="text-white text-sm mt-2 underline">Go back to login page</Link>
            </div>
            </form>
        </FormContainer>
        <ToastContainer />
        </>
    );
}


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
