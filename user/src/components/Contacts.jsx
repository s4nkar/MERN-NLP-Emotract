import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setCurrentUserName(data.firstname + " "+ data.lastname);
          setCurrentUserImage(data.avatarImage);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };
  
    fetchUserData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Emotract v1</h3>
          </div>
          <div className="contacts">
            <div className="w-[90%] border-b border-gray-400 mt-1">
              <input type="text" placeholder="Search..." className="placeholder:text-gray-400 w-full p-2 focus:outline-none text-white" name="" id="" />
            </div>
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`${contact.avatarImage}`}
                      className="w-12 h-12"
                      alt=""
                    />
                  </div>
                  <div className="username flex flex-col gap-0">
                    <h3>{contact.username}</h3>
                    <span className="text-gray-500 text-sm">Last message</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center pl-[0.4rem]">
          <div className="flex">
            <div className="avatar">
              <img
                style={{ mixBlendMode: "saturation" }}
                className="w-12 h-12"
                src={`${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2 className="font-semibold text-white capitalize ml-2">{currentUserName}</h2>
              <span className="text-green-500 text-sm ml-2">Online</span>
            </div>
          </div>
          <div>
            <button>Logout</button>
          </div>
            </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.4rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 2rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
