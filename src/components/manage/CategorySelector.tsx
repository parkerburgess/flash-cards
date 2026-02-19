"use client";

import { useState } from "react";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreated: () => void;
  onDeleted: (id: string) => void;
}

export default function CategorySelector({
  categories,
  selectedId,
  onSelect,
  onCreated,
  onDeleted,
}: Props) {
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    setError("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();
    setCreating(false);
    if (json.error) { setError(json.error); return; }
    setNewName("");
    onCreated();
    onSelect(json.data.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category and all its cards?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    onDeleted(id);
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-gray-900 mb-3">Category</h2>

      {categories.length === 0 ? (
        <p className="text-gray-400 italic text-sm mb-3">No categories yet.</p>
      ) : (
        <ul className="space-y-1 mb-3 max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer ${
                cat.id === selectedId
                  ? "bg-indigo-100 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSelect(cat.id)}
            >
              <span className="text-sm truncate">{cat.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                className="text-red-400 hover:text-red-600 text-xs ml-2 flex-shrink-0"
                aria-label={`Delete category ${cat.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category…"
          className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
