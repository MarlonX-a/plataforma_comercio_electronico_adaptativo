import { useState } from 'react';
import type { FormEvent } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import uiStyles from '../../../components/ui/UiPrimitives.module.css';
import { getCurrentAuthSession, isUserProfileComplete, loginWithEmail } from '../services/authService';
import type { LoginFormValues } from '../types/auth.types';
import styles from './AuthPage.module.css';

const initialLoginFormValues: LoginFormValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<LoginFormValues>(initialLoginFormValues);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setIsError(false);

    const result = await loginWithEmail(formValues);
    setStatusMessage(result.message);
    setIsError(!result.isSuccess);
    setIsSubmitting(false);

    if (result.isSuccess) {
      const session = await getCurrentAuthSession();
      const isProfileComplete = session ? await isUserProfileComplete(session.userId) : false;
      navigate(isProfileComplete ? '/' : '/complete-profile');
    }
  };

  return (
    <section className={styles.authPage} aria-labelledby="login-title">
      <div className={`${styles.authPanel} ${uiStyles.formCard}`}>
        <p className={styles.kicker}>Acceso seguro</p>
        <h1 id="login-title">Iniciar sesión</h1>
        <p className={styles.summary}>
          Entra a tu cuenta para continuar con tus compras y preferencias de accesibilidad.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={`${styles.fieldGroup} ${uiStyles.formGroup}`}>
            <label htmlFor="login-email">Correo electrónico</label>
            <div className={uiStyles.inputWrapper}>
              <FaEnvelope className={uiStyles.inputIcon} aria-hidden="true" />
              <input
                className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="ejemplo@correo.com"
                value={formValues.email}
                aria-invalid={isError}
                aria-describedby={statusMessage ? 'login-status' : undefined}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className={`${styles.fieldGroup} ${uiStyles.formGroup}`}>
            <label htmlFor="login-password">Contraseña</label>
            <div className={`${styles.passwordInputWrapper} ${uiStyles.inputWrapper}`}>
              <FaLock className={uiStyles.inputIcon} aria-hidden="true" />
              <input
                className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                id="login-password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                value={formValues.password}
                aria-invalid={isError}
                aria-describedby={statusMessage ? 'login-status' : undefined}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    password: event.target.value,
                  }))
                }
                required
              />
              <button
                className={styles.passwordToggle}
                type="button"
                aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
              >
                {isPasswordVisible ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
              </button>
            </div>
          </div>

          {statusMessage ? (
            <p
              id="login-status"
              className={isError ? styles.errorMessage : styles.successMessage}
              role={isError ? 'alert' : 'status'}
            >
              {statusMessage}
            </p>
          ) : null}

          <button
            className={`${styles.submitButton} ${uiStyles.primaryButton}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </section>
  );
}
