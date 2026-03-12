import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThreadItem {
  id: string;
  text: string;
  category: 'people' | 'places' | 'activities' | 'things';
  createdAt: string;
}

const categories = [
  { id: 'people', label: 'Люди', emoji: '👥', description: 'Кто даёт тебе силы?' },
  { id: 'places', label: 'Места', emoji: '🌿', description: 'Где тебе хорошо?' },
  { id: 'activities', label: 'Занятия', emoji: '✨', description: 'Что тебя восстанавливает?' },
  { id: 'things', label: 'Вещи', emoji: '💛', description: 'Что согревает тебя?' },
] as const;

type CategoryId = typeof categories[number]['id'];

export default function Thread() {
  const { isDark } = useTheme();
  const [items, setItems] = useState<ThreadItem[]>(() => {
    const saved = localStorage.getItem('mirror_thread');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCategory, setActiveCategory] = useState<CategoryId>('people');
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('mirror_thread', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!input.trim()) return;
    const newItem: ThreadItem = {
      id: Date.now().toString(),
      text: input.trim(),
      category: activeCategory,
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [...prev, newItem]);
    setInput('');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const [anchor, setAnchor] = useState<ThreadItem | null>(null);
  const [showAnchor, setShowAnchor] = useState(false);

  const getRandomAnchor = () => {
    if (items.length === 0) return;
    const random = items[Math.floor(Math.random() * items.length)];
    setAnchor(random);
    setShowAnchor(true);
  };

  const filtered = items.filter(item => item.category === activeCategory);
  const currentCategory = categories.find(c => c.id === activeCategory)!;

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '100px',
      background: isDark ? '#1a1410' : 'transparent',
    }}>
      {/* Заголовок */}
      <div style={{ padding: '2rem 1.5rem 1rem', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2rem',
          color: isDark ? '#e8d5b0' : '#2c2416',
          marginBottom: '0.25rem',
        }}>
          🧵 Нить
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: isDark ? '#a09070' : '#8b7355',
          fontStyle: 'italic',
          fontFamily: 'Raleway, sans-serif',
        }}>
          То, что связывает тебя с собой
        </p>
      </div>

      {/* Категории */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        padding: '0 1.5rem 1.5rem',
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: '12px',
              border: activeCategory === cat.id
                ? `2px solid ${isDark ? '#c8922a' : '#8b6914'}`
                : `2px solid ${isDark ? 'rgba(200,146,42,0.15)' : 'rgba(139,105,20,0.15)'}`,
              background: activeCategory === cat.id
                ? isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.1)'
                : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{cat.emoji}</span>
            <span style={{
              fontSize: '0.7rem',
              color: isDark ? '#c8a96e' : '#6b4f12',
              fontWeight: activeCategory === cat.id ? '600' : '400',
            }}>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Описание категории */}
      <div style={{ padding: '0 1.5rem 1rem' }}>
        <p style={{
          fontSize: '1.1rem',
          color: isDark ? '#c8a96e' : '#5c4a1e',
          fontStyle: 'italic',
          fontFamily: 'Cormorant Garamond, serif',
        }}>
          {currentCategory.description}
        </p>
      </div>

      {/* Поле ввода */}
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder={`Добавить в «${currentCategory.label}»...`}
            style={{
              flex: 1,
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: `1px solid ${isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.2)'}`,
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              color: isDark ? '#e8d5b0' : '#2c2416',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={addItem}
            disabled={!input.trim()}
            style={{
              padding: '0.875rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: input.trim()
                ? isDark ? '#c8922a' : '#8b6914'
                : isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.15)',
              color: input.trim() ? '#fff' : isDark ? '#6b5a3a' : '#b8a070',
              fontSize: '1.2rem',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Список */}
      <div style={{ padding: '0 1.5rem' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: isDark ? '#6b5a3a' : '#b8a070',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{currentCategory.emoji}</div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              Здесь пока пусто.<br />Добавь то, что наполняет тебя.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {filtered.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)',
                  border: `1px solid ${isDark ? 'rgba(200,146,42,0.12)' : 'rgba(139,105,20,0.12)'}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{
                  color: isDark ? '#e8d5b0' : '#2c2416',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                }}>
                  {item.text}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isDark ? '#5a4a2a' : '#c8b090',
                    fontSize: '1rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    transition: 'color 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e53e3e')}
                  onMouseLeave={e => (e.currentTarget.style.color = isDark ? '#5a4a2a' : '#c8b090')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Обратиться к Нити */}
      <div style={{ padding: '2rem 1.5rem 0' }}>
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            borderRadius: '14px',
            border: `1px dashed ${isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.2)'}`,
            color: isDark ? '#6b5a3a' : '#b8a070',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            fontFamily: 'Cormorant Garamond, serif',
          }}>
            Добавь свои нити — и сможешь обращаться к ним когда тяжело 🧵
          </div>
        ) : (
          <div>
            <button
              onClick={getRandomAnchor}
              style={{
                width: '100%',
                padding: '1.1rem',
                borderRadius: '14px',
                border: `1px solid ${isDark ? 'rgba(200,146,42,0.3)' : 'rgba(139,105,20,0.25)'}`,
                background: isDark ? 'rgba(200,146,42,0.1)' : 'rgba(139,105,20,0.07)',
                color: isDark ? '#c8a96e' : '#6b4f12',
                fontSize: '1rem',
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              🧵 Обратиться к Нити
            </button>

            {showAnchor && anchor && (
              <div style={{
                marginTop: '1rem',
                padding: '1.5rem',
                borderRadius: '14px',
                background: isDark ? 'rgba(30,24,18,0.9)' : 'rgba(255,252,245,0.95)',
                border: `1px solid ${isDark ? 'rgba(200,146,42,0.25)' : 'rgba(139,105,20,0.2)'}`,
                textAlign: 'center',
                animation: 'fadeInUp 0.4s ease forwards',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                  {categories.find(c => c.id === anchor.category)?.emoji}
                </div>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.3rem',
                  color: isDark ? '#e8d5b0' : '#2c2416',
                  marginBottom: '0.5rem',
                }}>
                  {anchor.text}
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: isDark ? '#8b7355' : '#b8a070',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                }}>
                  {categories.find(c => c.id === anchor.category)?.label}
                </p>
                <button
                  onClick={getRandomAnchor}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDark ? '#c8a96e' : '#8b6914',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'Raleway, sans-serif',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Другая →
                </button>
              </div>
            )}

            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              background: isDark ? 'rgba(200,146,42,0.06)' : 'rgba(139,105,20,0.04)',
              textAlign: 'center',
            }}>
              <p style={{
                color: isDark ? '#8b7355' : '#b8a070',
                fontSize: '0.82rem',
                fontStyle: 'italic',
                fontFamily: 'Cormorant Garamond, serif',
              }}>
                У тебя {items.length} {items.length === 1 ? 'нить' : items.length < 5 ? 'нити' : 'нитей'} — всё это твоё 🧵
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
