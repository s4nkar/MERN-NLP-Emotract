import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import { sendMessageRoute, recieveMessageRoute, fetchCurrentOnlineStatusRoute } from "../utils/APIRoutes";
import axiosInstance from "../utils/axiosInstance";
import fallBackImage from "../assets/avatars/avatar.png"
import { useSocket } from "../context/SocketProvider";

export default function ChatContainer({ currentChat }) {
  const [messages, setMessages] = useState([]); 
  const [currentUserOnlineStatus, setCurrentUserOnlineStatus] = useState(false); 
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useSocket();
  
  useEffect(() => {
    const fetchMessages = async () => {
      const storedData = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data && currentChat) {
          try {
            const response = await axiosInstance.post(recieveMessageRoute, {
              from: data._id,
              to: currentChat._id,
            });
            setMessages(response.data);
            
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        }
      }
    };
  
    fetchMessages();
  }, [currentChat]);
  

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) { 
        await JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY))._id;}
    };

    getCurrentChat();
  }, [currentChat]);

  // Handle online status 
  useEffect(() => {
    const fetchCurrentOnlineStatus = async () => {
        try {
          const response = await axiosInstance.get(`${fetchCurrentOnlineStatusRoute}/${currentChat._id}`);
          console.log({response});
          setCurrentUserOnlineStatus(response.data?.is_online);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }

    fetchCurrentOnlineStatus();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));
  
    if (!socket) {
      console.error("Socket is not connected!");
      return;
    }
  
    socket.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
  
    await axiosInstance.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      is_group: false,
    });
  
    setMessages((prevMsgs) => [...prevMsgs, { fromSelf: true, message: msg }]);
  };
  
  useEffect(() => {
    if (!socket) return;
  
    const handleMessageReceive = (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg });
    };
  
    socket.on("msg-recieve", handleMessageReceive);
  
    return () => {
      socket.off("msg-recieve", handleMessageReceive); // Cleanup listener on unmount
    };
  }, [socket]);
  

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container className="border-l-2 border-[#3c3648]">
      <div className="chat-header bg-[#1f193a]">
        <div className="user-details flex gap-2 p-2 ">
          <div className="avatar flex justify-start">
            <img
              src={currentChat.avatarImage ? currentChat.avatarImage : fallBackImage}
              alt="user image"
              className="w-12 h-12 rounded-full border-1 border-gray-400"
            />
          </div>
          <div className="username flex flex-col justify-start">
            <h3 className="text-white mt-1">{currentChat.username}</h3>
            {currentUserOnlineStatus ?
            (
              <span className="text-green-600 text-sm">Online</span>
            ):(
              <span className="text-red-700 text-sm">Offline</span>
            )}
          </div>
        </div>
      </div>
      <div className="chat-messages">
      {/* Encryption message */}
      <div className="text-yellow-700 p-3 rounded-lg text-center text-sm w-full mt-2">
        🔒 Messages you send to this chat and calls are now secured with encryption. Tap for more info.
      </div>
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: .4rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 60%;
        overflow-wrap: break-word;
        padding: .5rem .8rem;
        font-size: 1rem;
        font-weight:300;
        border-radius: .6rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
