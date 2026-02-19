"use client";

import type { Card } from "@/types";
import CardTableRow from "./CardTableRow";

interface Props {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export default function CardTable({ cards, onEdit, onDelete }: Props) {
  return (
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
          {cards.map((card) => (
            <CardTableRow
              key={card.id}
              card={card}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
