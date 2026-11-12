import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './data/questions';
import { Gender, TestResult } from './types';
import { calculateTestResults } from './utils/calculator';
import { Header } from './components/Header';
import { HeroIntro } from './components/HeroIntro';
import { QuestionCard } from './components/QuestionCard';
import { ResultsView } from './components/ResultsView';
import { CharacterDirectoryModal } from './components/CharacterDirectoryModal';
import { QRModal } from './components/QRModal';
import { AboutModal } from './components/AboutModal';
import { StoryCardModal } from './components/StoryCardModal';
import { StatsDashboardModal, SubmissionRecord } from './components/StatsDashboardModal';
import { Lock } from 'lucide-react';

type AppStep = 'intro' | 'quiz' | 'results';

export default function App() {
  const [step, setStep] = useState<AppStep>('intro');
  const [gender, setGender] = useState<Gender>('hombre');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Modals state
  const [isDirOpen, setIsDirOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Check if creator opened with ?admin or #admin in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (search.includes('admin') || hash.includes('admin')) {
        setIsStatsOpen(true);
      }
    }
  }, []);

  // Start test
  const handleStartTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers((prev) => ({
      ...prev,
      [QUESTIONS[0].id]: prev[QUESTIONS[0].id] ?? 50
    }));
    setStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to initial screen
  const handleReset = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Answer handler
  const handleAnswerChange = (val: number) => {
    const currentQ = QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val
    }));
  };

  // Save submission to server and localStorage
  const saveSubmissionRecord = (res: TestResult) => {
    const newRecord: SubmissionRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      gender,
      predominantStyle: res.predominantStyle,
      percentages: res.percentages,
      topCharacter: res.topCharacters[0]?.character.name || 'Desconocido',
      topCharacterTrait: res.topCharacters[0]?.character.trait || '',
      topCharacterCompatibility: res.topCharacters[0]?.compatibility || 0
    };

    // 1. Send to backend Express server
    try {
      fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          predominantStyle: res.predominantStyle,
          percentages: res.percentages,
          topCharacters: res.topCharacters,
          userStats: res.userStats
        })
      }).catch(() => {
        // network fallback
      });
    } catch {
      // safe fallback
    }

    // 2. Also save to localStorage as backup
    try {
      const raw = localStorage.getItem('mediacion_test_submissions');
      const list: SubmissionRecord[] = raw ? JSON.parse(raw) : [];
      list.push(newRecord);
      localStorage.setItem('mediacion_test_submissions', JSON.stringify(list));
    } catch {
      // safe fallback
    }
  };

  // Next question or finish
  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQ = QUESTIONS[nextIndex];
      setAnswers((prev) => ({
        ...prev,
        [nextQ.id]: prev[nextQ.id] ?? 50
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Calculate and save results
      const res = calculateTestResults(answers, gender);
      setTestResult(res);
      saveSubmissionRecord(res);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentValue = answers[currentQuestion?.id] ?? 50;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-pink-500 selection:text-white">
      {/* Top Bar Contract Compliant Header (Student view) */}
      <Header
        onStartTest={handleStartTest}
        onOpenDirectory={() => setIsDirOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isTestActive={step === 'quiz'}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {step === 'intro' && (
          <HeroIntro
            gender={gender}
            onSelectGender={setGender}
            onStart={handleStartTest}
            onOpenDirectory={() => setIsDirOpen(true)}
          />
        )}

        {step === 'quiz' && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            index={currentQuestionIndex}
            total={QUESTIONS.length}
            value={currentValue}
            onChange={handleAnswerChange}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === QUESTIONS.length - 1}
          />
        )}

        {step === 'results' && testResult && (
          <ResultsView
            result={testResult}
            onReset={handleReset}
            onOpenDirectory={() => setIsDirOpen(true)}
            onOpenQR={() => setIsQROpen(true)}
            onOpenStoryModal={() => setIsStoryOpen(true)}
          />
        )}
      </main>

      {/* Footer with Discreet Creator Lock */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          <div className="flex flex-wrap justify-center items-center gap-3 mb-2 font-medium">
            <span>Semana de la Salud</span>
            <span aria-hidden="true">·</span>
            <span>Equipo de Mediación y Convivencia Escolar</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Sobre el proyecto
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsDirOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Personajes (56)
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Iniciativa educativa orientada a la convivencia, la empatía y la resolución asertiva de conflictos.
          </p>

          {/* Discreet Creator Access Link */}
          <div className="mt-4 pt-2 border-t border-slate-100 flex justify-center">
            <button
              type="button"
              onClick={() => setIsStatsOpen(true)}
              className="text-[10px] text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer opacity-40 hover:opacity-100"
              title="Panel protegido para la creadora"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Acceso Creadora</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CharacterDirectoryModal
        isOpen={isDirOpen}
        onClose={() => setIsDirOpen(false)}
      />

      <QRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onStartTest={handleStartTest}
      />

      {testResult && (
        <StoryCardModal
          isOpen={isStoryOpen}
          onClose={() => setIsStoryOpen(false)}
          result={testResult}
        />
      )}

      {/* Protected Creator Stats Modal */}
      <StatsDashboardModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </div>
  );
}
