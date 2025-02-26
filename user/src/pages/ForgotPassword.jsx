import { useState } from "react";
import { forgotPasswordRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
    const [values, setValues] = useState({ email: ""});
    const navigate = useNavigate();

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
        const { email } = values;
        if (!email){
            toast.error("Email is Required!", toastOptions);
            return;
        }
        const { data } = await axios.post(forgotPasswordRoute, {
            email
        });
        if (data.status === false) {
            toast.error(data.message, toastOptions);
        }
        if (data.status === true) {
            toast.success(data.message, toastOptions);
            setTimeout(()=>{navigate("/")}, 2000)
        }
    };

    return (
        <>
        <FormContainer>
            <form action="" className="min-w-1/3" onSubmit={(event) => handleSubmit(event)}>
            <div className="brand flex flex-col">
                <h1 className="text-2xl">Reset Password</h1>
                <span className="text-gray-300 text-sm lowercase">Enter your registered email to reset your password</span>
            </div>
            <input
                type="email"
                placeholder="Registered Email"
                name="email"
                onChange={(e) => handleChange(e)}
            />
            <button type="submit">Submit</button>
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
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
