import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import EmotionWheel from './EmotionWheel';

interface Entry { id: string; date: string; wellbeing: number; energy: number; emotions: string[]; note: string; }

export default function Mood() {
  const { isDark } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [wellbeing, setWellbeing] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const input = isDark ? '#3d2e1e' : '#fff';

  useEffect(() => {
    const saved = localStorage.getItem('mirror-mood-entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const FEEDBACK = [
    { max: 2, msg: 'Сейчас тяжело. Это тоже часть пути.', emoji: '🌧️' },
    { max: 4, msg: 'Непросто. Будь добр к себе сегодня.', emoji: '🌥️' },
    { max: 6, msg: 'Средне — и это нормально.', emoji: '⛅' },
    { max: 8, msg: 'Неплохо. Замечай хорошее.', emoji: '🌤️' },
    { max: 10, msg: 'Хорошо! Сохрани это ощущение.', emoji: '☀️' },
  ];

  const getFeedback = (v: number) => FEEDBACK.find(f => v <= f.max) || FEEDBACK[4];

  const toggleEmotion = (e: string) => {
    setEmotions(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  };

  const save = () => {
    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      wellbeing, energy, emotions, note,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('mirror-mood-entries', JSON.stringify(updated));
    setNote(''); setEmotions([]);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const fb = getFeedback(wellbeing);

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem' }}>🌡️</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: '0.3rem 0' }}>Состояние</h1>
        <p style={{ color: soft, fontSize: '0.85rem', fontStyle: 'italic' }}>Каков я сегодня?</p>
      </div>

      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <p style={{ color: soft, fontSize: '0.85rem', margin: 0 }}>Самочувствие</p>
          <span style={{ color: '#b8860b', fontWeight: 700, fontSize: '1.2rem' }}>{wellbeing}</span>
        </div>
        <input type="range" min={1} max={10} value={wellbeing} onChange={e => setWellbeing(+e.target.value)} style={{ width: '100%', accentColor: '#b8860b' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: soft, fontSize: '0.75rem' }}>Плохо</span>
          <span style={{ color: soft, fontSize: '0.75rem' }}>Отлично</span>
        </div>
      </div>

      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <p style={{ color: soft, fontSize: '0.85rem', margin: 0 }}>Уровень энергии</p>
          <span style={{ color: '#7A8B6F', fontWeight: 700, fontSize: '1.2rem' }}>{energy}</span>
        </div>
        <input type="range" min={1} max={10} value={energy} onChange={e => setEnergy(+e.target.value)} style={{ width: '100%', accentColor: '#7A8B6F' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: soft, fontSize: '0.75rem' }}>Истощён</span>
          <span style={{ color: soft, fontSize: '0.75rem' }}>Полон сил</span>
        </div>
      </div>

      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
        <p style={{ color: soft, fontSize: '0.85rem', marginBottom: '0.75rem', textAlign: 'center' }}>Что ты сейчас чувствуешь?</p>
        <EmotionWheel selected={emotions} onToggle={toggleEmotion} />
      </div>

      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
        <p style={{ color: soft, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Заметка</p>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Что ещё хочешь добавить?..."
          style={{ width: '100%', minHeight: '80px', background: input, border: `1px solid ${border}`, borderRadius: '10px', padding: '0.75rem', outline: 'none', color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', resize: 'none' }} />
      </div>

      <button onClick={save} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontFamily: 'Raleway, sans-serif', cursor: 'pointer', marginBottom: '1.5rem' }}>
        Зафиксировать состояние ✓
      </button>

      {showSaved && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '2rem', textAlign: 'center', maxWidth: '300px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{fb.emoji}</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: text, marginBottom: '1rem' }}>{fb.msg}</p>
            <button onClick={() => setShowSaved(false)} style={{ background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>Благодарю</button>
          </div>
        </div>
      )}

      <div>
        <p style={{ color: soft, fontSize: '0.8rem', marginBottom: '1rem', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>История состояний</p>
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: soft }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Здесь будет твой внутренний климат.</p>
          </div>
        ) : entries.map(e => (
          <div key={e.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: soft, fontSize: '0.8rem' }}>{e.date}</span>
              <button onClick={() => { const u = entries.filter(x => x.id !== e.id); setEntries(u); localStorage.setItem('mirror-mood-entries', JSON.stringify(u)); }} style={{ background: 'none', border: 'none', color: soft, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: text, fontSize: '0.85rem' }}>🌡️ {e.wellbeing}/10</span>
              <span style={{ color: text, fontSize: '0.85rem' }}>⚡ {e.energy}/10</span>
            </div>
            {e.emotions.length > 0 && <p style={{ color: soft, fontSize: '0.8rem', marginTop: '0.3rem' }}>{e.emotions.join(', ')}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
