import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Props { onComplete: (name: string) => void; }

export default function Onboarding({ onComplete }: Props) {
  const { isDark } = useTheme();
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';

  const finish = () => {
    localStorage.setItem('mirror-user-name', name);
    localStorage.setItem('mirror-onboarding-complete', 'true');
    onComplete(name);
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Raleway, sans-serif' }}>
      {page === 0 && (
        <div style={{ textAlign: 'center', maxWidth: '400px', animation: 'bookOpen 0.6s ease forwards' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🪞</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: text, marginBottom: '1rem' }}>Зеркало</h1>
          <p style={{ color: soft, fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.5rem', fontStyle: 'italic' }}>
            В нашем быстром и шумном мире мы разучились останавливаться.
          </p>
          <p style={{ color: soft, fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Это пространство для разговора с собой. Для тишины. Для честного взгляда внутрь.
          </p>
          <button onClick={() => setPage(1)} style={{ background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '14px', padding: '0.9rem 2.5rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Raleway, sans-serif' }}>
            Войти →
          </button>
          <br />
          <button onClick={finish} style={{ background: 'none', border: 'none', color: soft, fontSize: '0.8rem', cursor: 'pointer', marginTop: '1rem' }}>пропустить</button>
        </div>
      )}

      {page === 1 && (
        <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%', animation: 'bookOpen 0.6s ease forwards' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, marginBottom: '0.5rem' }}>Как мне к тебе обращаться?</h2>
          <p style={{ color: soft, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Просто имя. Больше ничего.</p>
          <input value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && setPage(2)}
            placeholder="Твоё имя..."
            style={{ width: '100%', background: isDark ? '#3d2e1e' : '#fff', border: `1px solid ${border}`, borderRadius: '12px', padding: '0.9rem 1rem', outline: 'none', color: text, fontFamily: 'Raleway, sans-serif', fontSize: '1.1rem', textAlign: 'center', boxSizing: 'border-box', marginBottom: '1rem' }} />
          <button onClick={() => name.trim() && setPage(2)} disabled={!name.trim()} style={{
            background: name.trim() ? 'linear-gradient(135deg, #b8860b, #d4a017)' : '#ccc',
            color: '#fff', border: 'none', borderRadius: '14px', padding: '0.9rem 2.5rem',
            fontSize: '1rem', cursor: name.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Raleway, sans-serif',
          }}>Далее →</button>
        </div>
      )}

      {page === 2 && (
        <div style={{ textAlign: 'center', maxWidth: '400px', animation: 'bookOpen 0.6s ease forwards' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🪞</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, marginBottom: '1rem' }}>
            Рад встрече, {name}.
          </h2>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: soft, fontStyle: 'italic', marginBottom: '2rem' }}>
            Зеркало готово. Всмотрись.
          </p>
          <button onClick={finish} style={{ background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '14px', padding: '0.9rem 2.5rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Raleway, sans-serif' }}>
            Открыть Зеркало ✨
          </button>
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i === page ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === page ? '#b8860b' : border, transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  );
}
