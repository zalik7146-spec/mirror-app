import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Props { selected: string[]; onToggle: (e: string) => void; }

const EMOTIONS = [
  { name: 'Радость', color: '#f59e0b', shades: ['Удовольствие', 'Радость', 'Восторг'], desc: 'Радость — сигнал что ты на своём месте.' },
  { name: 'Доверие', color: '#10b981', shades: ['Принятие', 'Доверие', 'Восхищение'], desc: 'Доверие — основа глубоких связей.' },
  { name: 'Страх', color: '#6366f1', shades: ['Беспокойство', 'Страх', 'Ужас'], desc: 'Страх говорит о том, что что-то важно.' },
  { name: 'Удивление', color: '#8b5cf6', shades: ['Рассеянность', 'Удивление', 'Изумление'], desc: 'Удивление открывает нас новому.' },
  { name: 'Грусть', color: '#3b82f6', shades: ['Задумчивость', 'Грусть', 'Горе'], desc: 'Грусть — это любовь которой некуда идти.' },
  { name: 'Отвращение', color: '#6b7280', shades: ['Скука', 'Отвращение', 'Ненависть'], desc: 'Отвращение защищает наши ценности.' },
  { name: 'Злость', color: '#ef4444', shades: ['Раздражение', 'Злость', 'Ярость'], desc: 'Злость сигнализирует о нарушенных границах.' },
  { name: 'Ожидание', color: '#f97316', shades: ['Интерес', 'Ожидание', 'Бдительность'], desc: 'Ожидание — это энергия движения вперёд.' },
];

export default function EmotionWheel({ selected, onToggle }: Props) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState<string | null>(null);

  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {EMOTIONS.map(e => (
          <button key={e.name} onClick={() => setOpen(open === e.name ? null : e.name)} style={{
            background: open === e.name ? e.color + '30' : card,
            border: `2px solid ${open === e.name ? e.color : border}`,
            borderRadius: '12px', padding: '0.5rem 0.25rem', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
            transition: 'all 0.2s ease',
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: e.color }} />
            <span style={{ fontSize: '0.65rem', color: text }}>{e.name}</span>
          </button>
        ))}
      </div>

      {open && (() => {
        const emotion = EMOTIONS.find(e => e.name === open)!;
        return (
          <div style={{ background: emotion.color + '15', border: `1px solid ${emotion.color}40`, borderRadius: '12px', padding: '0.75rem', marginBottom: '0.75rem', transition: 'all 0.3s ease' }}>
            <p style={{ color: soft, fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>{emotion.desc}</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {emotion.shades.map(s => (
                <button key={s} onClick={() => onToggle(s)} style={{
                  background: selected.includes(s) ? emotion.color : 'transparent',
                  color: selected.includes(s) ? '#fff' : text,
                  border: `1px solid ${emotion.color}`,
                  borderRadius: '20px', padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>{s}</button>
              ))}
            </div>
          </div>
        );
      })()}

      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {selected.map(s => {
            const emotion = EMOTIONS.find(e => e.shades.includes(s));
            return (
              <span key={s} onClick={() => onToggle(s)} style={{
                background: (emotion?.color || '#b8860b') + '20',
                color: emotion?.color || '#b8860b',
                border: `1px solid ${emotion?.color || '#b8860b'}40`,
                borderRadius: '20px', padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer',
              }}>{s} ×</span>
            );
          })}
        </div>
      )}
    </div>
  );
}
