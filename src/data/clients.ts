/**
 * Albatros clients (hospitals & labs that buy from us). Shown in the homepage
 * clients marquee and on the /clients page. Logos live in /public/images/clients/
 * (mirroring the partner logo convention). `name` is the <img> alt / card title.
 *
 * `description` (RU) + `descriptionUz` power the /clients cards; a few clients have
 * no vetted description yet and intentionally render logo + name only.
 *
 * Order: the strongly-red logos (akfa, vitros, hayat, arzon, shifonur, alfa) are
 * interleaved with blue/green/dark/mixed and softer-coral ones so no two strong-red
 * logos sit adjacent, including across the duplicated marquee loop seam (shox -> akfa).
 */
export interface Client {
  id: string;
  name: string;
  logo: string;
  description?: string;
  descriptionUz?: string;
}

export const clients: Client[] = [
  { id: "akfa-medline", name: "Akfa Medline", logo: "/images/clients/akfa-medline.jpg" },
  { id: "dialab", name: "Dialab", logo: "/images/clients/dialab.png" },
  { id: "biogen-med", name: "Biogen Med", logo: "/images/clients/biogen-med.jpg" },
  { id: "vitros", name: "Vitros", logo: "/images/clients/vitros.svg" },
  { id: "darmon-servis", name: "Darmon Servis", logo: "/images/clients/darmon-servis.svg" },
  { id: "hayat-medical-centre", name: "Hayat Medical Centre", logo: "/images/clients/hayat-medical-centre.png" },
  { id: "sinomed-md", name: "Sinomed MD", logo: "/images/clients/sinomed-md.svg" },
  { id: "samarqand-tibbiy-diagnostika", name: "Samarqand tibbiy diagnostika", logo: "/images/clients/samarqand-tibbiy-diagnostika.webp" },
  { id: "arzon-lab", name: "Arzon Lab", logo: "/images/clients/arzon-lab.webp" },
  { id: "openlab", name: "OpenLab", logo: "/images/clients/openlab.jpg" },
  { id: "shifonur", name: "Shifonur", logo: "/images/clients/shifonur.webp" },
  { id: "swiss-lab", name: "Swiss Lab", logo: "/images/clients/swiss-lab.svg" },
  { id: "defactum", name: "Defactum", logo: "/images/clients/defactum.svg" },
  { id: "alfa-med-service", name: "Alfa Med Service", logo: "/images/clients/alfa-med-service.webp" },
  { id: "shox-international-hospital", name: "Shox International Hospital", logo: "/images/clients/shox-international-hospital.jpg" },
];
