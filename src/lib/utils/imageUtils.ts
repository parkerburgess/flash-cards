/** Convert a File to a base64 data-URL via FileReader */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/** Max image size in bytes (2 MB) */
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "File must be an image";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be smaller than 2 MB";
  }
  return null;
}
