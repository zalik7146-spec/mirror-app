import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Entry {
  id: string;
  date: string;
  mood: string;
  moodEmoji: string;
  text: string;
  tags: string[];
  mode: string;
}

const MOODS = [
  { label: 'Радостно', emoji: '😊', color: '#f59e0b' },
  { label: 'Спокойно', emoji: '😌', color: '#10b981' },
  { label: 'Тревожно', emoji: '😰', color: '#6366f1' },
  { label: 'Грустно', emoji: '😢', color: '#3b82f6' },
  { label: 'Устало', emoji: '😴', color: '#8b5cf6' },
  { label: 'Злюсь', emoji: '😤', color: '#ef4444' },
  { label: 'Вдохновлённо', emoji: '✨', color: '#f97316' },
  { label: 'Растерянно', emoji: '😕', color: '#6b7280' },
];

const TAGS = ['размышления', 'эмоции', 'цели', 'отношения', 'работа', 'тело', 'благодарность', 'инсайт'];

const MODES = [
  { id: 'free', label: '🌊 Свободный поток', desc: 'Пиши без правил' },
  { id: 'day', label: '🌅 Страница дня', desc: 'Четыре момента' },
  { id: 'six', label: '🔍 Шесть вопросов', desc: 'Глубокая рефлексия' },
];

const DAY_QUESTIONS = [
  { emoji: '☀️', q: 'Как начался твой день?' },
  { emoji: '💭', q: 'Что сейчас на уме?' },
  { emoji: '✨', q: 'Момент который запомнится' },
  { emoji: '🌙', q: 'Как заканчивается день?' },
];

const SIX_QUESTIONS = [
  { emoji: '🌊', q: 'Что сейчас тяжело лежит на сердце?', hint: 'Назови это — уже легче' },
  { emoji: '☀️', q: 'Что сегодня согрело тебя изнутри?', hint: 'Даже маленькое' },
  { emoji: '🌀', q: 'От чего ты сегодня уходишь в сторону?', hint: 'Честно — без осуждения' },
  { emoji: '💫', q: 'Чего ты сейчас по-настоящему хочешь?', hint: 'Не должен, не нужно — хочешь' },
  { emoji: '🙏', q: 'За что ты благодарен сегодня?', hint: 'Одна вещь — уже много' },
  { emoji: '💡', q: 'Что ты понял о себе сегодня?', hint: 'Любое наблюдение' },
];

