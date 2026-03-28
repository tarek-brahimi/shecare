import { formatDistanceToNow, format } from "date-fns";

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatTime(date: string) {
  return format(new Date(date), "h:mm a");
}

export function getProgressPercent(current: number, total: number) {
  return Math.round((current / total) * 100);
}
