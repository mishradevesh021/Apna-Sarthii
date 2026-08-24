export type UserRole = 'CUSTOMER' | 'WORKER' | 'ADMIN';

export type RequestUrgency = 'ASAP' | 'TODAY' | 'TOMORROW' | 'CUSTOM';

export type RequestStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  colorScheme: string;
  startingPrice: number;
  activeWorkersCount: number;
}

export interface WorkerCardDTO {
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
  distanceKm?: number;
  matchScore?: number;
  matchReasons?: string[];
}

export interface ServiceRequestDTO {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  workerId: string;
  workerName: string;
  categoryName: string;
  problemTitle: string;
  problemDescription: string;
  urgency: RequestUrgency;
  scheduledTime: string;
  locationAddress: string;
  locationCity: string;
  locationLocality: string;
  estimatedBudget?: number | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  timeline?: {
    id: string;
    status: RequestStatus;
    note: string | null;
    createdAt: string;
  }[];
  review?: {
    id: string;
    ratingOverall: number;
    comment: string;
    createdAt: string;
  } | null;
}
