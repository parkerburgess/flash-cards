import type { Card } from "@/types";

interface Props { card: Card; }

export default function CardAnswerSide({ card }: Props) {
  return (
    <div className="text-center w-full">
      <p className="text-xs uppercase tracking-widest text-indigo-600 mb-3">Answer</p>
      <p className="text-xl font-bold text-indigo-800">{card.answer}</p>
    </div>
  );
}
