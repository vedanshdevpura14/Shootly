import { Professional } from '../types/photographer';

/**
 * Shootly AI & ML Tracking Library
 * Handles profile interaction tracking and client style alignment calculation
 */
export const mlTracker = {
  /**
   * Track profile click to feed into recommended search profiles (reinforcement learning)
   */
  trackProfileView(professionalId: string, clientSessionId?: string) {
    console.log(`[ML Tracker] Profile view logged: ${professionalId} by session: ${clientSessionId || 'anonymous'}`);
    // In production, this fires a telemetry event to a clickstream database.
  },

  /**
   * Track search query variables to tune semantic matching weights
   */
  trackSearchQuery(query: string, category: string, selectedFilters: string[]) {
    console.log('[ML Tracker] Query features:', { query, category, selectedFilters });
  },

  /**
   * Calculates a match score between a user request and a professional profile (simulating style modeling)
   */
  calculateMatchScore(professional: Professional, clientPreferences: {
    preferredSpecialties?: string[];
    maxPrice?: number;
    locations?: string[];
  }): number {
    let score = 50; // base score out of 100

    // Match location
    if (clientPreferences.locations && clientPreferences.locations.includes(professional.location)) {
      score += 15;
    }

    // Match pricing constraint
    if (clientPreferences.maxPrice && professional.startingPrice <= clientPreferences.maxPrice) {
      score += 15;
    }

    // Match specialty alignment
    if (clientPreferences.preferredSpecialties) {
      const matchCount = professional.specialties.filter((s) =>
        clientPreferences.preferredSpecialties!.includes(s)
      ).length;
      score += matchCount * 10;
    }

    // Extra weight for certified, top-rated, and AI Pick professionals
    if (professional.verified) score += 5;
    if (professional.rating >= 4.8) score += 5;
    if (professional.aiPick) score += 10;

    return Math.min(score, 100);
  },
};
