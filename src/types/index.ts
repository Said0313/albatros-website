export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  shortDescription: string;
  fullDescription: string;
  specifications: { label: string; value: string }[];
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  originalUrl?: string;
  shortDescriptionUz?: string;
  fullDescriptionUz?: string;
  // Two-level taxonomy: general direction (equipment | reagents | consumables |
  // controls). Absent means equipment (all existing products). `analytes` is an
  // in-card, language-neutral sub-list (e.g. TSH, CA-125) indexed by search;
  // `imageless` renders the card without a product image box.
  generalDirection?: "equipment" | "reagents" | "consumables" | "controls";
  analytes?: string[];
  imageless?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  url?: string;
  founded?: string;
  country?: string;
  specialty?: string;
  specialtyUz?: string;
  descriptionUz?: string;
  // Admin-managed flag; the public site does not render it yet.
  hidden?: boolean;
}

export interface CompanyEvent {
  id: string;
  title: string;
  date: string;
  year: string;
  url?: string;
  description?: string;
  titleUz?: string;
  descriptionUz?: string;
  // Added for the events page redesign (all optional, older records lack them):
  // type key (seminar | conference | congress | symposium | exhibition |
  // installation | registration | other), photos under /images/events/,
  // hidden flag and manual priority (lower number = higher on the page).
  type?: string;
  images?: string[];
  hidden?: boolean;
  priority?: number;
}

export interface Category {
  name: string;
  icon: string;
}
