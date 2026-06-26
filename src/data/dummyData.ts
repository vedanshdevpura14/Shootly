import { Professional } from "@/types/photographer";


export const professionals: Professional[] = [
  // Photographers
  { id: 1, name: "Rahul Sharma", type: "Photographer", city: "Jaipur", rating: 4.8, reviews: 127, category: "Wedding", price: 15000, image: "https://picsum.photos/seed/rahul-photo/600/750", verified: true, tags: ["Pre-Wedding", "Candid"], aiScore: 96 },
  { id: 2, name: "Priya Patel", type: "Photographer", city: "Mumbai", rating: 4.9, reviews: 89, category: "Portrait", price: 12000, image: "https://picsum.photos/seed/priya-portrait/600/750", verified: true, tags: ["Fashion", "Studio"], aiScore: 94 },
  { id: 3, name: "Arjun Mehta", type: "Photographer", city: "Delhi", rating: 4.7, reviews: 64, category: "Events", price: 20000, image: "https://picsum.photos/seed/arjun-events/600/750", verified: false, tags: ["Corporate", "Conference"], aiScore: 88 },
  { id: 4, name: "Kavita Singh", type: "Photographer", city: "Udaipur", rating: 4.8, reviews: 45, category: "Travel", price: 18000, image: "https://picsum.photos/seed/kavita-travel/600/750", verified: false, tags: ["Drone", "Landscape"], aiScore: 91 },
  { id: 5, name: "Deepa Nair", type: "Photographer", city: "Bangalore", rating: 5.0, reviews: 210, category: "Fashion", price: 25000, image: "https://picsum.photos/seed/deepa-fashion/600/750", verified: true, tags: ["Editorial", "Commercial"], aiScore: 98 },
  { id: 6, name: "Suresh Kumar", type: "Photographer", city: "Hyderabad", rating: 4.6, reviews: 38, category: "Food", price: 8000, image: "https://picsum.photos/seed/suresh-food/600/750", verified: false, tags: ["Restaurant", "Product"], aiScore: 82 },
  { id: 7, name: "Neeta Joshi", type: "Photographer", city: "Mumbai", rating: 4.9, reviews: 156, category: "Wedding", price: 35000, image: "https://picsum.photos/seed/neeta-wedding/600/750", verified: true, tags: ["Luxury", "Destination"], aiScore: 97 },
  { id: 8, name: "Vikram Reddy", type: "Photographer", city: "Hyderabad", rating: 4.5, reviews: 29, category: "Portrait", price: 6000, image: "https://picsum.photos/seed/vikram-portrait/600/750", verified: false, tags: ["Outdoor", "Natural Light"], aiScore: 79 },

  // Videographers
  { id: 9, name: "Anand Films", type: "Videographer", city: "Delhi", rating: 4.8, reviews: 98, category: "Wedding", price: 40000, image: "https://picsum.photos/seed/anand-films/600/750", verified: true, tags: ["Cinematic", "4K"], aiScore: 93 },
  { id: 10, name: "CineCraft Studio", type: "Videographer", city: "Mumbai", rating: 4.7, reviews: 67, category: "Events", price: 30000, image: "https://picsum.photos/seed/cinecraft/600/750", verified: true, tags: ["Commercial", "Documentary"], aiScore: 90 },

  // Reel Creators
  { id: 11, name: "Aisha Khan", type: "Reel Creator", city: "Mumbai", rating: 4.9, reviews: 200, category: "Reels", price: 5000, image: "https://picsum.photos/seed/reel-creator-1/400/710", verified: true, tags: ["Instagram", "Trending"], aiScore: 99 },
  { id: 12, name: "Rohan Verma", type: "Reel Creator", city: "Delhi", rating: 4.8, reviews: 150, category: "Reels", price: 4000, image: "https://picsum.photos/seed/reel-creator-2/400/710", verified: false, tags: ["TikTok", "Product"], aiScore: 87 },
  { id: 13, name: "Sneha Iyer", type: "Reel Creator", city: "Bangalore", rating: 5.0, reviews: 80, category: "Product", price: 8000, image: "https://picsum.photos/seed/reel-creator-3/400/710", verified: true, tags: ["Brand", "Unboxing"], aiScore: 95 },
  { id: 14, name: "Dev Rathore", type: "Reel Creator", city: "Jaipur", rating: 4.7, reviews: 120, category: "Fashion", price: 6000, image: "https://picsum.photos/seed/reel-creator-4/400/710", verified: false, tags: ["Fashion", "Transition"], aiScore: 84 },
  { id: 15, name: "Meera Reddy", type: "Reel Creator", city: "Hyderabad", rating: 4.9, reviews: 300, category: "Food", price: 3500, image: "https://picsum.photos/seed/reel-creator-5/400/710", verified: true, tags: ["Restaurant", "Recipe"], aiScore: 96 },

  // Editors
  { id: 16, name: "Vikram Das", type: "Editor", city: "Kolkata", rating: 4.9, reviews: 200, category: "Color Grading", price: 100, image: "https://picsum.photos/seed/editor-vikram/600/750", verified: true, tags: ["Photo Retouch", "AI Enhancement"], aiScore: 94, unit: "/photo" },
  { id: 17, name: "Nisha Gupta", type: "Editor", city: "Mumbai", rating: 4.8, reviews: 150, category: "Video Editing", price: 2000, image: "https://picsum.photos/seed/editor-nisha/600/750", verified: true, tags: ["Reel Editing", "Transitions"], aiScore: 92, unit: "/video" },
  { id: 18, name: "Amir Sheikh", type: "Editor", city: "Delhi", rating: 5.0, reviews: 90, category: "Retouching", price: 80, image: "https://picsum.photos/seed/editor-amir/600/750", verified: false, tags: ["Bg Removal", "AI Enhance"], aiScore: 89, unit: "/photo" },
  { id: 19, name: "Ritu Sharma", type: "Editor", city: "Jaipur", rating: 4.7, reviews: 45, category: "Color Grading", price: 500, image: "https://picsum.photos/seed/editor-ritu/600/750", verified: false, tags: ["Cinematic Look", "LUT"], aiScore: 81, unit: "/video" },
  { id: 20, name: "Karan Chopra", type: "Editor", city: "Bangalore", rating: 4.6, reviews: 33, category: "Video Editing", price: 1500, image: "https://picsum.photos/seed/editor-karan/600/750", verified: false, tags: ["YouTube", "Thumbnails"], aiScore: 76, unit: "/video" },
];