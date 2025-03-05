import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import fallBackImage from "../assets/avatars/avatar.png"
import Settings from "./ui/Settings";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query
  const [filteredContacts, setFilteredContacts] = useState(contacts); // Filtered contacts based on search query

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY);
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setCurrentUserName(data.username);
          setCurrentUserImage(data.avatarImage);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };
  
    fetchUserData();
  }, []);

   // Filter contacts based on the search query
   useEffect(() => {
    if (searchQuery === "") {
      setFilteredContacts(contacts); // Show all contacts when no search query
    } else {
      setFilteredContacts(
        contacts.filter((contact) =>
          contact.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, contacts]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && (
        <Container>
          <div className="flex justify-between px-5 text-white items-center w-full ">
            <div className="flex items-center">
              <img src={Logo} alt="logo" />
              <h3 className="pl-1">Emotract v1</h3>
            </div>
            <Settings currentUserImage={currentUserImage} currentUserName={currentUserName} />
          </div>
          <div className="contacts">
            <div className="w-[90%] border-b border-gray-400 mt-1">
              <input
                  type="text"
                  placeholder="Search..."
                  className="placeholder:text-gray-400 w-full p-2 focus:outline-none text-white"
                  value={searchQuery} // Bind the search query
                  onChange={(e) => setSearchQuery(e.target.value)} // Update the state on input change
                />
            </div>
            {filteredContacts.length === 0 ? (
              <div className="no-results mt-5">
                <p className="text-orange-800">No contacts found!</p>
              </div>
            ) : (
              filteredContacts.map((contact, index) => {
                return (
                  <div
                    key={contact._id}
                    className={`contact ${
                      index === currentSelected ? "selected" : ""
                    } hover:bg-[#dedede34]`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="avatar">
                      <img
                        src={contact.avatarImage ? contact.avatarImage : fallBackImage}
                        className="w-12 h-12 rounded-full border-1 border-gray-400"
                        alt=""
                      />
                    </div>
                    <div className="username flex flex-col gap-0">
                      <h3>{contact.username}</h3>
                      <span className="text-gray-500 text-sm">Last message</span>
                    </div>
                  </div>
                );
              })
            )}
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
    gap: 0.2rem;
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
      min-height: 4rem;
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
      background-color: #1f193a;
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
