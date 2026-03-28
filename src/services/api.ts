import { posts, resources, currentUser, dashboardStats, symptoms, appointments } from "@/data/yourData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPosts() {
  await delay(500);
  return posts;
}

export async function getResources() {
  await delay(500);
  return resources;
}

export async function getUserStats() {
  await delay(300);
  return dashboardStats;
}

export async function getCurrentUser() {
  await delay(300);
  return currentUser;
}

export async function getSymptoms() {
  await delay(400);
  return symptoms;
}

export async function getAppointments() {
  await delay(400);
  return appointments;
}
