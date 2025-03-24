import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    skill_level: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("❌ Passwords do not match!");
      return;
    }

    const response = await fetch("http://localhost:5001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      navigate("/login");
    } else {
      setError(data.error || "❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-10 py-8 w-full max-w-xl"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            🎾 Register
          </h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["First Name", "first_name"],
              ["Last Name", "last_name"],
              ["Email", "email"],
              ["Phone", "phone"],
              ["Street", "street"],
              ["City", "city"],
              ["ZIP Code", "zip"],
              ["Skill Level", "skill_level"],
            ].map(([label, name]) => (
              <input
                key={name}
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
                required
                className="border rounded p-2"
              />
            ))}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border rounded p-2"
            />
            <input
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="border rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

