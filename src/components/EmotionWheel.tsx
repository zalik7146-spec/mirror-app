import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Emotion {
  name: string;
  color: string;
  shades: { name: string; color: string }[];
}

const DESCRIPTIONS: Record<string, string> = {
  'Радость': 'Радость — это сигнал что ты на своём месте. Замечай её и береги.',
  'Доверие': 'Доверие строится медленно. То, что ты его чувствуешь — уже ценность.',
  'Страх': 'Страх часто говорит нам о том, что что-то важно для нас.',
  'Удивление': 'Удивление — признак живого ума. Ты ещё способен видеть мир свежо.',
  'Грусть': 'Грусть — это любовь которой некуда идти. Она тоже достойна внимания.',
  'Отвращение': 'Отвращение указывает на границы. Твои ценности говорят через него.',
  'Злость': 'Злость сигнализирует о нарушенных границах. Она имеет право быть.',
  'Ожидание': 'Ожидание — это энергия направленная в будущее. Что ты предвкушаешь?',
};

const WHEEL: Emotion[] = [
  {
    name: 'Радость',
    color: '#e8b84b',
    shades: [
      { name: 'Восторг', color: '#f0c85a' },
      { name: 'Счастье', color: '#e8b84b' },
      { name: 'Удовольствие', color: '#d4a43c' },
    ],
  },
  {
    name: 'Доверие',
    color: '#7ab648',
    shades: [
      { name: 'Принятие', color: '#8fc85a' },
      { name: 'Доверие', color: '#7ab648' },
      { name: 'Восхищение', color: '#5a9632' },
    ],
  },
  {
    name: 'Страх',
    color: '#4a9a7a',
    shades: [
      { name: 'Беспокойство', color: '#5aaa8a' },
      { name: 'Страх', color: '#4a9a7a' },
      { name: 'Ужас', color: '#2a7a5a' },
    ],
  },
  {
    name: 'Удивление',
    color: '#4a8ab8',
    shades: [
      { name: 'Рассеянность', color: '#5a9ac8' },
      { name: 'Удивление', color: '#4a8ab8' },
      { name: 'Изумление', color: '#2a6a98' },
    ],
  },
  {
    name: 'Грусть',
    color: '#6a6ab8',
    shades: [
      { name: 'Задумчивость', color: '#7a7ac8' },
      { name: 'Грусть', color: '#6a6ab8' },
      { name: 'Горе', color: '#4a4a98' },
    ],
  },
  {
    name: 'Отвращение',
    color: '#9a5ab8',
    shades: [
      { name: 'Скука', color: '#aa6ac8' },
      { name: 'Отвращение', color: '#9a5ab8' },
      { name: 'Ненависть', color: '#7a3a98' },
    ],
  },
  {
    name: 'Злость',
    color: '#c85a5a',
    shades: [
      { name: 'Раздражение', color: '#d86a6a' },
      { name: 'Злость', color: '#c85a5a' },
      { name: 'Ярость', color: '#a83a3a' },
    ],
  },
  {
    name: 'Ожидание',
    color: '#c8824a',
    shades: [
      { name: 'Интерес', color: '#d8925a' },
      { name: 'Ожидание', color: '#c8824a' },
      { name: 'Бдительность', color: '#a8622a' },
    ],
  },
];

interface Props {
  selected: string[];
  onChange: (emotions: string[]) => void;
}

export default function EmotionWheel({ selected, onChange }: Props) {
  const { isDark } = useTheme();
  const [activeEmotion, setActiveEmotion] = useState<Emotion | null>(null);

  const toggle = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter(e => e !== name)
        : [...selected, name]
    );
  };

  const textColor = isDark ? '#e8dcc8' : '#2c2416';
  const mutedColor = isDark ? '#8b7a5e' : '#5c4f3a';
  const cardBg = isDark ? 'rgba(30, 24, 18, 0.85)' : 'rgba(250, 247, 242, 0.9)';

  return (
    <div>
      {/* Колесо */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {WHEEL.map(emotion => (
          <button
            key={emotion.name}
            onClick={() => setActiveEmotion(activeEmotion?.name === emotion.name ? null : emotion)}
            style={{
              background: activeEmotion?.name === emotion.name
                ? emotion.color + '33'
                : selected.some(s => emotion.shades.some(sh => sh.name === s))
                ? emotion.color + '22'
                : cardBg,
              border: `1px solid ${
                activeEmotion?.name === emotion.name
                  ? emotion.color
                  : selected.some(s => emotion.shades.some(sh => sh.name === s))
                  ? emotion.color + '88'
                  : isDark ? 'rgba(200,146,42,0.12)' : 'rgba(200,146,42,0.15)'
              }`,
              borderRadius: '12px',
              padding: '12px 8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: emotion.color,
              opacity: 0.85,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '0.78rem',
              color: textColor,
              lineHeight: 1.2,
              textAlign: 'center',
            }}>
              {emotion.name}
            </span>
            {selected.some(s => emotion.shades.some(sh => sh.name === s)) && (
              <span style={{ fontSize: '0.6rem', color: emotion.color }}>✦</span>
            )}
          </button>
        ))}
      </div>

      {/* Оттенки — раскрываются при выборе */}
      {activeEmotion && (
        <div style={{
          background: cardBg,
          border: `1px solid ${activeEmotion.color}44`,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '16px',
          animation: 'fadeInUp 0.3s ease forwards',
        }}>
          <p style={{
            color: activeEmotion.color,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'Raleway, sans-serif',
          }}>
            Оттенки — {activeEmotion.name}
          </p>
          {DESCRIPTIONS[activeEmotion.name] && (
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '0.95rem',
              color: isDark ? '#c8b090' : '#5a4020',
              fontStyle: 'italic',
              lineHeight: 1.7,
              marginBottom: '12px',
            }}>
              {DESCRIPTIONS[activeEmotion.name]}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {activeEmotion.shades.map(shade => (
              <button
                key={shade.name}
                onClick={() => toggle(shade.name)}
                style={{
                  background: selected.includes(shade.name)
                    ? shade.color + '33'
                    : 'transparent',
                  border: `1px solid ${selected.includes(shade.name) ? shade.color : shade.color + '55'}`,
                  borderRadius: '20px',
                  padding: '7px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  background: shade.color,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '0.9rem',
                  color: textColor,
                }}>
                  {shade.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Выбранные эмоции */}
      {selected.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <p style={{
            color: mutedColor,
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'Raleway, sans-serif',
          }}>
            Выбрано
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {selected.map(name => {
              const shade = WHEEL.flatMap(e => e.shades).find(s => s.name === name);
              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  style={{
                    background: shade ? shade.color + '22' : 'rgba(200,146,42,0.1)',
                    border: `1px solid ${shade ? shade.color + '66' : 'rgba(200,146,42,0.3)'}`,
                    borderRadius: '20px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    color: textColor,
                    fontFamily: 'Cormorant Garamond, serif',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {shade && (
                    <div style={{
                      width: '8px', height: '8px',
                      borderRadius: '50%',
                      background: shade.color,
                    }} />
                  )}
                  {name}
                  <span style={{ color: isDark ? 'rgba(184,168,130,0.4)' : 'rgba(92,79,58,0.35)', fontSize: '0.9rem' }}>×</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Подсказка */}
      {!activeEmotion && selected.length === 0 && (
        <p style={{
          color: mutedColor,
          fontSize: '0.78rem',
          fontStyle: 'italic',
          textAlign: 'center',
          fontFamily: 'Cormorant Garamond, serif',
          marginTop: '4px',
        }}>
          Нажми на эмоцию — откроются её оттенки
        </p>
      )}
    </div>
  );
}
