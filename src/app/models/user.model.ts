export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
