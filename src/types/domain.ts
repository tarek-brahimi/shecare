export interface User {
  id: string;
  name: string;
  avatar: string;
  treatmentDay: number;
  totalTreatmentDays: number;
  wellnessScore: number;
  nextAppointment: string;
}

export interface Post {
  post_id: string;
  title?: string;
  authorName: string;
  author_id: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "guide" | "video" | "pdf";
  featured: boolean;
  imageUrl?: string;
  duration?: string;
  author: string;
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
}

export interface Symptom {
  id: string;
  name: string;
  severity: number;
  date: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: "in-person" | "teleconsultation";
}