export default function Diary() {
  const { isDark } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mode, setMode] = useState('free');
  const [mood, setMood] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('');
  const [text, setText] = useState('');
  const [dayAnswers, setDayAnswers] = useState(['', '', '', '']);
  const [sixAnswers, setSixAnswers] = useState(['', '', '', '', '', '']);
  const [tags, setTags] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [viewEntry, setViewEntry] = useState<Entry | null>(null);
  const [saved, setSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text2 = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const input = isDark ? '#3d2e1e' : '#fff';

  useEffect(() => {
    const saved = localStorage.getItem('mirror-diary-entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const save = () => {
    let content = text;
    if (mode === 'day') content = DAY_QUESTIONS.map((q, i) => `${q.emoji} ${q.q}\n${dayAnswers[i]}`).join('\n\n');
    if (mode === 'six') content = SIX_QUESTIONS.map((q, i) => `${q.emoji} ${q.q}\n${sixAnswers[i]}`).join('\n\n');
    if (!content.trim() && !mood) return;
    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      mood, moodEmoji, text: content, tags,
      mode: mode === 'free' ? 'Свободный поток' : mode === 'day' ? 'Страница дня' : 'Шесть вопросов',
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('mirror-diary-entries', JSON.stringify(updated));
    setText(''); setMood(''); setMoodEmoji(''); setTags([]);
    setDayAnswers(['', '', '', '']); setSixAnswers(['', '', '', '', '', '']);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const del = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('mirror-diary-entries', JSON.stringify(updated));
  };

  const filtered = entries.filter(e => {
    const matchSearch = !search || e.text.toLowerCase().includes(search.toLowerCase());
    const matchTag = !filterTag || e.tags.includes(filterTag);
    return matchSearch && matchTag;
  });

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem' }}>📖</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text2, margin: '0.3rem 0' }}>Дневник</h1>
        <p style={{ color: soft, fontSize: '0.85rem' }}>
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Mood */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ color: soft, fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>Как ты себя сейчас чувствуешь?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {MOODS.map(m => (
            <button key={m.label} onClick={() => { setMood(m.label); setMoodEmoji(m.emoji); }} style={{
              background: mood === m.label ? m.color + '30' : 'transparent',
              border: `2px solid ${mood === m.label ? m.color : 'transparent'}`,
              borderRadius: '12px', padding: '0.5rem 0.25rem', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
              transition: 'all 0.2s ease',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{m.emoji}</span>
              <span style={{ fontSize: '0.65rem', color: text2 }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            background: mode === m.id ? '#b8860b' : card,
            color: mode === m.id ? '#fff' : soft,
            border: `1px solid ${mode === m.id ? '#b8860b' : border}`,
            borderRadius: '20px', padding: '0.4rem 0.75rem',
            cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem',
            transition: 'all 0.2s ease',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1rem', marginBottom: '1rem' }}>
        {mode === 'free' && (
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Что у тебя на душе сегодня?..."
            style={{ width: '100%', minHeight: '150px', background: 'transparent', border: 'none', outline: 'none', color: text2, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', resize: 'none', lineHeight: 1.6 }} />
        )}
        {mode === 'day' && DAY_QUESTIONS.map((q, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <p style={{ color: soft, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{q.emoji} {q.q}</p>
            <textarea value={dayAnswers[i]} onChange={e => { const a = [...dayAnswers]; a[i] = e.target.value; setDayAnswers(a); }}
              placeholder="Напиши здесь..."
              style={{ width: '100%', minHeight: '70px', background: input, border: `1px solid ${border}`, borderRadius: '8px', padding: '0.5rem', outline: 'none', color: text2, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', resize: 'none' }} />
          </div>
        ))}
        {mode === 'six' && SIX_QUESTIONS.map((q, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <p style={{ color: soft, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{q.emoji} {q.q}</p>
            <p style={{ color: soft, fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '0.4rem' }}>{q.hint}</p>
            <textarea value={sixAnswers[i]} onChange={e => { const a = [...sixAnswers]; a[i] = e.target.value; setSixAnswers(a); }}
              placeholder="..."
              style={{ width: '100%', minHeight: '70px', background: input, border: `1px solid ${border}`, borderRadius: '8px', padding: '0.5rem', outline: 'none', color: text2, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', resize: 'none' }} />
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: soft, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Теги:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {TAGS.map(t => (
            <button key={t} onClick={() => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])} style={{
              background: tags.includes(t) ? '#b8860b' : card,
              color: tags.includes(t) ? '#fff' : soft,
              border: `1px solid ${tags.includes(t) ? '#b8860b' : border}`,
              borderRadius: '20px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={save} style={{
        width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #b8860b, #d4a017)',
        color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem',
        fontFamily: 'Raleway, sans-serif', cursor: 'pointer', marginBottom: '1.5rem',
        transition: 'all 0.2s ease',
      }}>Сохранить запись ✓</button>

      {showSaved && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: card, border: `1px solid ${border}`, borderRadius: '20px',
          padding: '2rem', textAlign: 'center', zIndex: 200, maxWidth: '300px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🪞</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: text2, marginBottom: '1rem' }}>
            Ты только что подарил себе минуту честности.
          </p>
          <button onClick={() => setShowSaved(false)} style={{
            background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff',
            border: 'none', borderRadius: '10px', padding: '0.6rem 1.5rem', cursor: 'pointer',
          }}>Благодарю</button>
        </div>
      )}

      {/* History */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по записям..."
            style={{ flex: 1, background: input, border: `1px solid ${border}`, borderRadius: '10px', padding: '0.5rem 0.75rem', color: text2, fontFamily: 'Raleway, sans-serif', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
          <button onClick={() => setFilterTag('')} style={{
            background: !filterTag ? '#b8860b' : card, color: !filterTag ? '#fff' : soft,
            border: `1px solid ${!filterTag ? '#b8860b' : border}`, borderRadius: '20px',
            padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer',
          }}>Все</button>
          {TAGS.map(t => (
            <button key={t} onClick={() => setFilterTag(filterTag === t ? '' : t)} style={{
              background: filterTag === t ? '#b8860b' : card,
              color: filterTag === t ? '#fff' : soft,
              border: `1px solid ${filterTag === t ? '#b8860b' : border}`,
              borderRadius: '20px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: soft }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Здесь будут жить твои мысли.</p>
            <p style={{ fontSize: '0.85rem' }}>Начни с первой записи.</p>
          </div>
        ) : filtered.map(e => (
          <div key={e.id} onClick={() => setViewEntry(e)} style={{
            background: card, border: `1px solid ${border}`, borderRadius: '14px',
            padding: '1rem', marginBottom: '0.75rem', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={el => (el.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
            onMouseLeave={el => (el.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{e.moodEmoji}</span>
                <span style={{ color: soft, fontSize: '0.8rem' }}>{e.date}</span>
              </div>
              <button onClick={ev => { ev.stopPropagation(); del(e.id); }} style={{
                background: 'none', border: 'none', color: soft, cursor: 'pointer', fontSize: '1rem',
              }}>×</button>
            </div>
            <p style={{ color: text2, fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {e.text}
            </p>
            {e.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {e.tags.map(t => (
                  <span key={t} style={{ background: '#b8860b20', color: '#b8860b', borderRadius: '10px', padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View modal */}
      {viewEntry && (
        <div onClick={() => setViewEntry(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: bg, border: `1px solid ${border}`, borderRadius: '20px',
            padding: '1.5rem', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <p style={{ color: soft, fontSize: '0.8rem' }}>{viewEntry.date}</p>
                <p style={{ color: text2, fontSize: '1rem' }}>{viewEntry.moodEmoji} {viewEntry.mood}</p>
              </div>
              <button onClick={() => setViewEntry(null)} style={{ background: 'none', border: 'none', color: soft, fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: text2, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{viewEntry.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
