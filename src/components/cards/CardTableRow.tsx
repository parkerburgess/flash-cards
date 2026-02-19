"use client";

import type { Card } from "@/types";

interface Props {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export default function CardTableRow({ card, onEdit, onDelete }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 max-w-[200px]">
        {card.clueType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.clue}
            alt="clue"
            className="h-10 w-auto object-contain rounded"
          />
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
            onClick={() => onEdit(card)}
            className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(card)}
            className="text-red-500 hover:text-red-700 text-xs font-medium"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
