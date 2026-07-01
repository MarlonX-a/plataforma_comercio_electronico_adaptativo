import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import uiStyles from '../../../components/ui/UiPrimitives.module.css';
import {
  getCurrentAuthSession,
  requestPasswordReset,
  updateCurrentUserPassword,
} from '../services/authService';
import styles from './AuthPage.module.css';

type ResetPasswordFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const initialResetPasswordFormValues: ResetPasswordFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

const isRecoveryFlowFromUrl = (): boolean => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('type') === 'recovery') {
    return true;
  }

  return window.location.hash.includes('type=recovery');
};

export default function ResetPasswordPage() {
  const [formValues, setFormValues] = useState<ResetPasswordFormValues>(
    initialResetPasswordFormValues,
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(isRecoveryFlowFromUrl());

  useEffect(() => {
    if (!isRecoveryMode) {
      return;
    }

    getCurrentAuthSession().then((session) => {
      if (!session) {
        setStatusMessage(
          'El enlace de recuperación no es válido o expiró. Solicita uno nuevo para continuar.',
        );
        setIsError(true);
      }
    });
  }, [isRecoveryMode]);

  const passwordsDoNotMatch = useMemo(
    () => formValues.password !== formValues.confirmPassword,
    [formValues.password, formValues.confirmPassword],
  );

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setIsError(false);

    const result = await requestPasswordReset(formValues.email);
    setStatusMessage(result.message);
    setIsError(!result.isSuccess);
    setIsSubmitting(false);

    if (result.isSuccess) {
      setFormValues((current) => ({ ...current, email: '' }));
    }
  };

  const handleResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setIsError(false);

    if (passwordsDoNotMatch) {
      setStatusMessage('Las contraseñas no coinciden. Revisa ambos campos.');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    const result = await updateCurrentUserPassword(formValues.password);
    setStatusMessage(result.message);
    setIsError(!result.isSuccess);
    setIsSubmitting(false);

    if (result.isSuccess) {
      setFormValues(initialResetPasswordFormValues);
      setIsRecoveryMode(false);
    }
  };

  return (
    <section className={styles.authPage} aria-labelledby="reset-password-title">
      <div className={`${styles.authPanel} ${uiStyles.formCard}`}>
        <p className={styles.kicker}>Recuperación de acceso</p>
        <h1 id="reset-password-title">
          {isRecoveryMode ? 'Define tu nueva contraseña' : '¿Olvidaste tu contraseña?'}
        </h1>
        <p className={styles.summary}>
          {isRecoveryMode
            ? 'Escribe una contraseña nueva para recuperar tu cuenta.'
            : 'Ingresa tu correo y te enviaremos un enlace para restablecerla.'}
        </p>

        <form className={styles.form} onSubmit={isRecoveryMode ? handleResetSubmit : handleRequestSubmit}>
          {isRecoveryMode ? (
            <>
              <div className={`${styles.fieldGroup} ${uiStyles.formGroup}`}>
                <label htmlFor="new-password">Nueva contraseña</label>
                <div className={`${styles.passwordInputWrapper} ${uiStyles.inputWrapper}`}>
                  <FaLock className={uiStyles.inputIcon} aria-hidden="true" />
                  <input
                    className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                    id="new-password"
                    name="new-password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="Nueva contraseña"
                    value={formValues.password}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    className={styles.passwordToggle}
                    type="button"
                    aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setIsPasswordVisible((current) => !current)}
                  >
                    {isPasswordVisible ? (
                      <FaEyeSlash aria-hidden="true" />
                    ) : (
                      <FaEye aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className={`${styles.fieldGroup} ${uiStyles.formGroup}`}>
                <label htmlFor="confirm-new-password">Confirmar contraseña</label>
                <div className={`${styles.passwordInputWrapper} ${uiStyles.inputWrapper}`}>
                  <FaLock className={uiStyles.inputIcon} aria-hidden="true" />
                  <input
                    className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                    id="confirm-new-password"
                    name="confirm-new-password"
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="Repite tu nueva contraseña"
                    value={formValues.confirmPassword}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
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
                    onClick={() => setIsConfirmPasswordVisible((current) => !current)}
                  >
                    {isConfirmPasswordVisible ? (
                      <FaEyeSlash aria-hidden="true" />
                    ) : (
                      <FaEye aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`${styles.fieldGroup} ${uiStyles.formGroup}`}>
              <label htmlFor="reset-email">Correo electrónico</label>
              <div className={uiStyles.inputWrapper}>
                <FaEnvelope className={uiStyles.inputIcon} aria-hidden="true" />
                <input
                  className={`${uiStyles.formInput} ${uiStyles.formInputWithIcon}`}
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          )}

          {statusMessage ? (
            <p className={isError ? styles.errorMessage : styles.successMessage} role={isError ? 'alert' : 'status'}>
              {statusMessage}
            </p>
          ) : null}

          <button
            className={`${styles.submitButton} ${uiStyles.primaryButton}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Procesando...'
              : isRecoveryMode
                ? 'Actualizar contraseña'
                : 'Enviar enlace de recuperación'}
          </button>
        </form>

        <p className={styles.switchText}>
          Volver a <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </section>
  );
}
