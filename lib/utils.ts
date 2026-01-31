import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVibeGradient(seed: string = "") {
  const gradients = [
    "bg-gradient-to-br from-rose-400 to-orange-300",
    "bg-gradient-to-br from-blue-400 to-indigo-500",
    "bg-gradient-to-br from-emerald-400 to-cyan-400",
    "bg-gradient-to-br from-violet-400 to-fuchsia-400",
    "bg-gradient-to-br from-amber-400 to-pink-500",
    "bg-gradient-to-br from-teal-400 to-lime-400",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
}
