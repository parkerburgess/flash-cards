"use client";

import { useRef } from "react";
import { fileToBase64, validateImageFile } from "@/lib/utils/imageUtils";

interface Props {
  value: string; // base64 data-URL or ""
  onChange: (dataUrl: string) => void;
  onError: (msg: string) => void;
}

export default function ImageUploadPreview({ value, onChange, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) { onError(err); return; }
    try {
      const dataUrl = await fileToBase64(file);
      onChange(dataUrl);
      onError("");
    } catch {
      onError("Failed to read image file");
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 min-h-[120px]"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Clue preview"
            className="max-h-40 object-contain rounded"
          />
        ) : (
          <p className="text-gray-400 text-sm">Click to upload an image</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {value && (
        <button
          type="button"
          onClick={() => { onChange(""); if (inputRef.current) inputRef.current.value = ""; }}
          className="text-xs text-red-500 hover:underline"
        >
          Remove image
        </button>
      )}
    </div>
  );
}
