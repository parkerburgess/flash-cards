"use client";

import { useState, useEffect, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import CategorySelector from "@/components/manage/CategorySelector";
import CardForm from "@/components/manage/CardForm";
import DeleteConfirmModal from "@/components/manage/DeleteConfirmModal";
import CardTable from "@/components/cards/CardTable";
import type { Card, Category } from "@/types";

export default function ManagePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [cards, setCards] = useState<Card[]>([]);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [deletingCard, setDeletingCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    if (json.error) return;
    setCategories(json.data);
    if (!selectedCategoryId && json.data.length > 0) {
      setSelectedCategoryId(json.data[0].id);
    }
  }, [selectedCategoryId]);

  const fetchCards = useCallback(async () => {
    if (!selectedCategoryId) return;
    setLoading(true);
    const res = await fetch(`/api/cards?categoryId=${selectedCategoryId}`);
    const json = await res.json();
    setLoading(false);
    if (json.error) {
      setError(json.error);
      return;
    }
    setCards(json.data);
  }, [selectedCategoryId]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchCards(); }, [fetchCards]);

  const handleCardSaved = () => {
    setEditingCard(null);
    fetchCards();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCard) return;
    const res = await fetch(`/api/cards/${deletingCard.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.error) { setError(json.error); return; }
    setDeletingCard(null);
    fetchCards();
  };

  return (
    <PageWrapper title="Manage Cards">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 rounded px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category + Form */}
        <div className="lg:col-span-1 space-y-4">
          <CategorySelector
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            onCreated={fetchCategories}
            onDeleted={(id) => {
              fetchCategories();
              if (selectedCategoryId === id) setSelectedCategoryId("");
            }}
          />
          {selectedCategoryId && (
            <CardForm
              categories={categories}
              defaultCategoryId={selectedCategoryId}
              editCard={editingCard}
              onSaved={handleCardSaved}
              onCancel={() => setEditingCard(null)}
            />
          )}
        </div>

        {/* Right: Card table */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-gray-500">Loading cards…</p>
          ) : !selectedCategoryId ? (
            <p className="text-gray-400 italic">Select a category to view cards.</p>
          ) : cards.length === 0 ? (
            <p className="text-gray-400 italic">No cards yet. Create one on the left.</p>
          ) : (
            <CardTable
              cards={cards}
              onEdit={setEditingCard}
              onDelete={setDeletingCard}
            />
          )}
        </div>
      </div>

      {deletingCard && (
        <DeleteConfirmModal
          message={`Delete card "${deletingCard.answer}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCard(null)}
        />
      )}
    </PageWrapper>
  );
}
