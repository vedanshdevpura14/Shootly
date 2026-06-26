export interface Professional {
  id: number;
  name: string;
  type: "Photographer" | "Videographer" | "Reel Creator" | "Editor";
  city: string;
  rating: number;
  reviews: number;
  reviewCount?: number; // Added for error 3
  category: string;
  price: number;
  unit?: string;
  image: string;
  verified: boolean;
  tags: string[];
  aiScore: number;
  aiPick?: boolean;
  location?: string;
  bio?: string;
  specialties?: string[]; // Optional, use ?. or ||
  startingPrice?: number; // Optional, use ?. or ||
  experienceYears?: number;
  avatar?: string;
  portfolio?: PortfolioItem[];
}

export interface PortfolioItem {
  id: number | string;
  type: 'video' | 'image' | string;
  url: string;
  title?: string;
}