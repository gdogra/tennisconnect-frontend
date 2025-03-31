import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Profile() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    skill_level: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`http://localhost:5001/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        toast.error("❌ Failed to load profile.");
      }
    }
    fetchProfile();
  }, [user.id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/profile/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Profile updated!");
    } catch (err) {
      toast.error("❌ Update failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">👤 My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="input"
            required
          />
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="input"
            required
          />
        </div>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="input"
        />
        <input
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Street"
          className="input"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="input"
        />
        <input
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          placeholder="Zip Code"
          className="input"
        />
        <input
          name="skill_level"
          value={formData.skill_level}
          onChange={handleChange}
          placeholder="Skill Level (e.g., 4.0)"
          className="input"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
