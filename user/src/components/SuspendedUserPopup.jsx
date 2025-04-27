import React from 'react';

const SuspendedUserPopup = ({ isSuspended, suspensionMessage }) => {
  return (
    <>
      {isSuspended && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-1/3 h-1/3 bg-white/30 rounded-lg p-6 flex flex-col items-center justify-center shadow-lg">
            <h3 className="text-xl font-semibold text-red-600">Suspended</h3>
            <p className="mt-4 text-center text-white">{suspensionMessage || 'Your account has been suspended due to policy violations. Please contact support for more information.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SuspendedUserPopup;
