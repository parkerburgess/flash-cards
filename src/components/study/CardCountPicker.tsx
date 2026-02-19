"use client";

interface Props {
  max: number;
  value: number;
  onChange: (n: number) => void;
}

export default function CardCountPicker({ max, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600">Cards:</label>
      <input
        type="range"
        min={1}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32"
      />
      <span className="text-sm font-medium w-6 text-center">{value}</span>
    </div>
  );
}
