import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDark } = useTheme();
  const [name, setName] = useState(() => localStorage.getItem('mirror-user-name') || '');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('mirror-api-key') || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const input = isDark ? '#3d2e1e' : '#fff';

  const save = () => {
    localStorage.setItem('mirror-user-name', name);
    localStorage.setItem('mirror-api-key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem' }}>⚙️</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: '0.3rem 0' }}>Настройки</h1>
      </div>

      {/* Name */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
        <p style={{ color: soft, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Как тебя зовут?</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Твоё имя..."
          style={{ width: '100%', background: input, border: `1px solid ${border}`, borderRadius: '10px', padding: '0.75rem', outline: 'none', color: text, fontFamily: 'Raleway, sans-serif', fontSize: '1rem', boxSizing: 'border-box' }} />
      </div>

      {/* API Key */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
        <p style={{ color: soft, fontSize: '0.85rem', marginBottom: '0.25rem' }}>OpenAI API ключ</p>
        <p style={{ color: soft, fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>Для живого диалога с Мудрецом</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input value={apiKey} onChange={e => setApiKey(e.target.value)} type={showKey ? 'text' : 'password'} placeholder="sk-..."
            style={{ flex: 1, background: input, border: `1px solid ${border}`, borderRadius: '10px', padding: '0.75rem', outline: 'none', color: text, fontFamily: 'Raleway, sans-serif', fontSize: '0.9rem' }} />
          <button onClick={() => setShowKey(!showKey)} style={{ background: card, border: `1px solid ${border}`, borderRadius: '10px', padding: '0 0.75rem', cursor: 'pointer', color: soft }}>
            {showKey ? '👁️' : '🔒'}
          </button>
        </div>
      </div>

      <button onClick={save} style={{
        width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #b8860b, #d4a017)',
        color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem',
        fontFamily: 'Raleway, sans-serif', cursor: 'pointer', marginBottom: '1.5rem',
      }}>{saved ? '✓ Сохранено' : 'Сохранить'}</button>

      {/* About */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: text, marginBottom: '1rem', textAlign: 'center' }}>О Зеркале 🪞</h2>
        <p style={{ color: soft, fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
          В нашем быстром и шумном мире мы разучились останавливаться. «Зеркало» — это пауза. Пространство для разговора с собой. Для тишины.
        </p>
        <div style={{ borderLeft: '3px solid #b8860b', paddingLeft: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: text, fontStyle: 'italic', lineHeight: 1.6 }}>
            «Разве кто-то может знать наверняка как жить эту жизнь, если каждый живёт её впервые?»
          </p>
        </div>
        <p style={{ color: soft, fontSize: '0.85rem', lineHeight: 1.6 }}>
          Зеркало не меняет тебя — оно помогает тебя увидеть. Мягко. Без осуждения. Это всё, что нужно.
        </p>
        <p style={{ color: soft, fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem', fontStyle: 'italic' }}>
          Версия 1.0 · Создано с душой
        </p>
      </div>
    </div>
  );
}
