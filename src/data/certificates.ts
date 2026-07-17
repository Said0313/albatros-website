/**
 * Certificates shown on the About page. Data lives in certificates.json (edited
 * by the admin panel); add entries there (image under /public, referenced as
 * `image`, optional full document as `file`) and the About page grid renders
 * them automatically, no layout changes needed.
 */
import certificatesData from "./certificates.json";

export interface Certificate {
  id: string;
  image: string; // preview/scan image under /public, e.g. "/images/certificates/iso-9001.jpg"
  title?: string;
  titleUz?: string;
  file?: string; // optional full document (PDF) under /public, e.g. "/files/certificates/iso-9001.pdf"
  hidden?: boolean; // hidden certificates are not rendered on the site
}

export const certificates: Certificate[] = certificatesData;
