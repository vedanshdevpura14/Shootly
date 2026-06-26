import { Professional } from '../types/photographer';
import { professionals } from "../data/dummyData";
// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetch all professionals with optional filters
   */
  async getProfessionals(filters?: {
    category?: string;
    location?: string;
    specialty?: string;
  }): Promise<Professional[]> {
    await delay(300); // mock network latency
    let results = [...professionals];

    if (filters) {
      if (filters.category) {
        results = results.filter((p) => p.category === filters.category);
      }
      if (filters.location) {
        results = results.filter((p) =>
          p.city.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.specialty) {
results = results.filter((p) =>
  p.tags.includes(filters.specialty!)
);
      }
    }

    return results;
  },

  /**
   * Get professional by ID
   */
  async getProfessionalById(id: string): Promise<Professional | null> {
    await delay(200);
const item = professionals.find((p) => p.id.toString() === id);
    return item || null;
  },

  /**
   * Submit a new booking inquiry
   */
  async createBooking(bookingData: {
    professionalId: string;
    date: string;
    location: string;
    details: string;
    duration: number;
    amount: number;
  }): Promise<{ success: boolean; bookingId: string }> {
    await delay(500);
    console.log('Sending booking payload to backend:', bookingData);
    return {
      success: true,
      bookingId: `bk_${Math.random().toString(36).substr(2, 9)}`,
    };
  },
};
