import React, { useState, useRef, useEffect } from 'react';
import Logout from '../Logout';
import { BiDoorOpen } from "react-icons/bi";

const Settings = ({ currentUserImage, currentUserName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Ref for the dropdown container

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      // Cleanup event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-sm cursor-pointer bg-slate-800 py-1 px-1 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        type="button"
      >
        <BiDoorOpen className='h-5 w-5'/>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className="absolute -left-25 mt-2 z-10 min-w-[140px] overflow-auto rounded-sm border border-[#171725] bg-[#171725] p-1.5 shadow-sm focus:outline-none"
        >
            <li
              role="menuitem"
              className="border-b-1 text-slate-800 flex w-full text-sm items-center p-2 transition-all"
            >
              <span className='text-white flex gap-2 items-center justify-center'>
                <img 
                  src={currentUserImage} 
                  alt="current-user"
                  className="w-7 h-7 rounded-full border-1"
                />
                {currentUserName}
              </span>
            </li>
            <li
              role="menuitem"
              className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-2 transition-all hover:bg-[#565660] focus:bg-[#565660]"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              <span className='text-white'>Change Avatar</span>
            </li>
            <li
              role="menuitem"
              className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-2 transition-all hover:bg-[#565660] focus:bg-[#565660]"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              <Logout/> <span className='ml-2 text-white'>Logout</span>
            </li>
            
        </ul>
      )}
    </div>
  );
};

export default Settings;
