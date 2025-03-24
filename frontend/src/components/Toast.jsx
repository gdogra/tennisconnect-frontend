import React from "react";

export default function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-white ${
        type === "error" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      <div className="flex items-center justify-between space-x-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold ml-4 text-lg">
          ✖
        </button>
      </div>
    </div>
  );
}

