import type { Tables } from '../../../types/database.types';

export type UserProfileRow = Tables<'profiles'>;

export type UserRole = 'customer' | 'worker' | 'seller' | 'admin';

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
  email: string;
  password: string;
  confirmPassword: string;
};

export type CompleteProfileFormValues = {
  fullName: string;
};

export type PasswordStrengthLevel = 'empty' | 'low' | 'medium' | 'high';

export type AuthOperationResult =
  | {
      isSuccess: true;
      message: string;
    }
  | {
      isSuccess: false;
      message: string;
    };
