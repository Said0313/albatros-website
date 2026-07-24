/**
 * Albatros clients (hospitals & labs that buy from us). Shown in the homepage
 * clients marquee and in the clients section on the About page. Logos live in
 * /public/images/clients/ (mirroring the partner logo convention). `name` is the
 * <img> alt / card title.
 *
 * `description` (RU, from the vetted Appendix A copy) + `descriptionUz` power the
 * client cards.
 *
 * Order: the strongly-red logos (akfa, vitros, hayat, arzon, shifonur, alfa) are
 * interleaved with blue/green/dark/mixed and softer-coral ones so no two strong-red
 * logos sit adjacent, including across the duplicated marquee loop seam (shox -> akfa).
 *
 * Data lives in clients.json (edited by the admin panel); this module keeps the
 * typed import surface unchanged for the site. `link` and `hidden` are
 * admin-managed fields the public site does not render yet.
 */
import clientsData from "./clients.json";

export interface Client {
  id: string;
  name: string;
  logo: string;
  description?: string;
  descriptionUz?: string;
  descriptionEn?: string;
  link?: string;
  hidden?: boolean;
}

export const clients: Client[] = clientsData;
