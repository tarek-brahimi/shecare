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
  id: string;
  authorName: string;
  authorAvatar: string;
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
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: "in-person" | "teleconsultation";
}

export const currentUser: User = {
  id: "1",
  name: "Sarah",
  avatar: "S",
  treatmentDay: 45,
  totalTreatmentDays: 90,
  wellnessScore: 78,
  nextAppointment: "2026-04-02T10:00:00",
};

export const posts: Post[] = [
  {
    id: "1",
    authorName: "Emily Johnson",
    authorAvatar: "E",
    content: "Today marks my 6-month milestone! The journey has been tough, but the support from this community has been incredible. Sending love to all my warriors! 💪🌸",
    tags: ["Victory"],
    createdAt: "2026-03-28T08:30:00",
    likes: 42,
    comments: 15,
    shares: 8,
  },
  {
    id: "2",
    authorName: "Maria Garcia",
    authorAvatar: "M",
    content: "Has anyone tried meditation during chemo sessions? I started last week and it really helped with the anxiety. Would love to hear your experiences.",
    tags: ["Question", "Support"],
    createdAt: "2026-03-27T14:20:00",
    likes: 28,
    comments: 22,
    shares: 5,
  },
  {
    id: "3",
    authorName: "Aisha Patel",
    authorAvatar: "A",
    content: "Just finished my last radiation session! 🎉 Thank you to everyone who sent messages of encouragement. This community is my second family.",
    tags: ["Victory"],
    createdAt: "2026-03-27T09:15:00",
    likes: 89,
    comments: 34,
    shares: 19,
  },
  {
    id: "4",
    authorName: "Lisa Chen",
    authorAvatar: "L",
    content: "Struggling with fatigue this week. Any tips on how to manage energy levels during treatment? I want to stay active for my kids.",
    tags: ["Question"],
    createdAt: "2026-03-26T16:45:00",
    likes: 35,
    comments: 28,
    shares: 3,
  },
  {
    id: "5",
    authorName: "Rachel Kim",
    authorAvatar: "R",
    content: "I created a meal prep guide specifically for women going through treatment. DM me if you'd like me to share it! Nutrition has been a game-changer for me.",
    tags: ["Support"],
    createdAt: "2026-03-26T11:00:00",
    likes: 56,
    comments: 19,
    shares: 27,
  },
];

export const resources: Resource[] = [
  {
    id: "1",
    title: "Understanding Your Treatment Plan",
    description: "A comprehensive guide to understanding different treatment options and what to expect.",
    category: "guide",
    featured: true,
    author: "Dr. Sarah Mitchell",
  },
  {
    id: "2",
    title: "Nutrition During Chemotherapy",
    description: "Video series on maintaining proper nutrition during treatment.",
    category: "video",
    featured: true,
    duration: "18 min",
    author: "Dr. Amy Chen",
  },
  {
    id: "3",
    title: "Emotional Wellness Workbook",
    description: "Downloadable workbook with exercises for emotional well-being.",
    category: "pdf",
    featured: false,
    author: "Dr. Lisa Park",
  },
  {
    id: "4",
    title: "Post-Surgery Recovery Guide",
    description: "Step-by-step guide for recovery after breast cancer surgery.",
    category: "guide",
    featured: true,
    author: "Dr. Michelle Adams",
  },
  {
    id: "5",
    title: "Mindfulness & Meditation for Patients",
    description: "Guided meditation sessions designed specifically for cancer patients.",
    category: "video",
    featured: false,
    duration: "25 min",
    author: "Dr. Karen Liu",
  },
  {
    id: "6",
    title: "Insurance & Financial Aid Guide",
    description: "Navigate insurance claims and find financial support resources.",
    category: "pdf",
    featured: false,
    author: "SheCare Team",
  },
];

export const dashboardStats: Stat[] = [
  { label: "Treatment Days", value: 45, change: "+2 this week", icon: "calendar" },
  { label: "Wellness Score", value: 78, change: "+5 from last week", icon: "heart" },
  { label: "Community Posts", value: 156, change: "12 new today", icon: "users" },
  { label: "Next Appointment", value: "Apr 2", change: "In 5 days", icon: "clock" },
];

export const symptoms: Symptom[] = [
  { id: "1", name: "Fatigue", severity: 6, date: "2026-03-28" },
  { id: "2", name: "Nausea", severity: 3, date: "2026-03-28" },
  { id: "3", name: "Pain", severity: 4, date: "2026-03-27" },
  { id: "4", name: "Mood", severity: 7, date: "2026-03-27" },
];

export const appointments: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Sarah Mitchell",
    specialty: "Oncologist",
    date: "2026-04-02",
    time: "10:00 AM",
    type: "in-person",
  },
  {
    id: "2",
    doctor: "Dr. Karen Liu",
    specialty: "Mental Health",
    date: "2026-04-05",
    time: "2:00 PM",
    type: "teleconsultation",
  },
];

export const quickActions = [
  { label: "Log Symptoms", icon: "activity", color: "pink" },
  { label: "Book Appointment", icon: "calendar", color: "blue" },
  { label: "Join Community", icon: "users", color: "green" },
  { label: "AI Assistant", icon: "bot", color: "purple" },
];
