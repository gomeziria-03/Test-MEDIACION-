import React, { useState, useEffect } from 'react';
import {
  X,
  BarChart3,
  Download,
  RotateCcw,
  RefreshCw,
  Users,
  Award,
  Calendar,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Lock,
  KeyRound,
  Check,
  AlertCircle
} from 'lucide-react';
import { CommunicationStyle, Gender } from '../types';

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  gender: Gender;
  predominantStyle: CommunicationStyle;
  percentages: {
    asertivo: number;
    pasivo: number;
    agresivo: number;
  };
  topCharacter: string;
  topCharacterTrait: string;
  topCharacterCompatibility: number;
}

interface StatsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsDashboardModal: React.FC<StatsDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [pin, setPin] = useState('');
  const [creatorToken, setCreatorToken] = useState<string | null>(() => {
    return localStorage.getItem('mediacion_creator_pin') || null;
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Change PIN state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  const fetchStats = async (tokenToUse?: string) => {
    const token = tokenToUse || creatorToken;
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/results', {
        headers: { 'x-creator-pin': token }
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.results || []);
      } else if (res.status === 401) {
        setCreatorToken(null);
        localStorage.removeItem('mediacion_creator_pin');
        setAuthError('El PIN guardado no es válido. Por favor, introdúcelo de nuevo.');
      }
    } catch {
      // Offline fallback
      const local = localStorage.getItem('mediacion_test_submissions');
      if (local) {
        setSubmissions(JSON.parse(local));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      setConfirmReset(false);
      setIsChangingPin(false);
      if (creatorToken) {
        fetchStats(creatorToken);
      }
    }
  }, [isOpen, creatorToken]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const token = data.token;
        setCreatorToken(token);
        localStorage.setItem('mediacion_creator_pin', token);
        setPin('');
        fetchStats(token);
      } else {
        setAuthError(data.error || 'PIN incorrecto. Acceso denegado.');
      }
    } catch {
      // In case server is offline, accept creator PIN 241003
      if (pin.trim() === '241003') {
        setCreatorToken('241003');
        localStorage.setItem('mediacion_creator_pin', '241003');
        setPin('');
        fetchStats('241003');
      } else {
        setAuthError('PIN incorrecto. Acceso denegado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCreatorToken(null);
    localStorage.removeItem('mediacion_creator_pin');
    setSubmissions([]);
    setPin('');
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim() || newPin.trim().length < 4) {
      alert('El nuevo PIN debe tener al menos 4 caracteres.');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-creator-pin': creatorToken || ''
        },
        body: JSON.stringify({ newPin: newPin.trim() })
      });

      if (res.ok) {
        setCreatorToken(newPin.trim());
        localStorage.setItem('mediacion_creator_pin', newPin.trim());
        setPinChangeSuccess(true);
        setTimeout(() => {
          setPinChangeSuccess(false);
          setIsChangingPin(false);
          setNewPin('');
        }, 2000);
      } else {
        alert('No se pudo cambiar el PIN.');
      }
    } catch {
      alert('Error al cambiar el PIN.');
    }
  };

  // Global calculations
  const total = submissions.length;
  const countAsertivo = submissions.filter((s) => s.predominantStyle === 'asertivo').length;
  const countPasivo = submissions.filter((s) => s.predominantStyle === 'pasivo').length;
  const countAgresivo = submissions.filter((s) => s.predominantStyle === 'agresivo').length;

  const pctAsertivo = total > 0 ? Math.round((countAsertivo / total) * 100) : 0;
  const pctPasivo = total > 0 ? Math.round((countPasivo / total) * 100) : 0;
  const pctAgresivo = total > 0 ? Math.max(0, 100 - (pctAsertivo + pctPasivo)) : 0;

  // Gender counts
  const countHombre = submissions.filter((s) => s.gender === 'hombre').length;
  const countMujer = submissions.filter((s) => s.gender === 'mujer').length;
  const countOtro = submissions.filter((s) => s.gender === 'otro').length;

  // Character frequency ranking
  const charFreq: Record<string, number> = {};
  submissions.forEach((s) => {
    if (s.topCharacter) {
      charFreq[s.topCharacter] = (charFreq[s.topCharacter] || 0) + 1;
    }
  });

  const sortedChars = Object.entries(charFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // CSV Export
  const handleExportCSV = () => {
    if (submissions.length === 0) return;

    const headers = [
      'ID',
      'Fecha y Hora',
      'Genero',
      'Estilo Predominante',
      '% Asertivo',
      '% Pasivo',
      '% Agresivo',
      'Personaje Principal',
      'Cualidad',
      '% Compatibilidad'
    ];

    const rows = submissions.map((s) => [
      s.id,
      new Date(s.timestamp).toLocaleString('es-ES'),
      s.gender,
      s.predominantStyle,
      s.percentages.asertivo,
      s.percentages.pasivo,
      s.percentages.agresivo,
      `"${s.topCharacter}"`,
      `"${s.topCharacterTrait}"`,
      s.topCharacterCompatibility
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `estadisticas_mediacion_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset database
  const handleResetData = async () => {
    try {
      await fetch('/api/results/reset', {
        method: 'POST',
        headers: { 'x-creator-pin': creatorToken || '' }
      });
      localStorage.removeItem('mediacion_test_submissions');
      setSubmissions([]);
      setConfirmReset(false);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-slate-900/10 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
                <span>Panel Privado de la Creadora</span>
                {creatorToken && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    Sesión Verificada
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Acceso restringido · Estadísticas acumuladas y exportación de datos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: 1. PIN Lock Screen if not authorized */}
        {!creatorToken ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 font-outfit mb-2">
              Introduce tu PIN de Creadora
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Para garantizar que los alumnos no puedan ver ni alterar las estadísticas del centro, este panel está protegido por contraseña.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Introduce el PIN de creadora"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={16}
                  autoFocus
                  className="w-full py-3 px-4 text-center tracking-widest text-lg font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:outline-none placeholder:text-slate-400 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
                />
              </div>

              {authError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 justify-center font-medium bg-rose-50 p-2 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !pin.trim()}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-2xl text-sm shadow-md transition-all cursor-pointer font-outfit"
              >
                {loading ? 'Verificando...' : 'Desbloquear Estadísticas 🔓'}
              </button>
            </form>
          </div>
        ) : (
          /* 2. Authorized Stats Dashboard */
          <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Panel desbloqueado · Solo visible en tu dispositivo</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(!isChangingPin)}
                  className="text-xs text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                >
                  Cambiar PIN
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => fetchStats()}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Change PIN Box */}
            {isChangingPin && (
              <form
                onSubmit={handleChangePin}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Nuevo PIN de Creadora (mínimo 4 caracteres):
                  </label>
                  <input
                    type="text"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Ejemplo: 4819"
                    className="w-full py-1.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 cursor-pointer self-end"
                >
                  Guardar nuevo PIN
                </button>
                {pinChangeSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> ¡PIN actualizado con éxito!
                  </span>
                )}
              </form>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Total Respuestas
                </span>
                <span className="text-3xl font-black text-slate-900 font-outfit tabular-nums">
                  {total}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Alumnos participantes</span>
              </div>

              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  🟢 Asertivos
                </span>
                <span className="text-3xl font-black text-emerald-700 font-outfit tabular-nums">
                  {pctAsertivo}%
                </span>
                <span className="text-[11px] text-emerald-600 block mt-0.5">{countAsertivo} alumnos</span>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  🟡 Pasivos
                </span>
                <span className="text-3xl font-black text-amber-700 font-outfit tabular-nums">
                  {pctPasivo}%
                </span>
                <span className="text-[11px] text-amber-600 block mt-0.5">{countPasivo} alumnos</span>
              </div>

              <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
                  🔴 Agresivos
                </span>
                <span className="text-3xl font-black text-rose-700 font-outfit tabular-nums">
                  {pctAgresivo}%
                </span>
                <span className="text-[11px] text-rose-600 block mt-0.5">{countAgresivo} alumnos</span>
              </div>
            </div>

            {/* Visual Global Proportion Bar */}
            {total > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                  <span>Distribución general del centro escolar</span>
                  <span className="text-slate-400 font-normal">Muestra de {total} participantes</span>
                </div>
                <div className="w-full h-5 rounded-xl overflow-hidden flex bg-slate-100 p-0.5">
                  <div
                    className="bg-emerald-500 h-full rounded-l-lg transition-all"
                    style={{ width: `${pctAsertivo}%` }}
                    title={`Asertivo: ${pctAsertivo}%`}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all"
                    style={{ width: `${pctPasivo}%` }}
                    title={`Pasivo: ${pctPasivo}%`}
                  />
                  <div
                    className="bg-rose-500 h-full rounded-r-lg transition-all"
                    style={{ width: `${pctAgresivo}%` }}
                    title={`Agresivo: ${pctAgresivo}%`}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Asertivo: {pctAsertivo}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Pasivo: {pctPasivo}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Agresivo: {pctAgresivo}%
                  </span>
                </div>
              </div>
            )}

            {/* Top Characters in the School & Gender Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Top Characters */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5 font-outfit">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Personajes más frecuentes en el centro</span>
                </h3>
                {sortedChars.length > 0 ? (
                  <div className="space-y-2">
                    {sortedChars.map(([name, count], idx) => (
                      <div
                        key={name}
                        className="bg-white rounded-xl p-2 px-3 flex items-center justify-between text-xs border border-slate-200/70"
                      >
                        <span className="font-bold text-slate-800">
                          {idx + 1}. {name}
                        </span>
                        <span className="font-mono text-indigo-600 font-bold">
                          {count} {count === 1 ? 'alumno' : 'alumnos'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Todavía no hay tests registrados hoy.
                  </div>
                )}
              </div>

              {/* Demographics / Gender */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5 font-outfit">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Participación por identificación</span>
                </h3>
                <div className="space-y-2">
                  <div className="bg-white rounded-xl p-2.5 px-3 flex items-center justify-between text-xs border border-slate-200/70">
                    <span className="font-medium text-slate-700">Hombre</span>
                    <span className="font-mono text-slate-900 font-bold tabular-nums">
                      {countHombre} ({total > 0 ? Math.round((countHombre / total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 px-3 flex items-center justify-between text-xs border border-slate-200/70">
                    <span className="font-medium text-slate-700">Mujer</span>
                    <span className="font-mono text-slate-900 font-bold tabular-nums">
                      {countMujer} ({total > 0 ? Math.round((countMujer / total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 px-3 flex items-center justify-between text-xs border border-slate-200/70">
                    <span className="font-medium text-slate-700">Otro / No especificado</span>
                    <span className="font-mono text-slate-900 font-bold tabular-nums">
                      {countOtro} ({total > 0 ? Math.round((countOtro / total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submissions Table Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-outfit">
                  Últimos tests realizados ({submissions.length})
                </span>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={total === 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    total === 0
                      ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Exportar CSV (Excel)</span>
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {submissions.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Hora</th>
                        <th className="py-2 px-3">Género</th>
                        <th className="py-2 px-3">Estilo</th>
                        <th className="py-2 px-3 font-mono">Desglose (As / Pas / Agr)</th>
                        <th className="py-2 px-3">Personaje más afín</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {submissions.slice(-20).reverse().map((sub) => {
                        const badge =
                          sub.predominantStyle === 'asertivo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.predominantStyle === 'pasivo'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800';

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 text-slate-500 whitespace-nowrap font-mono">
                              {new Date(sub.timestamp).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-2 px-3 capitalize">{sub.gender}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${badge}`}>
                                {sub.predominantStyle}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono">
                              {sub.percentages.asertivo}% / {sub.percentages.pasivo}% / {sub.percentages.agresivo}%
                            </td>
                            <td className="py-2 px-3 font-medium text-slate-900">
                              {sub.topCharacter} ({sub.topCharacterCompatibility}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No hay registros guardados aún. Cada vez que un alumno finalice el test, aparecerá aquí automáticamente.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {creatorToken && !confirmReset && (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                disabled={total === 0}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer disabled:opacity-40"
              >
                Reiniciar contador de estadísticas
              </button>
            )}

            {creatorToken && confirmReset && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-rose-700 font-bold">¿Borrar todas las respuestas?</span>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 cursor-pointer"
                >
                  Sí, borrar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar panel
          </button>
        </div>
      </div>
    </div>
  );
};
