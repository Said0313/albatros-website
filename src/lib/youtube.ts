// Extract a YouTube video id from the common URL shapes (watch, youtu.be,
// embed, shorts) or a bare id. Returns null when nothing usable is found, so
// the product page can simply render no video.
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const s = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}
