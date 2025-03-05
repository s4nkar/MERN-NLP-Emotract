import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import axiosInstance from "../utils/axiosInstance";
import { useSocket } from "../context/SocketProvider";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const checkUser = async () => {
      const storedData = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
      
      if (!storedData) {
        navigate("/login");
      } else {
        try {
          const parsedData = JSON.parse(storedData);
          setCurrentUser(parsedData);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          navigate("/login"); // Handle potential corruption by redirecting to login
        }
      }
    };
  
    checkUser();
  }, [navigate]); // Include navigate in dependencies to avoid potential warnings
  

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("add-user", currentUser._id);
    }
  }, [socket, currentUser]); // Ensure socket is available before emitting

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axiosInstance.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data);
          } catch (error) {
            console.error("Error fetching contacts:", error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
  
    fetchContacts();
  }, [currentUser, navigate]); // Added navigate as a dependency
  

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange}  />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat}  />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
