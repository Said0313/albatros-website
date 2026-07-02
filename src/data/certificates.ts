/**
 * Certificates shown on the About page. Currently empty — add entries here later
 * (place the image under /public and reference it as `image`) and the About page
 * grid will render them automatically, no layout changes needed.
 */
export interface Certificate {
  id: string;
  image: string; // path under /public, e.g. "/images/certificates/iso-9001.jpg"
  title?: string;
}

export const certificates: Certificate[] = [];
