export interface Agent {
  _id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  whatsapp: string;
  image: string;
  bio?: string;
  experience?: number;
  languages?: string[];
  social?: { linkedin?: string; instagram?: string; facebook?: string; twitter?: string };
}

export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  purpose: "Buy" | "Rent";
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  community: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  status: string;
  agent?: Agent;
  nearby?: { schools: string[]; hospitals: string[]; metro: string[] };
  floorPlanImage?: string;
  views?: number;
  createdAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  excerpt: string;
  content: string;
  author?: string;
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}
