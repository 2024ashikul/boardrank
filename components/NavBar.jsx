'use client';
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');

  return (
    <div className="bg-blue-100 py-3 px-4 mb-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        
        {/* Title / Home link */}
        <Link href={`/page/1`} className="text-2xl font-bold text-blue-800 hover:text-blue-900">
          Board Result Rank
        </Link>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <input
            type="search"
            id="search"
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>

        {/* Radio filter group */}
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              id="name"
              onChange={(e) => setFilter(e.target.value)}
              name="filter"
              value="name"
              className="accent-blue-500"
            />
            Name
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              id="roll"
              onChange={(e) => setFilter(e.target.value)}
              name="filter"
              value="roll"
              className="accent-blue-500"
            />
            Roll
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              id="school"
              onChange={(e) => setFilter(e.target.value)}
              name="filter"
              value="institute"
              className="accent-blue-500"
            />
            School
          </label>
        </div>

        {/* Submit button */}
        <Link
          href={`/search/${filter || ''}/${encodeURIComponent(search)}`}
          className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
