import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { ASSETS } from '../data/mockData';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('dra.lopez@nutriapp.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthNotice('Validando credenciales con la red médica...');
    setAuthSuccess(false);

    setTimeout(() => {
      setAuthSuccess(true);
      setAuthNotice('Autenticación exitosa. Redirigiendo a plataforma clínica...');
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess();
      }, 650);
    }, 800);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthNotice('Conectando con Google Cloud & Firebase Authentication...');
    setAuthSuccess(false);
    try {
      await signInWithPopup(auth, googleAuthProvider);
      setAuthSuccess(true);
      setAuthNotice('Sesión médica iniciada con Google. Sincronizando Firestore...');
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess();
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthNotice(
        err?.message
          ? `Aviso de autenticación: ${err.message}`
          : 'No se completó el inicio de sesión con Google.'
      );
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex items-center justify-center w-full">
      <main className="w-full">
        <div className="flex flex-col w-full">
          <div className="relative w-full min-h-[92vh] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
            {/* Ambient organic medical glow circles */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-36 -right-36 w-[32rem] h-[32rem] rounded-full bg-surface-container-high/60 blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/3 left-2/3 w-64 h-64 rounded-full bg-tertiary-fixed/20 blur-2xl pointer-events-none"></div>

            {/* Main Container Card */}
            <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden z-10">
              {/* Left Panel: Editorial Clinical Context */}
              <div className="relative hidden md:flex md:w-5/12 bg-primary flex-col justify-between p-8 text-on-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-50 150 C 100 80, 200 250, 450 120" stroke="currentColor" strokeLinecap="round" strokeWidth="24"></path>
                    <path d="M-20 320 C 140 240, 220 480, 480 300" stroke="currentColor" strokeLinecap="round" strokeWidth="32"></path>
                    <path d="M-60 480 C 80 400, 260 560, 460 460" stroke="currentColor" strokeLinecap="round" strokeWidth="18"></path>
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-on-primary/10 text-on-primary backdrop-blur-sm">
                    <span className="material-symbols-outlined text-sm icon-filled">verified_user</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider">NutriApp Especialistas</span>
                  </div>
                  <h2 className="mt-8 font-display-lg text-display-lg text-on-primary">
                    Nutrición clínica de precisión.
                  </h2>
                  <p className="mt-3 font-body-md text-body-md text-on-primary/80 leading-relaxed">
                    Plataforma integral para dietistas y profesionales de la salud. Seguimiento metabólico, composición corporal y anamnesis en un solo lugar.
                  </p>
                </div>

                <div className="relative z-10 space-y-3 pt-6">
                  <div className="p-3.5 rounded-lg bg-on-primary/10 backdrop-blur-md flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-primary">query_stats</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-sm text-label-sm text-on-primary/75 uppercase">Historiales Activos</p>
                      <p className="font-headline-sm text-headline-sm text-on-primary truncate">+14,200 consultas procesadas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-on-primary/70 font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Cifrado grado hospitalario HIPAA / GDPR</span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Login Interface */}
              <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img
                        alt="NutriApp Logo"
                        className="w-full h-full object-contain"
                        src={ASSETS.logo}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                      NutriApp
                    </h1>
                    <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">
                      Bienvenido
                    </h2>
                    <p className="mt-1 font-body-sm text-body-sm text-secondary">
                      Ingresa a tu portal de especialista nutricional
                    </p>
                  </div>

                  {/* Login Form */}
                  <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5 text-left">
                      <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                        Correo electrónico
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-secondary pointer-events-none text-xl">
                          alternate_email
                        </span>
                        <input
                          className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200"
                          id="email"
                          name="email"
                          placeholder="ej. dra.lopez@nutriapp.com"
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                        Contraseña
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-secondary pointer-events-none text-xl">
                          lock
                        </span>
                        <input
                          className="w-full pl-11 pr-11 py-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200"
                          id="password"
                          name="password"
                          placeholder="••••••••••••"
                          required
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          aria-label="Mostrar u ocultar contraseña"
                          className="absolute right-3.5 p-1 rounded-md text-secondary hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="w-4 h-4 rounded accent-primary focus:ring-0 focus:outline-none cursor-pointer"
                          id="remember"
                          name="remember"
                          type="checkbox"
                        />
                        <span className="font-body-sm text-body-sm text-secondary">
                          Recordar sesión en este equipo
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthNotice('Se ha enviado un enlace de recuperación a ' + (email || 'tu correo institucional'))}
                        className="font-label-md text-label-md text-primary hover:text-tertiary-container hover:underline transition-colors cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>

                    <button
                      disabled={isSubmitting}
                      className={`w-full mt-2 py-3 px-6 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer ${
                        isSubmitting ? 'opacity-80 pointer-events-none' : ''
                      }`}
                      type="submit"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                          <span>Accediendo...</span>
                        </>
                      ) : (
                        <>
                          <span>Iniciar sesión</span>
                          <span className="material-symbols-outlined text-lg transition-transform duration-200 group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full py-2.5 px-6 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
                      <span>Continuar con Google (Sincronización Firebase)</span>
                    </button>
                  </form>

                  {authNotice && (
                    <div
                      className={`mt-4 p-3 rounded-lg font-body-sm text-body-sm text-center transition-colors ${
                        authSuccess
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container-highest text-on-surface'
                      }`}
                    >
                      {authNotice}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4">
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-secondary text-center">
                    <span className="material-symbols-outlined text-primary text-base shrink-0 icon-filled">
                      verified
                    </span>
                    <span className="font-label-sm text-label-sm">
                      Plataforma médica cifrada SSL y cumplimiento de privacidad clínica
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-4 text-outline font-label-sm text-label-sm">
                    <button type="button" onClick={() => setAuthNotice('Soporte clínico 24/7: soporte@nutriapp.com')} className="hover:text-on-surface transition-colors cursor-pointer">
                      Centro de Soporte
                    </button>
                    <span>•</span>
                    <button type="button" onClick={() => setAuthNotice('Cumplimiento normativo NOM-004-SSA3 y HIPAA verificado.')} className="hover:text-on-surface transition-colors cursor-pointer">
                      Aviso de Privacidad
                    </button>
                    <span>•</span>
                    <span className="text-outline">v4.8.2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
