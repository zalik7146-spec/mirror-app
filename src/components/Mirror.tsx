import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Session { id: string; date: string; answers: { q: string; a: string }[]; }

const QUESTIONS = [
  'Что ты сейчас избегаешь признать себе?',
  'Чего ты по-настоящему боишься?',
  'Что бы ты сделал, если бы знал что не провалишься?',
  'Когда ты последний раз был полностью честен с собой?',
  'Что тебе нужно отпустить чтобы двигаться вперёд?',
  'Кем ты хочешь стать? Что тебе мешает?',
  'Что ты чувствуешь прямо сейчас — под словами?',
  'Какую историю ты рассказываешь себе о своей жизни?',
  'Что бы ты сказал себе 10-летнему?',
  'Что делает тебя живым?',
  'От чего ты устал притворяться?',
  'Что важное ты откладываешь?',
  'Кого ты ещё не простил — включая себя?',
  'Что ты хочешь чтобы люди знали о тебе?',
  'Что бы ты сделал с последним годом жизни?',
  'Чего тебе не хватает для счастья прямо сейчас?',
  'Какая часть тебя просит внимания?',
  'Что ты сделал сегодня для себя — не для других?',
  'Что бы изменилось если бы ты полюбил себя?',
  'Какой вопрос ты боишься себе задать?',
];

function getRandomQuestions(n: number) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function Mirror() {
  const { isDark } = useTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([]);
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);
  const [viewSession, setViewSession] = useState<Session | null>(null);
  const [typing, setTyping] = useState(false);
  const [displayed, setDisplayed] = useState('');
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const inputBg = isDark ? '#3d2e1e' : '#fff';

  useEffect(() => {
    const saved = localStorage.getItem('mirror-sessions');
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (questions[step]) {
      setTyping(true);
      setDisplayed('');
      let i = 0;
      animRef.current = setInterval(() => {
        setDisplayed(questions[step].slice(0, i + 1));
        i++;
        if (i >= questions[step].length) {
          clearInterval(animRef.current!);
          setTyping(false);
        }
      }, 40);
    }
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [step, questions]);

  const start = () => {
    const qs = getRandomQuestions(7);
    setQuestions(qs);
    setAnswers([]);
    setCurrent('');
    setStep(0);
    setDone(false);
    setActive(true);
  };

  const next = () => {
    const updated = [...answers, { q: questions[step], a: current }];
    setAnswers(updated);
    setCurrent('');
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const save = () => {
    const session: Session = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      answers,
    };
    const updated = [session, ...sessions];
    setSessions(updated);
    localStorage.setItem('mirror-sessions', JSON.stringify(updated));
    setActive(false);
    setDone(false);
  };

  const Orb = () => (
    <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', inset: `${i * 15}px`, borderRadius: '50%',
          border: `1px solid ${isDark ? '#b8860b40' : '#b8860b30'}`,
          animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
        }} />
      ))}
      <div style={{
        position: 'absolute', inset: '40px', borderRadius: '50%',
        background: isDark ? 'radial-gradient(circle, #b8860b20, #3d2e1e)' : 'radial-gradient(circle, #b8860b15, #f5e6c8)',
        animation: 'pulse 3s ease-in-out infinite',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem',
      }}>🔮</div>
    </div>
  );

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔮</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: text }}>Сеанс завершён</h2>
          <p style={{ color: soft, fontStyle: 'italic' }}>Ты посмотрел в зеркало. Это смело.</p>
        </div>
        {answers.map((a, i) => (
          <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1rem', marginBottom: '0.75rem' }}>
            <p style={{ color: soft, fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>{a.q}</p>
            <p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', lineHeight: 1.6 }}>{a.a || '—'}</p>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button onClick={() => { setActive(false); setDone(false); }} style={{ flex: 1, padding: '0.9rem', background: 'none', border: `1px solid ${border}`, borderRadius: '12px', color: soft, cursor: 'pointer' }}>Не сохранять</button>
          <button onClick={save} style={{ flex: 2, padding: '0.9rem', background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem' }}>Сохранить сеанс ✓</button>
        </div>
      </div>
    );
  }

  if (active) {
    return (
      <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ color: soft, fontSize: '0.85rem' }}>Вопрос {step + 1} из {questions.length}</p>
          <div style={{ height: '4px', background: border, borderRadius: '2px', overflow: 'hidden', margin: '0.5rem 0' }}>
            <div style={{ height: '100%', width: `${((step + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #b8860b, #d4a017)', transition: 'width 0.4s ease', borderRadius: '2px' }} />
          </div>
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '20px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: text, lineHeight: 1.6, fontStyle: 'italic' }}>
            {displayed}{typing ? '|' : ''}
          </p>
        </div>

        <textarea value={current} onChange={e => setCurrent(e.target.value)} placeholder="Отвечай честно. Никто не читает."
          style={{ width: '100%', minHeight: '150px', background: inputBg, border: `1px solid ${border}`, borderRadius: '16px', padding: '1rem', outline: 'none', color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box', marginBottom: '1rem' }} />

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { setAnswers([...answers, { q: questions[step], a: '' }]); if (step < questions.length - 1) { setStep(step + 1); setCurrent(''); } else setDone(true); }} style={{ flex: 1, padding: '0.9rem', background: 'none', border: `1px solid ${border}`, borderRadius: '12px', color: soft, cursor: 'pointer', fontSize: '0.85rem' }}>Пропустить</button>
          <button onClick={next} disabled={!current.trim()} style={{ flex: 2, padding: '0.9rem', background: current.trim() ? 'linear-gradient(135deg, #b8860b, #d4a017)' : '#ccc', color: '#fff', border: 'none', borderRadius: '12px', cursor: current.trim() ? 'pointer' : 'not-allowed', fontSize: '1rem' }}>
            {step < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить сеанс ✓'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: '0 0 0.5rem' }}>Внутреннее Зеркало</h1>
        <p style={{ color: soft, fontSize: '0.85rem', fontStyle: 'italic' }}>«Если долго смотреть в бездну — бездна начнёт смотреть в тебя»</p>
        <p style={{ color: soft, fontSize: '0.75rem' }}>— Ницше</p>
      </div>

      <Orb />

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <p style={{ color: soft, fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          7 честных вопросов. Никто не читает. Только ты и зеркало.
        </p>
        <button onClick={start} style={{ background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '14px', padding: '1rem 2.5rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Raleway, sans-serif' }}>
          Начать сеанс 🔮
        </button>
      </div>

      {sessions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <p style={{ color: soft, fontSize: '0.8rem', marginBottom: '1rem', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>Прошлые сеансы</p>
          {sessions.map(s => (
            <div key={s.id} onClick={() => setViewSession(s)} style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '1rem', marginBottom: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: text, fontSize: '0.9rem' }}>🔮 Сеанс</span>
                <span style={{ color: soft, fontSize: '0.8rem' }}>{s.date}</span>
              </div>
              <p style={{ color: soft, fontSize: '0.82rem', marginTop: '0.4rem' }}>{s.answers.length} вопросов</p>
            </div>
          ))}
        </div>
      )}

      {viewSession && (
        <div onClick={() => setViewSession(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: soft, fontSize: '0.85rem' }}>{viewSession.date}</span>
              <button onClick={() => setViewSession(null)} style={{ background: 'none', border: 'none', color: soft, fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            {viewSession.answers.map((a, i) => (
              <div key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${border}` }}>
                <p style={{ color: soft, fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '0.4rem' }}>{a.q}</p>
                <p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', lineHeight: 1.6 }}>{a.a || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
