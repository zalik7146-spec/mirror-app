import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Entry { id: string; date: string; world: string; people: string; self: string; letter: string; }

const QUESTIONS = {
  world: ['Что в мире вокруг тебя сегодня тронуло?', 'Что снаружи согрело тебя сегодня?', 'Какой момент дня был особенным?'],
  people: ['Кто сегодня был рядом — даже незаметно?', 'Кому ты благодарен сегодня?', 'Чья поддержка ощущалась сегодня?'],
  self: ['Что ты сделал для себя сегодня?', 'За что ты себя хвалишь сегодня?', 'Что в тебе сегодня проявилось хорошего?'],
};

export default function Gratitude() {
  const { isDark } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [world, setWorld] = useState('');
  const [people, setPeople] = useState('');
  const [self, setSelf] = useState('');
  const [letter, setLetter] = useState('');
  const [tab, setTab] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [viewEntry, setViewEntry] = useState<Entry | null>(null);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const input = isDark ? '#3d2e1e' : '#fff';

  useEffect(() => {
    const saved = localStorage.getItem('mirror-gratitude-entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const day = new Date().getDate();
  const q = { world: QUESTIONS.world[day % 3], people: QUESTIONS.people[day % 3], self: QUESTIONS.self[day % 3] };

  const save = () => {
    if (!world && !people && !self && !letter) return;
    const entry: Entry = { id: Date.now().toString(), date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }), world, people, self, letter };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('mirror-gratitude-entries', JSON.stringify(updated));
    setWorld(''); setPeople(''); setSelf(''); setLetter(''); setTab(0);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const TABS = [
    { emoji: '🌍', label: 'Миру', value: world, set: setWorld, q: q.world },
    { emoji: '🤝', label: 'Людям', value: people, set: setPeople, q: q.people },
    { emoji: '🪞', label: 'Себе', value: self, set: setSelf, q: q.self },
    { emoji: '✉️', label: 'Письмо', value: letter, set: setLetter, q: 'Напиши письмо себе — как близкому другу' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem' }}>🙏</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: '0.3rem 0' }}>Благодарность</h1>
        <p style={{ color: soft, fontSize: '0.85rem', fontStyle: 'italic' }}>Даже одна вещь в день меняет восприятие мира</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', overflowX: 'auto' }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            background: tab === i ? '#b8860b' : card, color: tab === i ? '#fff' : soft,
            border: `1px solid ${tab === i ? '#b8860b' : border}`,
            borderRadius: '20px', padding: '0.4rem 0.75rem', cursor: 'pointer',
            whiteSpace: 'nowrap', fontSize: '0.8rem', transition: 'all 0.2s ease',
          }}>{t.emoji} {t.label}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', transition: 'all 0.3s ease' }}>
        <p style={{ color: soft, fontSize: '0.85rem', marginBottom: '0.75rem', fontStyle: 'italic' }}>{TABS[tab].q}</p>
        <textarea value={TABS[tab].value} onChange={e => TABS[tab].set(e.target.value)}
          placeholder="Напиши здесь..."
          style={{ width: '100%', minHeight: '120px', background: input, border: `1px solid ${border}`, borderRadius: '10px', padding: '0.75rem', outline: 'none', color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', resize: 'none', lineHeight: 1.6 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          {tab > 0 && <button onClick={() => setTab(tab - 1)} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '10px', padding: '0.5rem 1rem', color: soft, cursor: 'pointer' }}>← Назад</button>}
          {tab < 3 ? (
            <button onClick={() => setTab(tab + 1)} style={{ background: '#b8860b', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.5rem 1rem', cursor: 'pointer', marginLeft: 'auto' }}>Далее →</button>
          ) : (
            <button onClick={save} style={{ background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.5rem 1.5rem', cursor: 'pointer', marginLeft: 'auto' }}>Сохранить ✓</button>
          )}
        </div>
      </div>

      {showSaved && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '2rem', textAlign: 'center', maxWidth: '300px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🙏</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: text, marginBottom: '1rem' }}>Благодарность — это практика видеть хорошее.</p>
            <button onClick={() => setShowSaved(false)} style={{ background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>Благодарю</button>
          </div>
        </div>
      )}

      {/* History */}
      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ color: soft, fontSize: '0.8rem', marginBottom: '1rem', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>История благодарностей</p>
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: soft }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🙏</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Здесь будет твоя благодарность.</p>
          </div>
        ) : entries.map(e => (
          <div key={e.id} onClick={() => setViewEntry(e)} style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '1rem', marginBottom: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={el => (el.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
            onMouseLeave={el => (el.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: soft, fontSize: '0.8rem' }}>{e.date}</span>
              <button onClick={ev => { ev.stopPropagation(); const u = entries.filter(x => x.id !== e.id); setEntries(u); localStorage.setItem('mirror-gratitude-entries', JSON.stringify(u)); }} style={{ background: 'none', border: 'none', color: soft, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {e.world && <span style={{ fontSize: '0.8rem' }}>🌍</span>}
              {e.people && <span style={{ fontSize: '0.8rem' }}>🤝</span>}
              {e.self && <span style={{ fontSize: '0.8rem' }}>🪞</span>}
              {e.letter && <span style={{ fontSize: '0.8rem' }}>✉️</span>}
            </div>
          </div>
        ))}
      </div>

      {viewEntry && (
        <div onClick={() => setViewEntry(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: soft, fontSize: '0.85rem' }}>{viewEntry.date}</span>
              <button onClick={() => setViewEntry(null)} style={{ background: 'none', border: 'none', color: soft, fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            {viewEntry.world && <div style={{ marginBottom: '1rem' }}><p style={{ color: soft, fontSize: '0.8rem' }}>🌍 Миру</p><p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{viewEntry.world}</p></div>}
            {viewEntry.people && <div style={{ marginBottom: '1rem' }}><p style={{ color: soft, fontSize: '0.8rem' }}>🤝 Людям</p><p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{viewEntry.people}</p></div>}
            {viewEntry.self && <div style={{ marginBottom: '1rem' }}><p style={{ color: soft, fontSize: '0.8rem' }}>🪞 Себе</p><p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{viewEntry.self}</p></div>}
            {viewEntry.letter && <div style={{ marginBottom: '1rem' }}><p style={{ color: soft, fontSize: '0.8rem' }}>✉️ Письмо</p><p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{viewEntry.letter}</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
