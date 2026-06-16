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
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  url?: string;
}

export interface CompanyEvent {
  id: string;
  title: string;
  date: string;
  year: string;
  url?: string;
  description?: string;
}

export interface Category {
  name: string;
  icon: string;
}
