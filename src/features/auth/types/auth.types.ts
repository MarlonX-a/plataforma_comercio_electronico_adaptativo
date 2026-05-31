import type { Tables } from '../../../types/database.types';

export type UserProfileRow = Tables<'profiles'>;

export type UserRole = 'customer' | 'admin';

export type UserProfile = {
  id: string;
  fullName: string | null;
  role: UserRole | null;
  createdAt: string | null;
};

export type AuthSession = {
  userId: string;
  email: string | null;
  profile: UserProfile | null;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
};
