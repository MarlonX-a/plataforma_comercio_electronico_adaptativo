import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAuthSession, getUserProfile, saveUserProfile } from '../services/authService';
import type { CompleteProfileFormValues } from '../types/auth.types';
import styles from './AuthPage.module.css';

const initialCompleteProfileFormValues: CompleteProfileFormValues = {
  fullName: '',
};

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<CompleteProfileFormValues>(
    initialCompleteProfileFormValues,
  );
  const [userId, setUserId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCurrentAuthSession().then(async (session) => {
      if (!session) {
        navigate('/login');
        return;
      }

      setUserId(session.userId);
      const profile = await getUserProfile(session.userId);

      if (profile?.fullName) {
        setFormValues({ fullName: profile.fullName });
      }
    });
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setIsError(false);

    if (!userId) {
      setStatusMessage('Necesitas iniciar sesión antes de completar tu perfil.');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    const result = await saveUserProfile(userId, formValues);
    setStatusMessage(result.message);
    setIsError(!result.isSuccess);
    setIsSubmitting(false);

    if (result.isSuccess) {
      window.dispatchEvent(new Event('auth-profile-updated'));
      window.setTimeout(() => navigate('/'), 700);
    }
  };

  return (
    <section className={styles.authPage} aria-labelledby="complete-profile-title">
      <div className={styles.authPanel}>
        <p className={styles.kicker}>Último paso</p>
        <h1 id="complete-profile-title">Completa tu perfil</h1>
        <p className={styles.summary}>
          Este dato es obligatorio para personalizar tu experiencia dentro de la tienda.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="profile-full-name">Nombre completo</label>
            <input
              id="profile-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Marlon Alvia"
              value={formValues.fullName}
              onChange={(event) =>
                setFormValues({
                  fullName: event.target.value,
                })
              }
              required
            />
          </div>

          {statusMessage ? (
            <p className={isError ? styles.errorMessage : styles.successMessage} aria-live="polite">
              {statusMessage}
            </p>
          ) : null}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando perfil...' : 'Guardar y continuar'}
          </button>
        </form>
      </div>
    </section>
  );
}
