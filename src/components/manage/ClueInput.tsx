"use client";

import ImageUploadPreview from "./ImageUploadPreview";
import type { ClueType } from "@/types";

interface Props {
  clueType: ClueType;
  clue: string;
  onTypeChange: (t: ClueType) => void;
  onClueChange: (v: string) => void;
  onError: (msg: string) => void;
}

export default function ClueInput({
  clueType,
  clue,
  onTypeChange,
  onClueChange,
  onError,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        {(["text", "image"] as ClueType[]).map((t) => (
          <label key={t} className="flex items-center gap-1 cursor-pointer text-sm">
            <input
              type="radio"
              name="clueType"
              value={t}
              checked={clueType === t}
              onChange={() => { onTypeChange(t); onClueChange(""); onError(""); }}
            />
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </label>
        ))}
      </div>

      {clueType === "text" ? (
        <textarea
          value={clue}
          onChange={(e) => onClueChange(e.target.value)}
          placeholder="Clue text…"
          rows={2}
          className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      ) : (
        <ImageUploadPreview value={clue} onChange={onClueChange} onError={onError} />
      )}
    </div>
  );
}
