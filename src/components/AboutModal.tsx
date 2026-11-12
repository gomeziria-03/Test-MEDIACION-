import React from 'react';
import { X, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onStartTest }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-indigo-600 mb-2">
          <HeartHandshake className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Semana de la Salud</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-3">
          Equipo de Mediación y Resolución de Conflictos
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Este test interactivo forma parte del programa de convivencia del centro escolar. La mediación entre iguales es una herramienta educativa donde el propio alumnado ayuda a resolver desacuerdos de forma pacífica, confidencial y voluntaria.
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              ¿Por qué fomentar la asertividad?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              La asertividad no consiste en "tener siempre la razón", sino en saber expresar lo que sientes sin agredir y sin someterte. Permite defender tus límites mientras escuchas con empatía las razones del otro.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              El riesgo del silencio (Estilo Pasivo)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Decir siempre "no pasa nada" cuando sí pasa suele acumular rencor o hacer que te sientas invisible. Tus opiniones y necesidades valen tanto como las de cualquier compañero.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              El coste de ganar por la fuerza (Estilo Agresivo)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Levantar la voz o ridiculizar puede hacerte "ganar" una discusión puntual, pero deteriora la confianza con tus amigos y te aísla a largo plazo.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 text-xs text-slate-600">
          <div className="font-bold text-slate-900 mb-1">¿Tienes un conflicto en el instituto?</div>
          <p>
            Acércate al aula de convivencia o habla con tu tutor/a para solicitar una sesión con los alumnos mediadores. Estamos aquí para escuchar y tender puentes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onStartTest();
          }}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
        >
          Hacer el test ahora
        </button>
      </div>
    </div>
  );
};
