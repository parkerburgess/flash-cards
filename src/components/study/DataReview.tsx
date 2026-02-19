"use client";

import { useState } from "react";
import type { Card, Category } from "@/types";
import CardEditPopup from "@/components/cards/CardEditPopup";
import DeleteConfirmModal from "@/components/manage/DeleteConfirmModal";

const PAGE_SIZE = 10;

interface Props {
  cards: Card[];
  categories: Category[];
  onRefresh: () => void;
}

export default function DataReview({ cards, categories, onRefresh }: Props) {
  const [page, setPage] = useState(1);
  const [editCard, setEditCard] = useState<Card | null>(null);
  const [deleteCard, setDeleteCard] = useState<Card | null>(null);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const pageCards = cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteCard) return;
    const res = await fetch(`/api/cards/${deleteCard.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.error) { setError(json.error); return; }
    setDeleteCard(null);
    onRefresh();
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 rounded px-4 py-2 mb-4 text-sm">
          {error}
        </div>
      )}

      {cards.length === 0 ? (
        <p className="text-gray-400 italic">No cards in this category.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Clue</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Answer</th>
                  <th className="px-4 py-2 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pageCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 max-w-[200px]">
                      {card.clueType === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.clue} alt="clue" className="h-10 w-auto object-contain rounded" />
                      ) : (
                        <span className="line-clamp-2">{card.clue}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 max-w-[200px]">
                      <span className="line-clamp-2">{card.answer}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditCard(card)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteCard(card)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              {cards.length} cards · page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
              >
                ← Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {editCard && (
        <CardEditPopup
          card={editCard}
          categories={categories}
          onSaved={() => { setEditCard(null); onRefresh(); }}
          onClose={() => setEditCard(null)}
        />
      )}
      {deleteCard && (
        <DeleteConfirmModal
          message={`Delete card "${deleteCard.answer}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteCard(null)}
        />
      )}
    </div>
  );
}
