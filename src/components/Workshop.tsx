import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Practice { id: string; title: string; source: string; category: string; color: string; desc: string; steps: string[]; }

const PRACTICES: Practice[] = [
  { id: 'breathing', title: 'Дыхание 4-7-8', source: 'Эндрю Вейл', category: '🌊 Тревога', color: '#6366f1', desc: 'Активирует парасимпатическую нервную систему, снижает тревогу за 60 секунд.', steps: ['Выдохни полностью через рот', 'Вдохни через нос на 4 счёта', 'Задержи дыхание на 7 счётов', 'Выдохни через рот на 8 счётов', 'Повтори 4 раза'] },
  { id: 'grounding', title: 'Заземление 5-4-3-2-1', source: 'КПТ', category: '🌊 Тревога', color: '#6366f1', desc: 'Возвращает в настоящий момент через органы чувств. Эффективно при панике.', steps: ['Назови 5 вещей которые видишь', 'Назови 4 вещи которые слышишь', 'Назови 3 вещи которые можешь потрогать', 'Назови 2 запаха которые чувствуешь', 'Назови 1 вкус во рту'] },
  { id: 'compassion', title: 'Самосострадание', source: 'Кристин Нефф, Гарвард', category: '🌑 Грусть', color: '#3b82f6', desc: 'Снижает самокритику и депрессию. Научно доказана эффективность при хронической грусти.', steps: ['Признай: "Сейчас мне больно. Это реально."', 'Напомни себе: "Страдание — часть жизни. Я не один."', 'Скажи себе: "Пусть я буду добр к себе прямо сейчас."', 'Положи руку на сердце. Почувствуй тепло.', 'Побудь с этим ощущением минуту.'] },
  { id: 'body-scan', title: 'Сканирование тела', source: 'Джон Кабат-Зинн, MBSR', category: '🌿 Тело', color: '#10b981', desc: 'Снижает хронический стресс и боль. Основа программы снижения стресса на основе осознанности.', steps: ['Ляг или сядь удобно. Закрой глаза.', 'Направь внимание на стопы. Что ты чувствуешь?', 'Медленно двигайся вверх — голени, колени, бёдра', 'Живот, грудь, руки, плечи', 'Шея, лицо, макушка. Просто наблюдай.'] },
  { id: 'progressive', title: 'Прогрессивная релаксация', source: 'Эдмунд Джейкобсон', category: '🌿 Тело', color: '#10b981', desc: 'Снижает мышечное напряжение и тревогу. Один из старейших научно доказанных методов.', steps: ['Напряги стопы на 5 секунд — расслабь', 'Напряги икры — расслабь', 'Напряги бёдра и ягодицы — расслабь', 'Напряги живот — расслабь', 'Напряги плечи к ушам — расслабь', 'Почувствуй разницу между напряжением и покоем'] },
  { id: 'morning', title: 'Утренние страницы', source: 'Джулия Кэмерон', category: '☀️ Каждый день', color: '#f59e0b', desc: 'Три страницы потока сознания сразу после пробуждения. Очищает ум и открывает творчество.', steps: ['Возьми дневник сразу после пробуждения', 'Пиши три страницы от руки', 'Не думай — просто пиши что приходит', 'Не перечитывай, не редактируй', 'Это только для тебя. Никто не читает.'] },
  { id: 'sleep', title: 'Дыхание перед сном', source: 'Нейронаука сна', category: '☀️ Каждый день', color: '#f59e0b', desc: 'Вдох 4, выдох 6. Активирует парасимпатику и готовит тело ко сну.', steps: ['Ляг удобно. Закрой глаза.', 'Вдохни через нос на 4 счёта', 'Выдохни медленно на 6 счётов', 'Повторяй 6 циклов', 'Спокойной ночи. Ты сделал всё что мог.'] },
  { id: 'stop', title: 'Стоп-момент', source: 'ACT-терапия', category: '⚡ Быстро', color: '#8b5cf6', desc: '60 секунд полной тишины. Прерывает автопилот и возвращает осознанность.', steps: ['Остановись. Прямо сейчас.', 'Сделай три глубоких вдоха', 'Заметь: где ты? Что вокруг?', 'Что ты чувствуешь в теле прямо сейчас?', 'Продолжай день чуть осознаннее.'] },
  { id: 'five-senses', title: 'Пять чувств', source: 'ACT-терапия', category: '⚡ Быстро', color: '#8b5cf6', desc: 'Мгновенное заземление через все органы чувств. Эффективно при диссоциации.', steps: ['Что ты видишь? Назови 3 вещи.', 'Что ты слышишь прямо сейчас?', 'Что ощущает твоя кожа?', 'Есть ли запах в воздухе?', 'Какой вкус у тебя во рту?'] },
];

