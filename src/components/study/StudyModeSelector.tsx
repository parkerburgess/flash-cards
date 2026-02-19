"use client";

export type StudyMode = "review" | "mock";

interface Props {
  mode: StudyMode;
  onChange: (m: StudyMode) => void;
}

export default function StudyModeSelector({ mode, onChange }: Props) {
  return (
    <div className="flex border-b mb-6">
      {(["review", "mock"] as StudyMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-6 py-2 text-sm font-medium border-b-2 -mb-[2px] transition-colors ${
            mode === m
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {m === "review" ? "Data Review" : "Mock Test"}
        </button>
      ))}
    </div>
  );
}
