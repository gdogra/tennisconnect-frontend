import React from "react";

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
      {message}
      <button className="ml-4 font-bold" onClick={onClose}>
        ✖
      </button>
    </div>
  );
}
