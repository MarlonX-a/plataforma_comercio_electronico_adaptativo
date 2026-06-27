import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabaseClient';
import type {
  AuthOperationResult,
  AuthSession,
  CompleteProfileFormValues,
  LoginFormValues,
  RegisterFormValues,
  UserProfile,
  UserProfileRow,
} from '../types/auth.types';

type AuthSessionListener = (session: AuthSession | null) => void;

const getAuthErrorMessage = (message: string): string => {
  if (message.includes('Invalid login credentials')) {
    return 'El correo o la contraseña no son correctos.';
  }

  if (message.includes('User already registered')) {
    return 'Ya existe una cuenta registrada con este correo.';
  }

  if (message.includes('Password should be')) {
    return 'La contraseña debe cumplir los requisitos mínimos de seguridad.';
  }

  return message;
};

const mapUserRole = (role: string | null): UserProfile['role'] => {
  if (role === 'admin') {
    return 'admin';
  }

  if (role === 'worker' || role === 'seller' || role === 'vendedor') {
    return 'seller';
  }

  return 'customer';
};
const mapUserProfile = (profileRow: UserProfileRow | null): UserProfile | null => {
  if (!profileRow) {
    return null;
  }

  return {
    id: profileRow.id,
    fullName: profileRow.full_name,
    role: mapUserRole(profileRow.role),
    createdAt: profileRow.create_at,
  };
};

const mapSupabaseSession = (session: Session | null): AuthSession | null => {
  if (!session?.user) {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email ?? null,
    profile: null,
  };
};

export async function getCurrentAuthSession(): Promise<AuthSession | null> {
  const { data } = await supabase.auth.getSession();
  return mapSupabaseSession(data.session);
}

export function listenToAuthSession(listener: AuthSessionListener): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session) => {
    listener(mapSupabaseSession(session));
  });

  return () => subscription.unsubscribe();
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, create_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('No se pudo consultar el perfil del usuario.', error.message);
    return null;
  }

  return mapUserProfile(data);
}

export async function isUserProfileComplete(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return Boolean(profile?.fullName?.trim());
}

export async function saveUserProfile(
  userId: string,
  values: CompleteProfileFormValues,
): Promise<AuthOperationResult> {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      full_name: values.fullName.trim(),
      role: 'customer',
    },
    { onConflict: 'id' },
  );

  if (error) {
    console.warn('No se pudo guardar el perfil.', error.message);

    return {
      isSuccess: false,
      message: 'No se pudo guardar el perfil. Intenta nuevamente en unos segundos.',
    };
  }

  return {
    isSuccess: true,
    message: 'Perfil completado correctamente.',
  };
}

export async function loginWithEmail(values: LoginFormValues): Promise<AuthOperationResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return {
      isSuccess: false,
      message: getAuthErrorMessage(error.message),
    };
  }

  return {
    isSuccess: true,
    message: 'Inicio de sesión exitoso.',
  };
}

export async function registerWithEmail(values: RegisterFormValues): Promise<AuthOperationResult> {
  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return {
      isSuccess: false,
      message: getAuthErrorMessage(error.message),
    };
  }

  return {
    isSuccess: true,
    message: 'Cuenta creada. Confirma tu correo y luego inicia sesión para completar tu perfil.',
  };
}

export async function logout(): Promise<AuthOperationResult> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      isSuccess: false,
      message: getAuthErrorMessage(error.message),
    };
  }

  return {
    isSuccess: true,
    message: 'Sesión cerrada correctamente.',
  };
}
