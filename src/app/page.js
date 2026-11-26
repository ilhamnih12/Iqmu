'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BackgroundMesh from '@/components/BackgroundMesh';
import Navbar from '@/components/Navbar';
import Landing from '@/components/Landing';
import TestArena from '@/components/TestArena';
import ResultsDashboard from '@/components/ResultsDashboard';
import { UIProvider } from '@/hooks/useSoundEffects';
import { pickLocalQuestions, normalizeQuestion } from '@/data/questionBank';
import { computeResults } from '@/lib/scoring';

/**
 * ============================================================
 *  APP STATE MACHINE
 *  landing (survey) → test (arena) → results (dashboard)
 *
 *  Question loading: POST /api/generate-questions (Gemini hybrid)
 *  → on ANY failure, the local 36-question bank is used directly.
 *  The test NEVER fails to start.
 * ============================================================
 */
function App() {
  const [phase, setPhase] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);

  const startTest = useCallback(async (config) => {
    setLoading(true);
    setSurvey(config);

    let loaded = [];

    // 1) Try the hybrid API route (Gemini + local bank server-side).
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: config.mode.count,
          ageBracket: config.ageBracket,
          background: config.background,
          focusArea: config.focusArea,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        loaded = data.questions
          .map((q, i) => normalizeQuestion(q, i, 'ai'))
          .filter(Boolean);
      }
    } catch (err) {
      console.warn('[startTest] API unreachable, using local bank:', err);
    }

    // 2) Direct local fallback (offline / total API failure).
    if (loaded.length < config.mode.count) {
      const local = pickLocalQuestions({
        count: config.mode.count,
        focusArea: config.focusArea,
      });
      const seen = new Set(loaded.map((q) => q.id));
      for (const q of local) {
        if (loaded.length >= config.mode.count) break;
        if (seen.has(q.id)) continue;
        seen.add(q.id);
        loaded.push(q);
      }
    }

    // 3) Absolute safety: never run with zero questions.
    if (loaded.length === 0) {
      loaded = pickLocalQuestions({ count: config.mode.count, focusArea: config.focusArea });
    }

    setQuestions(loaded.slice(0, config.mode.count));
    setPhase('test');
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, []);

  const finishTest = useCallback(
    ({ answers, timeUsedMs, auto }) => {
      const totalAllowedMs = (survey?.mode?.minutes || 15) * 60 * 1000;
      const computed = computeResults(questions, answers, {
        timeUsedMs,
        totalAllowedMs,
        ageBracket: survey?.ageBracket || '18-24',
      });
      computed.autoSubmitted = !!auto;
      setResults(computed);
      setPhase('results');
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    },
    [questions, survey]
  );

  const restart = useCallback(() => {
    setPhase('landing');
    setQuestions([]);
    setResults(null);
    setSurvey(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <UIProvider>
      <BackgroundMesh />
      <Navbar phase={phase} />

      <main className="relative min-h-screen">
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Landing onStart={startTest} loading={loading} />
            </motion.div>
          )}

          {phase === 'test' && questions.length > 0 && (
            <motion.div
              key="test"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <TestArena questions={questions} config={survey} onFinish={finishTest} />
            </motion.div>
          )}

          {phase === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <ResultsDashboard
                survey={survey}
                results={results}
                questions={questions}
                onRestart={restart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </UIProvider>
  );
}

export default function Page() {
  return <App />;
}
