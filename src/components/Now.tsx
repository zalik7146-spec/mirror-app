import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

type Practice = 'breathing' | 'grounding' | 'body' | 'sleep';

interface PracticeCard {
  id: Practice;
  icon: string;
  title: string;
  description: string;
}

const practices: PracticeCard[] = [
  { id: 'breathing', icon: '🌬️', title: 'Дыхание 4-7-8', description: 'Успокаивает нервную систему за несколько минут' },
  { id: 'grounding', icon: '🌿', title: 'Заземление 5-4-3-2-1', description: 'Возвращает в настоящий момент через ощущения' },
  { id: 'body', icon: '🫀', title: 'Сканирование тела', description: 'Мягкое путешествие по себе с вниманием и добротой' },
  { id: 'sleep', icon: '🌙', title: 'Дыхание перед сном', description: 'Мягкий ритуал для перехода в сон — медленно и бережно' },
];

// ——— Дыхание ———
function BreathingExercise({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? '#e8dcc8' : '#2c2416';
  const subColor = isDark ? '#b8a882' : '#5c4f3a';
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const runCycle = (c: number) => {
    if (c >= 4) { setPhase('idle'); setCycle(0); return; }
    setPhase('inhale'); setCount(4);
    const tick = (n: number, next: () => void) => {
      if (n <= 0) { next(); return; }
      setCount(n);
      timerRef.current = setTimeout(() => tick(n - 1, next), 1000);
    };
    tick(4, () => {
      setPhase('hold'); setCount(7);
      tick(7, () => {
        setPhase('exhale'); setCount(8);
        tick(8, () => runCycle(c + 1));
      });
    });
    setCycle(c + 1);
  };

  useEffect(() => () => clear(), []);

  const phaseLabel = phase === 'inhale' ? 'Вдох' : phase === 'hold' ? 'Задержка' : phase === 'exhale' ? 'Выдох' : '';
  const phaseColor = phase === 'inhale' ? '#4a7c6f' : phase === 'hold' ? '#c8922a' : phase === 'exhale' ? '#4a5c8b' : (isDark ? '#b8a882' : '#5c4f3a');
  const scale = phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : phase === 'exhale' ? 1 : 1;

  return (
    <div className="text-center py-8">
      <div className="relative flex items-center justify-center mb-8" style={{ height: '200px' }}>
        <div style={{
          width: '160px', height: '160px', borderRadius: '50%',
          border: `2px solid ${phaseColor}`, opacity: 0.2, position: 'absolute',
          transform: `scale(${scale * 1.1})`,
          transition: `transform ${phase === 'inhale' ? 4 : phase === 'hold' ? 0.2 : 8}s ease-in-out`,
        }} />
        <div style={{
          width: '140px', height: '140px', borderRadius: '50%',
          background: `radial-gradient(circle, ${phaseColor}22, ${phaseColor}44)`,
          border: `1.5px solid ${phaseColor}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${scale})`,
          transition: `transform ${phase === 'inhale' ? 4 : phase === 'hold' ? 0.2 : 8}s ease-in-out`,
          boxShadow: `0 0 40px ${phaseColor}33`,
        }}>
          {phase !== 'idle' ? (
            <>
              <span style={{ fontSize: '2rem', fontFamily: 'Cormorant Garamond', color: phaseColor, fontWeight: 300 }}>{count}</span>
              <span style={{ fontSize: '0.7rem', color: phaseColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>{phaseLabel}</span>
            </>
          ) : (
            <span style={{ fontSize: '1.5rem' }}>🌬️</span>
          )}
        </div>
      </div>

      {cycle > 0 && phase !== 'idle' && (
        <p style={{ color: '#8b6914', fontSize: '0.8rem', marginBottom: '16px' }}>Цикл {cycle} из 4</p>
      )}

      {phase === 'idle' ? (
        <button onClick={() => runCycle(0)} style={{
          background: 'linear-gradient(135deg, #4a7c6f, #2d4a3e)', color: '#faf7f2',
          border: 'none', borderRadius: '6px', padding: '12px 32px',
          fontFamily: 'Raleway, sans-serif', fontSize: '0.85rem', letterSpacing: '0.08em',
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(74, 124, 111, 0.3)',
        }}>
          Начать практику
        </button>
      ) : (
        <button onClick={() => { clear(); setPhase('idle'); setCycle(0); }} style={{
          background: 'transparent',
          border: `1px solid ${isDark ? 'rgba(184, 168, 130, 0.3)' : 'rgba(92, 79, 58, 0.3)'}`,
          borderRadius: '6px', padding: '10px 24px',
          fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem',
          color: subColor, cursor: 'pointer',
        }}>
          Остановить
        </button>
      )}

      {phase === 'idle' && cycle === 0 && (
        <p style={{ color: isDark ? 'rgba(184, 168, 130, 0.5)' : 'rgba(92, 79, 58, 0.4)', fontSize: '0.78rem', marginTop: '16px', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
          Вдох 4 · Задержка 7 · Выдох 8 · Четыре цикла
        </p>
      )}
      {phase === 'idle' && cycle > 0 && (
        <p style={{ color: '#4a7c6f', fontSize: '0.88rem', marginTop: '16px', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
          ✓ Практика завершена. Ты молодец.
        </p>
      )}
      {/* suppress unused warning */}
      <span style={{ display: 'none' }}>{textColor}</span>
    </div>
  );
}

// ——— Заземление ———
const groundingSteps = [
  { n: 5, sense: '👁️', hint: 'Назови 5 вещей, которые ты видишь прямо сейчас' },
  { n: 4, sense: '✋', hint: 'Назови 4 вещи, которые ты можешь потрогать или чувствуешь на коже' },
  { n: 3, sense: '👂', hint: 'Назови 3 звука, которые ты слышишь в этот момент' },
  { n: 2, sense: '👃', hint: 'Назови 2 запаха, которые ты замечаешь или можешь почувствовать' },
  { n: 1, sense: '👅', hint: 'Назови 1 вкус, который ты замечаешь' },
];

function GroundingExercise({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? '#e8dcc8' : '#2c2416';
  const subColor = isDark ? '#b8a882' : '#5c4f3a';
  const [step, setStep] = useState(-1);
  const current = groundingSteps[step];

  return (
    <div className="py-6">
      {step === -1 && (
        <div className="text-center">
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '24px' }}>
            Эта практика поможет тебе вернуться<br />в настоящий момент через пять чувств.<br />
            <span className="italic">Делай всё медленно.</span>
          </p>
          <button onClick={() => setStep(0)} style={{
            background: 'linear-gradient(135deg, #4a7c6f, #2d4a3e)',
            color: '#faf7f2', border: 'none', borderRadius: '6px',
            padding: '12px 32px', fontFamily: 'Raleway, sans-serif',
            fontSize: '0.85rem', letterSpacing: '0.08em', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(74, 124, 111, 0.3)',
          }}>
            Начать
          </button>
        </div>
      )}

      {step >= 0 && step < groundingSteps.length && (
        <div className="text-center animate-fadeInUp" style={{ animationFillMode: 'forwards' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{current.sense}</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#c8922a', lineHeight: 1, marginBottom: '8px' }}>
            {current.n}
          </div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '1.15rem', marginBottom: '8px' }}>
            {current.hint}
          </p>
          <p style={{ color: '#8b6914', fontSize: '0.8rem', marginBottom: '28px', fontStyle: 'italic' }}>
            Шаг {step + 1} из 5
          </p>
          <div className="flex justify-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                background: 'transparent',
                border: `1px solid ${isDark ? 'rgba(200, 146, 42, 0.3)' : 'rgba(200, 146, 42, 0.3)'}`,
                borderRadius: '6px', padding: '10px 20px',
                fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem',
                color: subColor, cursor: 'pointer',
              }}>
                Назад
              </button>
            )}
            <button onClick={() => setStep(s => s + 1)} style={{
              background: 'linear-gradient(135deg, #c8922a, #8b6914)',
              color: '#faf7f2', border: 'none', borderRadius: '6px',
              padding: '10px 28px', fontFamily: 'Raleway, sans-serif',
              fontSize: '0.85rem', letterSpacing: '0.08em', cursor: 'pointer',
            }}>
              Готово →
            </button>
          </div>
        </div>
      )}

      {step >= groundingSteps.length && (
        <div className="text-center animate-fadeInUp" style={{ animationFillMode: 'forwards' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌿</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.3rem', marginBottom: '8px' }}>
            Ты здесь. Ты в настоящем.
          </p>
          <p style={{ color: subColor, fontSize: '0.9rem', marginBottom: '24px', fontStyle: 'italic' }}>
            Обрати внимание, как изменилось твоё дыхание.
          </p>
          <button onClick={() => setStep(-1)} style={{
            background: 'transparent',
            border: `1px solid ${isDark ? 'rgba(74, 124, 111, 0.5)' : 'rgba(74, 124, 111, 0.4)'}`,
            borderRadius: '6px', padding: '10px 24px',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem',
            color: '#4a7c6f', cursor: 'pointer',
          }}>
            Повторить
          </button>
        </div>
      )}
    </div>
  );
}

// ——— Сканирование тела ———
const bodyParts = [
  { name: 'Голова и лицо', prompt: 'Замечай любое напряжение в лице. Расслабь лоб, челюсть, глаза. Просто наблюдай.' },
  { name: 'Шея и плечи', prompt: 'Часто мы носим здесь весь груз дня. Позволь плечам чуть опуститься. Без усилий.' },
  { name: 'Грудь и дыхание', prompt: 'Почувствуй, как грудь поднимается и опускается. Не контролируй — просто наблюдай.' },
  { name: 'Живот', prompt: 'Живот — наш второй мозг. Что ты замечаешь здесь? Сжатость? Тепло? Просто будь с этим.' },
  { name: 'Руки и кисти', prompt: 'Перенеси внимание на ладони. Чувствуй их тепло, пульс. Они делают так много для тебя.' },
  { name: 'Ноги и ступни', prompt: 'Ощути землю под ногами. Ты укоренён. Ты в безопасности прямо сейчас.' },
];

function BodyScanExercise({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? '#e8dcc8' : '#2c2416';
  const subColor = isDark ? '#b8a882' : '#5c4f3a';
  const blockBg = isDark ? 'rgba(74, 92, 139, 0.1)' : 'rgba(74, 92, 139, 0.06)';
  const blockBorder = isDark ? 'rgba(74, 92, 139, 0.25)' : 'rgba(74, 92, 139, 0.15)';
  const [step, setStep] = useState(-1);

  return (
    <div className="py-6">
      {step === -1 && (
        <div className="text-center">
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '24px' }}>
            Найди удобное положение.<br />
            Закрой глаза на мгновение, сделай глубокий вдох.<br />
            <span className="italic">Мы пойдём по телу медленно, с добротой.</span>
          </p>
          <button onClick={() => setStep(0)} style={{
            background: 'linear-gradient(135deg, #4a5c8b, #2d3a5e)',
            color: '#faf7f2', border: 'none', borderRadius: '6px',
            padding: '12px 32px', fontFamily: 'Raleway, sans-serif',
            fontSize: '0.85rem', letterSpacing: '0.08em', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(74, 92, 139, 0.3)',
          }}>
            Я готов
          </button>
        </div>
      )}

      {step >= 0 && step < bodyParts.length && (
        <div className="animate-fadeInUp" style={{ animationFillMode: 'forwards' }}>
          <div style={{
            background: blockBg, border: `1px solid ${blockBorder}`,
            borderRadius: '8px', padding: '28px', textAlign: 'center', marginBottom: '24px',
          }}>
            <p style={{ color: '#8b6914', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              {step + 1} / {bodyParts.length}
            </p>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.8rem', marginBottom: '16px' }}>
              {bodyParts[step].name}
            </h3>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
              {bodyParts[step].prompt}
            </p>
          </div>
          <div className="flex justify-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                background: 'transparent',
                border: `1px solid ${isDark ? 'rgba(184, 168, 130, 0.3)' : 'rgba(92, 79, 58, 0.3)'}`,
                borderRadius: '6px', padding: '10px 20px',
                fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem',
                color: subColor, cursor: 'pointer',
              }}>
                Назад
              </button>
            )}
            <button onClick={() => setStep(s => s + 1)} style={{
              background: 'linear-gradient(135deg, #4a5c8b, #2d3a5e)',
              color: '#faf7f2', border: 'none', borderRadius: '6px',
              padding: '10px 28px', fontFamily: 'Raleway, sans-serif',
              fontSize: '0.85rem', letterSpacing: '0.08em', cursor: 'pointer',
            }}>
              Далее →
            </button>
          </div>
        </div>
      )}

      {step >= bodyParts.length && (
        <div className="text-center animate-fadeInUp" style={{ animationFillMode: 'forwards' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🫀</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.3rem', marginBottom: '8px' }}>
            Спасибо, что был с собой.
          </p>
          <p style={{ color: subColor, fontSize: '0.9rem', marginBottom: '24px', fontStyle: 'italic' }}>
            Это и есть забота о себе — просто замечать.
          </p>
          <button onClick={() => setStep(-1)} style={{
            background: 'transparent',
            border: `1px solid ${isDark ? 'rgba(74, 92, 139, 0.5)' : 'rgba(74, 92, 139, 0.4)'}`,
            borderRadius: '6px', padding: '10px 24px',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem',
            color: '#4a5c8b', cursor: 'pointer',
          }}>
            Пройти снова
          </button>
        </div>
      )}
    </div>
  );
}

// ——— Дыхание перед сном ———
function SleepBreathingExercise() {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'exhale' | 'done'>('idle');
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const totalCycles = 6;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const runCycle = (c: number) => {
    if (c >= totalCycles) { setPhase('done'); return; }
    setPhase('inhale'); setCount(4);
    const tick = (n: number, next: () => void) => {
      if (n <= 0) { next(); return; }
      setCount(n);
      timerRef.current = setTimeout(() => tick(n - 1, next), 1000);
    };
    tick(4, () => {
      setPhase('exhale'); setCount(6);
      tick(6, () => runCycle(c + 1));
    });
    setCycle(c + 1);
  };

  useEffect(() => () => clear(), []);
  const starColor = '#a8b4d4';

  return (
    <div className="text-center py-8 rounded-xl" style={{
      background: 'rgba(18, 22, 40, 0.95)', minHeight: '340px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {phase === 'idle' && (
        <>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌙</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: starColor, fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '8px' }}>
            Время отпустить день.
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(168, 180, 212, 0.6)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '32px' }}>
            Вдох 4 секунды — выдох 6. Шесть кругов.<br />Просто дыши и отпускай.
          </p>
          <button onClick={() => runCycle(0)} style={{
            background: 'rgba(74, 92, 139, 0.3)',
            border: '1px solid rgba(168, 180, 212, 0.25)',
            color: starColor, borderRadius: '6px', padding: '12px 36px',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.85rem',
            letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s ease',
          }}>
            Начать
          </button>
        </>
      )}

      {(phase === 'inhale' || phase === 'exhale') && (
        <>
          <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '16px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', width: '2px', height: '2px', borderRadius: '50%',
                background: starColor,
                top: `${20 + Math.sin(i * 0.8) * 70}px`,
                left: `${100 + Math.cos(i * 0.8) * 80}px`,
                opacity: phase === 'exhale' ? 0.8 : 0.3, transition: 'opacity 4s ease',
              }} />
            ))}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: `translate(-50%, -50%) scale(${phase === 'inhale' ? 1.2 : 0.85})`,
              transition: `transform ${phase === 'inhale' ? 4 : 6}s ease-in-out`,
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(74, 92, 139, 0.15), rgba(74, 92, 139, 0.05))',
              border: `1px solid rgba(168, 180, 212, ${phase === 'inhale' ? 0.4 : 0.15})`,
              boxShadow: `0 0 ${phase === 'inhale' ? 40 : 10}px rgba(74, 92, 139, 0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const,
            }}>
              <span style={{ fontSize: '1.8rem', fontFamily: 'Cormorant Garamond', color: starColor, fontWeight: 300 }}>{count}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(168, 180, 212, 0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '2px' }}>
                {phase === 'inhale' ? 'вдох' : 'выдох'}
              </span>
            </div>
          </div>
          <p style={{ color: 'rgba(168, 180, 212, 0.5)', fontSize: '0.75rem', marginBottom: '24px', letterSpacing: '0.08em' }}>
            {cycle} из {totalCycles}
          </p>
          <button onClick={() => { clear(); setPhase('idle'); setCycle(0); }} style={{
            background: 'transparent', border: '1px solid rgba(168, 180, 212, 0.15)',
            color: 'rgba(168, 180, 212, 0.4)', borderRadius: '6px', padding: '8px 20px',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.75rem', cursor: 'pointer',
          }}>
            Остановить
          </button>
        </>
      )}

      {phase === 'done' && (
        <>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>✨</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: starColor, fontSize: '1.3rem', marginBottom: '10px' }}>
            Спокойной ночи.
          </p>
          <p style={{ color: 'rgba(168, 180, 212, 0.55)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '28px' }}>
            Ты сделал всё, что мог сегодня.<br />Теперь можно просто отдыхать.
          </p>
          <button onClick={() => { setPhase('idle'); setCycle(0); }} style={{
            background: 'transparent', border: '1px solid rgba(168, 180, 212, 0.2)',
            color: 'rgba(168, 180, 212, 0.5)', borderRadius: '6px', padding: '10px 24px',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
          }}>
            Повторить
          </button>
        </>
      )}
    </div>
  );
}

// ——— Главный компонент ———
export default function Now() {
  const [active, setActive] = useState<Practice | null>(null);
  const { isDark } = useTheme();

  const textColor = isDark ? '#e8dcc8' : '#2c2416';
  const subColor = isDark ? '#b8a882' : '#5c4f3a';
  const cardBg = isDark ? 'rgba(30, 24, 18, 0.85)' : 'rgba(250, 247, 242, 0.9)';
  const cardBorder = 'rgba(200, 146, 42, 0.15)';

  return (
    <div className="min-h-screen library-bg pt-8 pb-28 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-12">
          <span className="text-4xl">🕯️</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor }} className="text-4xl font-light mt-3 mb-2">
            Сейчас
          </h2>
          <p style={{ color: '#8b6914', fontFamily: 'Cormorant Garamond, serif' }} className="text-lg italic">
            Что я чувствую?
          </p>
        </div>

        {!active && (
          <div className="flex flex-col gap-4">
            {practices.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className="text-left card-hover"
                style={{
                  animationDelay: `${0.2 + i * 0.15}s`, animationFillMode: 'forwards',
                  background: cardBg, border: `1px solid ${cardBorder}`,
                  borderRadius: '10px', padding: '24px', cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.3rem' }}>{p.title}</h3>
                    <p style={{ color: subColor, fontSize: '0.85rem', marginTop: '4px' }}>{p.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {active && (
          <div className="animate-fadeInUp" style={{
            animationFillMode: 'forwards',
            background: active === 'sleep' ? 'transparent' : cardBg,
            border: active === 'sleep' ? 'none' : `1px solid ${cardBorder}`,
            borderRadius: '10px',
            padding: active === 'sleep' ? '0' : '32px',
          }}>
            {active !== 'sleep' && (
              <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.5rem' }}>
                  {practices.find(p => p.id === active)?.icon} {practices.find(p => p.id === active)?.title}
                </h3>
                <button onClick={() => setActive(null)} style={{
                  color: isDark ? 'rgba(184, 168, 130, 0.5)' : 'rgba(92, 79, 58, 0.5)',
                  background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1,
                }}>×</button>
              </div>
            )}
            {active === 'sleep' && (
              <div className="flex justify-end mb-2">
                <button onClick={() => setActive(null)} style={{
                  color: 'rgba(168, 180, 212, 0.4)', background: 'none',
                  border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1,
                }}>×</button>
              </div>
            )}
            {active === 'breathing' && <BreathingExercise isDark={isDark} />}
            {active === 'grounding' && <GroundingExercise isDark={isDark} />}
            {active === 'body' && <BodyScanExercise isDark={isDark} />}
            {active === 'sleep' && <SleepBreathingExercise />}
          </div>
        )}
      </div>
    </div>
  );
}
