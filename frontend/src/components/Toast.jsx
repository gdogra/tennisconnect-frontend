import React, { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto-dismiss after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
  }[type];

  return (
    <div className={`fixed top-5 right-5 z-50 px-4 py-2 text-white rounded shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
}

