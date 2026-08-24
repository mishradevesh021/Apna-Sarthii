export interface WorkerCandidate {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  categoryName: string;
  categorySlug: string;
  city: string;
  locality: string;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  experienceYears: number;
  responseRate: number;
  isAvailable: boolean;
  isVerified: boolean;
  identityVerified: boolean;
  professionVerified: boolean;
  emergency24x7: boolean;
  latitude: number;
  longitude: number;
}

export interface ScoredWorker extends WorkerCandidate {
  distanceKm: number;
  matchScore: number;
  matchReasons: string[];
}

// Calculate Haversine distance
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function rankAndScoreWorkers(
  workers: WorkerCandidate[],
  userLat = 25.4358,
  userLng = 81.8463,
  preferredCategory?: string
): ScoredWorker[] {
  return workers
    .map((worker) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        worker.latitude || 25.4358,
        worker.longitude || 81.8463
      );

      let score = 0;
      const reasons: string[] = [];

      // 1. Availability (Weight: 25)
      if (worker.isAvailable) {
        score += 25;
        reasons.push("Available today");
      }

      // 2. Verification (Weight: 20)
      if (worker.identityVerified && worker.professionVerified) {
        score += 20;
        reasons.push("Fully Verified");
      } else if (worker.isVerified) {
        score += 15;
        reasons.push("Verified Pro");
      }

      // 3. Proximity / Distance (Weight: 25)
      if (distance <= 2.5) {
        score += 25;
        reasons.push("Very close (< 2.5 km)");
      } else if (distance <= 5.0) {
        score += 18;
        reasons.push("Nearby (< 5 km)");
      } else if (distance <= 10.0) {
        score += 10;
      } else {
        score += 3;
      }

      // 4. Rating (Weight: 15)
      if (worker.rating >= 4.8) {
        score += 15;
        reasons.push("Top Rated (4.8+ ⭐)");
      } else if (worker.rating >= 4.5) {
        score += 10;
        reasons.push("Highly Rated");
      } else {
        score += 5;
      }

      // 5. Experience & Completed Jobs (Weight: 10)
      if (worker.completedJobs >= 50) {
        score += 10;
        reasons.push(`${worker.completedJobs}+ jobs done`);
      } else if (worker.completedJobs >= 10) {
        score += 6;
      }

      // 6. Response Rate (Weight: 5)
      if (worker.responseRate >= 95) {
        score += 5;
        reasons.push("Lightning Fast Responder");
      }

      return {
        ...worker,
        distanceKm: distance,
        matchScore: Math.min(100, score),
        matchReasons: reasons.slice(0, 4),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
