/**
 * Albatros clients (hospitals & labs that buy from us) shown in the homepage
 * clients marquee. Display-only: logos scroll, and clicking one scrolls to the
 * partners section (see ClientsMarquee + Task 3). No descriptions — these are
 * real institutions, names come from the supplied logo filenames.
 *
 * `name` is used as the <img> alt text. Logos live in /public/images/clients/,
 * mirroring the partner logo convention in /public/images/brands/.
 */
export interface Client {
  id: string;
  name: string;
  logo: string;
}

export const clients: Client[] = [
  { id: "akfa-medline", name: "Akfa Medline", logo: "/images/clients/akfa-medline.jpg" },
  { id: "alfa-med-service", name: "Alfa Med Service", logo: "/images/clients/alfa-med-service.webp" },
  { id: "arzon-lab", name: "Arzon Lab", logo: "/images/clients/arzon-lab.webp" },
  { id: "darmon-servis", name: "Darmon Servis", logo: "/images/clients/darmon-servis.svg" },
  { id: "defactum", name: "Defactum", logo: "/images/clients/defactum.svg" },
  { id: "dialab", name: "Dialab", logo: "/images/clients/dialab.png" },
  { id: "openlab", name: "OpenLab", logo: "/images/clients/openlab.jpg" },
  { id: "shox-international-hospital", name: "Shox International Hospital", logo: "/images/clients/shox-international-hospital.jpg" },
  { id: "swiss-lab", name: "Swiss Lab", logo: "/images/clients/swiss-lab.svg" },
  { id: "vitros", name: "Vitros", logo: "/images/clients/vitros.svg" },
];
