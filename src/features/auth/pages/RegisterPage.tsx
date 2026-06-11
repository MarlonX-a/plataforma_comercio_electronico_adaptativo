import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import uiStyles from '../../../components/ui/UiPrimitives.module.css';
import { registerWithEmail } from '../services/authService';
import type { PasswordStrengthLevel, RegisterFormValues } from '../types/auth.types';
import styles from './AuthPage.module.css';

const initialRegisterFormValues: RegisterFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

const passwordStrengthLabel: Record<PasswordStrengthLevel, string> = {
  empty: 'Escribe una contraseña para medir su seguridad.',
  low: 'Seguridad baja: agrega más caracteres, números o símbolos.',
  medium: 'Seguridad media: vas bien, pero puede mejorar.',
  high: 'Seguridad alta: buena combinación de longitud y variedad.',
};

const getPasswordStrengthLevel = (password: string): PasswordStrengthLevel => {
  if (!password) {
    return 'empty';
  }

  const strengthChecks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const passedChecks = strengthChecks.filter(Boolean).length;

  if (password.length < 6 || passedChecks <= 2) {
    return 'low';
  }

  if (passedChecks <= 4) {
    return 'medium';
  }

  return 'high';
};

export default function RegisterPage() {
  const [formValues, setFormValues] = useState<RegisterFormValues>(initialRegisterFormValues);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const passwordStrengthLevel = useMemo(
    () => getPasswordStrengthLevel(formValues.password),
    [formValues.password],
  );
  const passwordsDoNotMatch =
    Boolean(formValues.confirmPassword) && formValues.password !== formValues.confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setIsError(false);

    if (formValues.password !== formValues.confirmPassword) {
      setStatusMessage('Las contraseñas no coinciden. Revisa ambos campos.');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    const result = await registerWithEmail(formValues);
    setStatusMessage(result.message);
    setIsError(!result.isSuccess);
    setIsSubmitting(false);

    if (result.isSuccess) {
      setFormValues(initialRegisterFormValues);
    }
  };

  return (
    <section className={styles.authPage} aria-labelledby="register-title">
      <div className={`${styles.authPanel} ${uiStyles.formCard}`}>
        <p className={styles.kicker}>Nueva cuenta</p>
        <h1 id="register-title">Crear cuenta</h1>
        <p className={styles.summary}>
          Primero crea tu acceso. Después de confirmar tu correo e iniciar sesión, completarás tu
          perfil.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={`${styles.fieldGroup} ${uiStyles.formGroup}`}>
            <label htmlFor="register-email">Correo electrónico</label>
            <div className={uiStyles.inputWrapper}>
              <FaEnvelope className={uiStyles.inputIcon} aria-hidden="true" />
              <input
                className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="marlon@correo.com"
                value={formValues.email}
                aria-invalid={isError}
                aria-describedby={isError ? 'register-status' : undefined}
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
            <label htmlFor="register-password">Contraseña</label>
            <div className={`${styles.passwordInputWrapper} ${uiStyles.inputWrapper}`}>
              <FaLock className={uiStyles.inputIcon} aria-hidden="true" />
              <input
                className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                id="register-password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={6}
                placeholder="Ejemplo: Tienda2026!"
                value={formValues.password}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    password: event.target.value,
                  }))
                }
                aria-invalid={isError}
                aria-describedby={
                  isError ? 'password-strength-message register-status' : 'password-strength-message'
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
            <div className={styles.passwordStrength} data-strength={passwordStrengthLevel}>
              <span className={styles.passwordStrengthTrack} aria-hidden="true">
                <span className={styles.passwordStrengthBar} />
              </span>
              <p id="password-strength-message" className={styles.helpText} aria-live="polite">
                {passwordStrengthLabel[passwordStrengthLevel]}
              </p>
            </div>
          </div>

          <div className={`${styles.fieldGroup} ${uiStyles.formGroup}`}>
            <label htmlFor="register-confirm-password">Confirmar contraseña</label>
            <div className={`${styles.passwordInputWrapper} ${uiStyles.inputWrapper}`}>
              <FaLock className={uiStyles.inputIcon} aria-hidden="true" />
              <input
                className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                id="register-confirm-password"
                name="confirmPassword"
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={6}
                placeholder="Repite tu contraseña"
                value={formValues.confirmPassword}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    confirmPassword: event.target.value,
                  }))
                }
                aria-describedby={
                  isError
                    ? 'confirm-password-message register-status'
                    : 'confirm-password-message'
                }
                aria-invalid={passwordsDoNotMatch}
                required
              />
              <button
                className={styles.passwordToggle}
                type="button"
                aria-label={
                  isConfirmPasswordVisible
                    ? 'Ocultar confirmación de contraseña'
                    : 'Mostrar confirmación de contraseña'
                }
                onClick={() => setIsConfirmPasswordVisible((currentValue) => !currentValue)}
              >
                {isConfirmPasswordVisible ? (
                  <FaEyeSlash aria-hidden="true" />
                ) : (
                  <FaEye aria-hidden="true" />
                )}
              </button>
            </div>
            {formValues.confirmPassword ? (
              <p
                id="confirm-password-message"
                className={
                  formValues.password === formValues.confirmPassword
                    ? styles.matchMessage
                    : styles.mismatchMessage
                }
                aria-live="polite"
              >
                {formValues.password === formValues.confirmPassword
                  ? 'Las contraseñas coinciden.'
                  : 'Las contraseñas todavía no coinciden.'}
              </p>
            ) : (
              <span id="confirm-password-message" className={styles.helpText}>
                Debe ser igual a la contraseña anterior.
              </span>
            )}
          </div>

          {statusMessage ? (
            <p
              id="register-status"
              className={isError ? styles.errorMessage : styles.successMessage}
              role={isError ? 'alert' : 'status'}
            >
              {statusMessage}
            </p>
          ) : null}

          {statusMessage && !isError ? (
            <Link className={`${styles.successAction} ${uiStyles.secondaryButton}`} to="/login">
              Continuar al inicio de sesiÃ³n
            </Link>
          ) : null}

          <button
            className={`${styles.submitButton} ${uiStyles.primaryButton}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear acceso'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </section>
  );
}
