import { logoutRoute } from "@/constants/api";
import { useRouter } from "@/routes/hooks";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect } from "react";

export default function Logout() {
    const router = useRouter();
    
    useEffect(()=> {
        const handleLogout = async () => {
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
        
              if (response.status === 200) {
              // Clear tokens and user data from localStorage
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem(import.meta.env.VITE_LOCALHOST_KEY);
          
              // Navigate to the login page
              router.push("/login");
            } else {
              console.error("Failed to log out. Server response:", response.data);
              alert("An error occurred while logging out. Please try again.");
            }
            } catch (error) {
              // Handle any errors
              console.error("Logout error:", error);
              alert("An error occurred while logging out. Please try again.");
            }
          };

          handleLogout();
    }, [])

  return (
      <button className="flex cursor-pointer w-full p-2">
        <span className='ml-2 text-white'>Logout</span>
      </button>
  );
}

