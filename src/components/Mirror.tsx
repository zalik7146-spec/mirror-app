import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const QUESTIONS = [
  "Что происходит внутри тебя прямо сейчас?",
  "Чего ты избегаешь в последнее время?",
  "Что ты боишься признать себе?",
  "Какую эмоцию ты чаще всего подавляешь?",
  "Если бы твой страх мог говорить — что бы он сказал?",
  "Что ты несёшь в себе уже слишком долго?",
  "Кем ты притворяешься перед другими?",
  "Что тебя останавливает от того, чтобы быть собой?",
  "Какую правду ты знаешь, но не хочешь признавать?",
  "Что бы ты сказал себе, если бы не боялся?",
  "Где в твоей жизни ты не честен с собой?",
  "Что тебя по-настоящему пугает?",
  "Какую боль ты носишь молча?",
  "Что в тебе хочет быть услышанным?",
  "Если бы этот момент был последним — о чём бы ты пожалел?",
  "Что даёт тебе силы, когда всё рушится?",
  "За что ты себя не можешь простить?",
  "Что ты ищешь, но не можешь найти?",
  "Какой версией себя ты хочешь стать?",
  "Что для тебя значит быть живым?",
];

function getSessionQuestions() {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7);
}

interface Session {
  id: string;
  date: string;
  questions: string[];
  answers: string[];
}

