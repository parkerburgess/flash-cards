import type { Card } from "@/types";

interface Props { card: Card; }

export default function CardClueSide({ card }: Props) {
  return (
    <div className="text-center w-full">
      <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Clue</p>
      {card.clueType === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.clue}
          alt="clue"
          className="max-h-40 mx-auto object-contain rounded"
        />
      ) : (
        <p className="text-xl font-semibold text-gray-800">{card.clue}</p>
      )}
    </div>
  );
}
