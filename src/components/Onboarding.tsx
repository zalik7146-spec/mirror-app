import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onComplete: (name: string) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const { isDark } = useTheme();
  const [page, setPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [name, setName] = useState('');
  const [flipping, setFlipping] = useState(false);

  const goNext = () => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setPage(p => p + 1);
      setAnimKey(k => k + 1);
      setFlipping(false);
    }, 400);
  };

  const handleFinish = () => {
    if (name.trim()) {
      localStorage.setItem('mirror_user_name', name.trim());
    }
    onComplete(name.trim());
  };

  const bg = isDark
    ? 'linear-gradient(135deg, #1a1208 0%, #2c1f0e 50%, #1a1208 100%)'
    : 'linear-gradient(135deg, #f5efe6 0%, #ede0cc 50%, #f5efe6 100%)';

  const textColor = isDark ? '#e8d5b0' : '#2c2416';
  const subColor = isDark ? '#b8956a' : '#8b6f47';
  const gold = isDark ? '#c8922a' : '#a0722a';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Декоративные элементы фона */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: isDark
          ? 'radial-gradient(ellipse at 20% 50%, rgba(200,146,42,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,146,42,0.03) 0%, transparent 50%)'
          : 'radial-gradient(ellipse at 20% 50%, rgba(160,114,42,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(160,114,42,0.04) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Страница */}
      <div
        key={animKey}
        className="animate-bookOpen"
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >

        {/* Страница 1 — Встреча */}
        {page === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
            <div style={{ fontSize: '5rem', lineHeight: 1, filter: 'drop-shadow(0 4px 24px rgba(200,146,42,0.3))' }}>
              🪞
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}>
                Зеркало
              </h1>

              <div style={{
                width: '40px',
                height: '2px',
                background: gold,
                margin: '0 auto',
                opacity: 0.6,
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '360px' }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.15rem',
                color: textColor,
                lineHeight: 1.8,
                fontStyle: 'italic',
              }}>
                «Добро пожаловать.»
              </p>
              <p style={{
                fontFamily: "'Lora', serif",
                fontSize: '1rem',
                color: subColor,
                lineHeight: 1.9,
              }}>
                Это пространство создано для тебя.<br />
                Здесь нет правильных ответов —<br />
                только твои.
              </p>
            </div>

            <button
              onClick={goNext}
              style={{
                marginTop: '1rem',
                padding: '0.9rem 2.5rem',
                background: 'transparent',
                border: `1px solid ${gold}`,
                borderRadius: '100px',
                color: gold,
                fontFamily: "'Lora', serif",
                fontSize: '0.95rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background = gold;
                (e.target as HTMLButtonElement).style.color = isDark ? '#1a1208' : '#fff';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background = 'transparent';
                (e.target as HTMLButtonElement).style.color = gold;
              }}
            >
              Войти
            </button>

            <button
              onClick={handleFinish}
              style={{
                background: 'none',
                border: 'none',
                color: subColor,
                fontFamily: "'Lora', serif",
                fontSize: '0.8rem',
                cursor: 'pointer',
                opacity: 0.6,
                letterSpacing: '0.03em',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              пропустить
            </button>
          </div>
        )}

        {/* Страница 2 — Имя */}
        {page === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', width: '100%' }}>
            <div style={{ fontSize: '3rem', lineHeight: 1 }}>✦</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <p style={{
                fontFamily: "'Lora', serif",
                fontSize: '0.85rem',
                color: subColor,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                Страница первая
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.3,
              }}>
                Как мне к тебе<br />обращаться?
              </h2>
            </div>

            <div style={{ width: '100%', maxWidth: '320px' }}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && goNext()}
                placeholder="Твоё имя..."
                autoFocus
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1.5px solid ${gold}`,
                  outline: 'none',
                  padding: '0.8rem 0',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  color: textColor,
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  caretColor: gold,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={goNext}
                disabled={!name.trim()}
                style={{
                  padding: '0.9rem 2.5rem',
                  background: name.trim() ? gold : 'transparent',
                  border: `1px solid ${name.trim() ? gold : subColor}`,
                  borderRadius: '100px',
                  color: name.trim() ? (isDark ? '#1a1208' : '#fff') : subColor,
                  fontFamily: "'Lora', serif",
                  fontSize: '0.95rem',
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease',
                  opacity: name.trim() ? 1 : 0.5,
                }}
              >
                Далее
              </button>

              <button
                onClick={handleFinish}
                style={{
                  background: 'none',
                  border: 'none',
                  color: subColor,
                  fontFamily: "'Lora', serif",
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  opacity: 0.6,
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                пропустить
              </button>
            </div>
          </div>
        )}

        {/* Страница 3 — Финал */}
        {page === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
            <div style={{
              fontSize: '5rem',
              lineHeight: 1,
              animation: 'mirrorGlow 2s ease-in-out infinite alternate',
              filter: 'drop-shadow(0 4px 32px rgba(200,146,42,0.4))',
            }}>
              🪞
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '360px' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.3,
              }}>
                {name ? `Рад встрече, ${name}.` : 'Рад встрече.'}
              </h2>

              <div style={{
                width: '40px',
                height: '2px',
                background: gold,
                margin: '0.5rem auto',
                opacity: 0.6,
              }} />

              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem',
                color: subColor,
                lineHeight: 1.8,
                fontStyle: 'italic',
              }}>
                Зеркало готово.<br />Всмотрись.
              </p>
            </div>

            <button
              onClick={handleFinish}
              style={{
                marginTop: '1rem',
                padding: '0.9rem 2.5rem',
                background: gold,
                border: `1px solid ${gold}`,
                borderRadius: '100px',
                color: isDark ? '#1a1208' : '#fff',
                fontFamily: "'Lora', serif",
                fontSize: '0.95rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 20px ${gold}40`,
              }}
            >
              Открыть Зеркало
            </button>
          </div>
        )}
      </div>

      {/* Индикатор страниц */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: i === page ? '24px' : '6px',
              height: '6px',
              borderRadius: '100px',
              background: i === page ? gold : subColor,
              opacity: i === page ? 1 : 0.3,
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
