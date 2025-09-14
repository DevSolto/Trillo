export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function apiUrl(path: string): string {
  // Absolute URLs: return unchanged
  if (/^https?:\/\//i.test(path)) return path;
  // Force going through Next.js rewrite when targeting proxy
  if (path.startsWith("/api/")) return path;
  // Otherwise, if we have a backend base URL, resolve against it; else keep relative
  if (API_BASE_URL) {
    try {
      return new URL(path, API_BASE_URL).toString();
    } catch {
      // fallthrough
    }
  }
  return path;
}

