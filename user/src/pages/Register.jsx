import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadhaar_number: "",
    firstname: "",
    lastname: "",
    parent_email: "",
    age: "",
    phone: "",
  });

  useEffect(() => {
    if (localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "age") {
      const dob = new Date(value); // Get selected date
      if (isNaN(dob.getTime())) return; // Prevent NaN values if invalid date
  
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
  
      // Adjust if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
  
      setValues((prevValues) => ({ ...prevValues, [name]: age }));
    } else {
      setValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };
  

  // Function to validate the
  // Aadhaar Number  
  function isValid_Aadhaar_Number(aadhaar_number){
  
      // Regex to check valid
      // aadhaar_number  
      let regex = new RegExp(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/);
  
      // if aadhaar_number 
      // is empty return false
      if (aadhaar_number == null) {
          return "false";
      }
  
      // Return true if the aadhaar_number
      // matched the ReGex
      if (regex.test(aadhaar_number) == true) {
          return "true";
      }
      else {
          return "false";
      }
  }

  const handleValidation = () => {
    const { password, confirmPassword, username, email, aadhaar_number } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if(isValid_Aadhaar_Number(aadhaar_number) === false){
      toast.error("Aadhaar number is Invalid!", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      // const { email, username, password } = values;
      const { data } = await axiosInstance.post(registerRoute, values);

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        // localStorage.setItem(
        //   import.meta.env.VITE_LOCALHOST_KEY,
        //   JSON.stringify(data.user)
        // );
        navigate("/login");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img className="w-15" src={Logo} alt="logo" />
            <h1 className="text-red-700">Emotract v1</h1>
          </div>
          <div className="flex">
          <div className="flex flex-col gap-2">
          <div className="flex gap-2">
          <input
            type="text"
            placeholder="firstname"
            name="firstname"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="lastname"
            name="lastname"
            onChange={(e) => handleChange(e)}
          />
          </div>
          <div className="flex gap-2">
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          </div>
          <div className="flex gap-2">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          </div>

          {/* Right col  */}
          </div>
          <div className="border-l-1 ml-2 pl-2 border-[#7a73ff] flex flex-col gap-2">
          <input
            type="text"
            placeholder="Aadhaar Number"
            name="aadhaar_number"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Parent Email"
            name="parent_email"
            onChange={(e) => handleChange(e)}
          />

          <input type="date" name="age" onChange={(e) => handleChange(e)} id="" />
          <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mobile No"
            name="phone"
            onChange={(e) => handleChange(e)}
            />
          </div>
          </div>
          </div>
          <div className="flex justify-end">
          <button type="submit" className="font-light text-[1px]">Create User</button>
          </div>
          <span className="text-[12px]">
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
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
    padding: 3rem 5rem;
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
    padding: .5rem 1rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: .8rem;
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