// Animated orbs
function LivingMirror() {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 280;
    canvas.height = 280;

    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: 140 + Math.cos((i / 6) * Math.PI * 2) * 60,
      y: 140 + Math.sin((i / 6) * Math.PI * 2) * 60,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 18 + Math.random() * 20,
      hue: 30 + i * 25,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, 280, 280);

      frame += 0.012;

      // Background circle
      const bg = ctx.createRadialGradient(140, 140, 0, 140, 140, 130);
      bg.addColorStop(0, isDark ? 'rgba(60,45,30,0.6)' : 'rgba(255,248,235,0.8)');
      bg.addColorStop(1, isDark ? 'rgba(30,20,10,0.2)' : 'rgba(245,235,215,0.3)');
      ctx.beginPath();
      ctx.arc(140, 140, 128, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // Breathing rings
      for (let r = 0; r < 3; r++) {
        const pulse = Math.sin(frame + r * 1.2) * 10;
        ctx.beginPath();
        ctx.arc(140, 140, 40 + r * 28 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(210,170,100,${0.08 - r * 0.02})`
          : `rgba(180,130,60,${0.1 - r * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Move and draw orbs
      orbs.forEach((orb, i) => {
        orb.phase += 0.015;
        orb.x += orb.vx + Math.sin(frame + orb.phase) * 0.4;
        orb.y += orb.vy + Math.cos(frame + orb.phase * 0.7) * 0.4;

        const dx = orb.x - 140;
        const dy = orb.y - 140;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 90) {
          orb.vx -= dx * 0.003;
          orb.vy -= dy * 0.003;
        }
        orb.vx *= 0.99;
        orb.vy *= 0.99;

        // Draw connections
        orbs.forEach((other, j) => {
          if (j <= i) return;
          const ddx = orb.x - other.x;
          const ddy = orb.y - other.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(orb.x, orb.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = isDark
              ? `rgba(210,170,100,${0.15 * (1 - d / 100)})`
              : `rgba(160,110,40,${0.2 * (1 - d / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });

        // Draw orb
        const gradient = ctx.createRadialGradient(
          orb.x - orb.radius * 0.3, orb.y - orb.radius * 0.3, 0,
          orb.x, orb.y, orb.radius
        );
        const alpha = 0.5 + Math.sin(frame + orb.phase) * 0.2;
        gradient.addColorStop(0, `hsla(${orb.hue}, 60%, ${isDark ? 75 : 65}%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${orb.hue}, 40%, ${isDark ? 45 : 40}%, 0)`);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Center glow
      const centerGlow = ctx.createRadialGradient(140, 140, 0, 140, 140, 30);
      centerGlow.addColorStop(0, isDark ? 'rgba(220,180,100,0.4)' : 'rgba(200,155,60,0.35)');
      centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(140, 140, 30, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isDark]);

  return <canvas ref={canvasRef} width={280} height={280} style={{ borderRadius: '50%' }} />;
}

export default function Mirror() {
  const { isDark } = useTheme();
  const [phase, setPhase] = useState<'intro' | 'session' | 'finish'>('intro');
  const [questions, setQuestions] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [sessions, setSessions] = useState<Session[]>(() => {
    try { return JSON.parse(localStorage.getItem('mirror-sessions') || '[]'); } catch { return []; }
  });
  const [openSession, setOpenSession] = useState<Session | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bg = isDark ? '#1a1208' : '#fdf8f0';
  const card = isDark ? 'rgba(60,40,20,0.7)' : 'rgba(255,250,238,0.9)';
  const text = isDark ? '#e8d5b0' : '#3d2b1f';
  const muted = isDark ? '#a08060' : '#8b6f47';
  const accent = isDark ? '#c8a96e' : '#9a6f3a';
  const border = isDark ? 'rgba(200,169,110,0.2)' : 'rgba(180,140,80,0.2)';

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'session') return;
    const q = questions[current] || '';
    setDisplayedQuestion('');
    let i = 0;
    const timer = setInterval(() => {
      if (i <= q.length) {
        setDisplayedQuestion(q.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [current, phase, questions]);

  function startSession() {
    const q = getSessionQuestions();
    setQuestions(q);
    setAnswers([]);
    setCurrentAnswer('');
    setCurrent(0);
    setPhase('session');
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function nextQuestion() {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers, currentAnswer.trim()];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (current + 1 >= questions.length) {
      setPhase('finish');
    } else {
      setCurrent(current + 1);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }

  function saveSession() {
    const session: Session = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      questions,
      answers,
    };
    const updated = [session, ...sessions];
    setSessions(updated);
    localStorage.setItem('mirror-sessions', JSON.stringify(updated));
    setPhase('intro');
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingBottom: '100px', fontFamily: "'Raleway', sans-serif" }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '2rem 1.5rem 1rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: text, fontWeight: 600, margin: 0 }}>
          Внутреннее зеркало
        </h1>
        <p style={{ color: muted, fontSize: '0.85rem', marginTop: '0.4rem', fontStyle: 'italic' }}>
          «Если долго смотреть в бездну — бездна начнёт смотреть в тебя»
        </p>
        <p style={{ color: muted, fontSize: '0.75rem', marginTop: '0.2rem' }}>— Фридрих Ницше</p>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 1.5rem' }}>

          {/* Living animation */}
          <div style={{
            width: 280, height: 280,
            borderRadius: '50%',
            border: `2px solid ${border}`,
            boxShadow: isDark
              ? '0 0 60px rgba(200,160,80,0.2), inset 0 0 40px rgba(0,0,0,0.3)'
              : '0 0 60px rgba(180,130,60,0.15), inset 0 0 40px rgba(255,248,235,0.5)',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}>
            <LivingMirror />
          </div>

          <p style={{ color: muted, fontSize: '0.9rem', textAlign: 'center', maxWidth: 300, lineHeight: 1.7, marginBottom: '2rem' }}>
            Сеанс из 7 вопросов. Честных. Неудобных. Твоих.<br />
            Здесь нет правильных ответов — только правдивые.
          </p>

          <button onClick={startSession} style={{
            background: `linear-gradient(135deg, ${accent}, ${isDark ? '#8a5a2a' : '#7a5a2a'})`,
            color: '#fff', border: 'none', borderRadius: 50,
            padding: '0.9rem 2.5rem', fontSize: '1rem',
            fontFamily: "'Raleway', sans-serif", cursor: 'pointer',
            boxShadow: `0 4px 20px ${isDark ? 'rgba(200,160,80,0.3)' : 'rgba(150,100,40,0.3)'}`,
            letterSpacing: '0.05em',
          }}>
            Начать сеанс
          </button>

          {/* Пустое состояние */}
          {sessions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem', marginTop: '1rem' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', color: muted, fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.8' }}>
                Твои сеансы будут храниться здесь.<br />Каждый — как страница твоей книги.
              </p>
            </div>
          )}

          {/* Past sessions */}
          {sessions.length > 0 && (
            <div style={{ width: '100%', maxWidth: 480, marginTop: '2.5rem' }}>
              <p style={{ color: muted, fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                ПРОШЛЫЕ СЕАНСЫ
              </p>
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} onClick={() => setOpenSession(s)} style={{
                  background: card, borderRadius: 12, padding: '0.9rem 1.2rem',
                  marginBottom: '0.6rem', cursor: 'pointer',
                  border: `1px solid ${border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: text, fontSize: '0.85rem' }}>{s.date}</span>
                  <span style={{ color: muted, fontSize: '0.8rem' }}>{s.questions.length} вопросов →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SESSION */}
      {phase === 'session' && (
        <div style={{ padding: '1rem 1.5rem', maxWidth: 480, margin: '0 auto' }}>

          {/* Progress */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: muted, fontSize: '0.8rem' }}>Вопрос {current + 1} из {questions.length}</span>
              <span style={{ color: muted, fontSize: '0.8rem' }}>{Math.round(((current) / questions.length) * 100)}%</span>
            </div>
            <div style={{ height: 3, background: border, borderRadius: 2 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: `linear-gradient(90deg, ${accent}, ${isDark ? '#e8c070' : '#c8903a'})`,
                width: `${((current) / questions.length) * 100}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{
            background: card, borderRadius: 16, padding: '1.8rem',
            border: `1px solid ${border}`, marginBottom: '1.2rem',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(180,130,60,0.1)',
            minHeight: 80, display: 'flex', alignItems: 'center',
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem', color: text,
              lineHeight: 1.5, margin: 0, fontWeight: 500,
            }}>
              {displayedQuestion}
              <span style={{ opacity: 0.5, animation: 'pulse 1s infinite' }}>|</span>
            </p>
          </div>

          {/* Answer */}
          <textarea
            ref={textareaRef}
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder="Пиши честно. Здесь только ты..."
            rows={5}
            style={{
              width: '100%', background: card, border: `1px solid ${border}`,
              borderRadius: 12, padding: '1rem', color: text,
              fontFamily: "'Raleway', sans-serif", fontSize: '0.95rem',
              resize: 'none', outline: 'none', lineHeight: 1.7,
              boxSizing: 'border-box',
            }}
          />

          <button
            onClick={nextQuestion}
            disabled={!currentAnswer.trim()}
            style={{
              width: '100%', marginTop: '1rem',
              background: currentAnswer.trim()
                ? `linear-gradient(135deg, ${accent}, ${isDark ? '#8a5a2a' : '#7a5a2a'})`
                : (isDark ? 'rgba(60,40,20,0.5)' : 'rgba(200,180,150,0.4)'),
              color: currentAnswer.trim() ? '#fff' : muted,
              border: 'none', borderRadius: 50,
              padding: '0.9rem', fontSize: '1rem',
              fontFamily: "'Raleway', sans-serif",
              cursor: currentAnswer.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
            }}
          >
            {current + 1 === questions.length ? 'Завершить сеанс ✓' : 'Следующий вопрос →'}
          </button>
        </div>
      )}

      {/* FINISH */}
      {phase === 'finish' && (
        <div style={{ padding: '1rem 1.5rem', maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            background: card, borderRadius: 16, padding: '1.5rem',
            border: `1px solid ${border}`, marginBottom: '1.5rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🪞</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: text, margin: 0 }}>
              Ты посмотрел в себя.
            </p>
            <p style={{ color: muted, fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Это требует смелости.
            </p>
          </div>

          {questions.map((q, i) => (
            <div key={i} style={{
              background: card, borderRadius: 12, padding: '1.2rem',
              border: `1px solid ${border}`, marginBottom: '0.8rem',
            }}>
              <p style={{ color: muted, fontSize: '0.8rem', margin: '0 0 0.5rem', fontStyle: 'italic' }}>{q}</p>
              <p style={{ color: text, fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{answers[i]}</p>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            <button onClick={() => setPhase('intro')} style={{
              flex: 1, background: 'transparent',
              border: `1px solid ${border}`, borderRadius: 50,
              padding: '0.8rem', color: muted,
              fontFamily: "'Raleway', sans-serif", cursor: 'pointer',
            }}>
              Не сохранять
            </button>
            <button onClick={saveSession} style={{
              flex: 2,
              background: `linear-gradient(135deg, ${accent}, ${isDark ? '#8a5a2a' : '#7a5a2a'})`,
              border: 'none', borderRadius: 50,
              padding: '0.8rem', color: '#fff',
              fontFamily: "'Raleway', sans-serif", cursor: 'pointer',
              fontSize: '0.95rem',
            }}>
              Сохранить сеанс
            </button>
          </div>
        </div>
      )}

      {/* Past session modal */}
      {openSession && (
        <div onClick={() => setOpenSession(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: isDark ? '#2a1a0a' : '#fffbf2',
            borderRadius: 20, padding: '1.5rem',
            maxWidth: 480, width: '100%', maxHeight: '80vh',
            overflowY: 'auto', border: `1px solid ${border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ color: muted, fontSize: '0.85rem', margin: 0 }}>{openSession.date}</p>
              <button onClick={() => setOpenSession(null)} style={{
                background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: '1.2rem',
              }}>×</button>
            </div>
            {openSession.questions.map((q, i) => (
              <div key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
                <p style={{ color: muted, fontSize: '0.8rem', margin: '0 0 0.4rem', fontStyle: 'italic' }}>{q}</p>
                <p style={{ color: text, fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{openSession.answers[i]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
