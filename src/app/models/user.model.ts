export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'user';
  locked: boolean;
  createdAt: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

/**
 * Generate Gravatar URL from email
 */
export function getGravatarUrl(email: string, size: number = 80): string {
  const hash = email.trim().toLowerCase();
  // Simple hash for demo - in production use proper MD5 hash
  return `https://www.gravatar.com/avatar/${btoa(hash)}?s=${size}&d=identicon`;
}

/**
 * Get user avatar URL with Gravatar fallback
 */
export function getUserAvatar(user: { email: string; avatar?: string }, size: number = 80): string {
  return user.avatar || getGravatarUrl(user.email, size);
}