const CATEGORIES = ['Все', '🌊 Тревога', '🌑 Грусть', '🌿 Тело', '☀️ Каждый день', '⚡ Быстро'];

export default function Workshop() {
  const { isDark } = useTheme();
  const [selected, setSelected] = useState<Practice | null>(null);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('Все');
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('mirror-practice-count') || '0'));
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const finish = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('mirror-practice-count', newCount.toString());
    setSelected(null);
    setStep(0);
    setTimer(0);
    setTimerRunning(false);
  };

  const filtered = category === 'Все' ? PRACTICES : PRACTICES.filter(p => p.category === category);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (selected) {
    return (
      <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
        <button onClick={() => { setSelected(null); setStep(0); setTimer(0); setTimerRunning(false); }} style={{ background: 'none', border: 'none', color: soft, cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1rem' }}>← Назад</button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selected.color + '20', border: `2px solid ${selected.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.5rem' }}>🛠️</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: text, margin: '0 0 0.3rem' }}>{selected.title}</h2>
          <p style={{ color: selected.color, fontSize: '0.8rem' }}>{selected.source}</p>
          <p style={{ color: soft, fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.5rem' }}>{selected.desc}</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
          {selected.steps.map((_, i) => (
            <div key={i} style={{ width: i <= step ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i <= step ? selected.color : border, transition: 'all 0.3s ease' }} />
          ))}
        </div>

        {/* Current step */}
        <div style={{ background: card, border: `1px solid ${selected.color}40`, borderRadius: '20px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: text, lineHeight: 1.6, margin: 0 }}>
            {selected.steps[step]}
          </p>
        </div>

        {/* Timer */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: soft, fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif' }}>{formatTime(timer)}</p>
          <button onClick={() => setTimerRunning(!timerRunning)} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '10px', padding: '0.4rem 1rem', color: soft, cursor: 'pointer', fontSize: '0.85rem' }}>
            {timerRunning ? '⏸ Пауза' : '▶ Таймер'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {step > 0 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '0.9rem', background: 'none', border: `1px solid ${border}`, borderRadius: '12px', color: soft, cursor: 'pointer' }}>← Назад</button>}
          {step < selected.steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '0.9rem', background: selected.color, color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem' }}>Следующий шаг →</button>
          ) : (
            <button onClick={finish} style={{ flex: 2, padding: '0.9rem', background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem' }}>Завершить ✓</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>🛠️</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: '0.3rem 0' }}>Мастерская</h1>
        {count > 0 && <p style={{ color: soft, fontSize: '0.8rem' }}>🌿 {count} практик завершено</p>}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', marginBottom: '1.25rem', paddingBottom: '0.25rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            background: category === c ? '#b8860b' : card, color: category === c ? '#fff' : soft,
            border: `1px solid ${category === c ? '#b8860b' : border}`,
            borderRadius: '20px', padding: '0.4rem 0.75rem', cursor: 'pointer',
            whiteSpace: 'nowrap', fontSize: '0.8rem', transition: 'all 0.2s ease',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {filtered.map(p => (
          <button key={p.id} onClick={() => { setSelected(p); setStep(0); }} style={{
            background: card, border: `1px solid ${border}`, borderRadius: '16px',
            padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color, marginTop: '0.3rem', flexShrink: 0 }} />
              <div>
                <p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', margin: '0 0 0.2rem', fontWeight: 600 }}>{p.title}</p>
                <p style={{ color: p.color, fontSize: '0.75rem', margin: '0 0 0.4rem' }}>{p.source}</p>
                <p style={{ color: soft, fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
