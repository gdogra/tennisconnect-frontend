// src/components/DashboardHeader.jsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DashboardHeader({
  title = "🎾 Dashboard",
  searchValue,
  onSearchChange,
  filters = {},
  setFilters,
  onClear,
}) {
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    setLocalSearch(searchValue || "");
  }, [searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow p-4 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 sm:items-center w-full md:w-auto"
        >
          <Input
            placeholder="Search players or challenges..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={onClear}>
            Clear
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.skill || ""}
          onChange={(e) => handleFilterChange("skill", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Skill Levels</option>
          <option value="3.5">3.5</option>
          <option value="4.0">4.0</option>
          <option value="4.5">4.5</option>
          <option value="5.0">5.0</option>
        </select>

        <select
          value={filters.sort || ""}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Sort By</option>
          <option value="date">Date</option>
          <option value="skill">Skill Level</option>
        </select>
      </div>
    </motion.div>
  );
}

