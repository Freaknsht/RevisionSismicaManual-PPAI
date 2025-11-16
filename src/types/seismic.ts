export interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  coordinates: [number, number]; // [longitude, latitude]
  depth: number;
  timestamp: string;
  region: string;
  status: 'pending' | 'in_review' | 'completed' | 'referred';
  reviewedBy?: string;
  notes?: string;
}

export interface SeismicReview {
  earthquakeId: string;
  reviewerId: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'cancelled' | 'referred';
  notes: string;
  assessmentLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations?: string;
}