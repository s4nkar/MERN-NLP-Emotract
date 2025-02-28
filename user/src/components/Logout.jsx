import React from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { logoutRoute } from "../utils/APIRoutes";
import axiosInstance from "../utils/axiosInstance";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
      if (!userData) {
        console.error("User not found in localStorage");
        return;
      }
  
      const userId = JSON.parse(userData)._id;
  
      // Send the logout request
      const response = await axiosInstance.post(logoutRoute, { userId });
  
      // Clear tokens and user data from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem(import.meta.env.VITE_LOCALHOST_KEY);
  
      // Navigate to the login page
      navigate("/login");
    } catch (error) {
      // Handle any errors
      console.error("Logout error:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };
  

  return (
      <BiLogOut onClick={handleClick} className="w-5 h-5 text-white cursor-pointer" />
  );
}

