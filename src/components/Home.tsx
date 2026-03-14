import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import DailyQuote from './DailyQuote';
import Stats from './Stats';
import WeekWidget from './WeekWidget';

type Section = 'home' | 'diary' | 'workshop' | 'gratitude' | 'mood' | 'sage' | 'settings' | 'compass' | 'mirror';

interface HomeProps {
  onNavigate: (section: Section) => void;
}

const books = [
  { id: 'diary' as Section, emoji: '📖', label: 'Дневник', color: '#8B4513' },
  { id: 'workshop' as Section, emoji: '🛠️', label: 'Мастерская', color: '#5B6B4A' },
  { id: 'gratitude' as Section, emoji: '🙏', label: 'Благодарность', color: '#9B6B3D' },
  { id: 'mood' as Section, emoji: '🌡️', label: 'Состояние', color: '#6B4A5B' },
  { id: 'compass' as Section, emoji: '🧭', label: 'Компас', color: '#4A6B6B' },
  { id: 'mirror' as Section, emoji: '🔮', label: 'Зеркало', color: '#4A4A6B' },
  { id: 'sage' as Section, emoji: '💬', label: 'Мудрец', color: '#6B5B4A' },
];

const dailyGreetings = [
  'Рад что ты здесь',
  'Новый день — новая страница',
  'Ты пришёл. Это уже важно',
  'Сегодня хороший день чтобы быть собой',
  'Каждый день — это шанс',
  'Ты на своём месте',
  'Просто дыши. Ты здесь',
  'Мир подождёт. Побудь с собой',
  'Тихий момент только для тебя',
  'Всё начинается с паузы',
  'Ты уже делаешь достаточно',
  'Сегодня ты выбрал себя',
  'Позволь себе просто быть',
  'Этот момент — твой',
];

const nightGreetings = [
  'Тихий вечер. Хорошее время побыть с собой',
  'Ночь — время честности с собой',
  'День заканчивается. Ты справился',
  'Тишина. Самое время для себя',
];

const seasonQuotes: Record<string, string> = {
  spring: '🌸 Весна — это напоминание о том, что после любой зимы приходит обновление',
  summer: '☀️ Лето напоминает нам — жизнь создана для того, чтобы её проживать',
  autumn: '🍂 Осень учит нас красиво отпускать то, что уже не нужно',
  winter: '❄️ Зима — время тишины, в которой слышно самое важное',
};

function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function getGreeting(name: string): { greeting: string; subGreeting: string } {
  const hour = new Date().getHours();
  const day = new Date().getDate();
  
  let greeting = '';
  if (hour >= 5 && hour < 12) greeting = `Доброе утро, ${name}`;
  else if (hour >= 12 && hour < 18) greeting = `Добрый день, ${name}`;
  else if (hour >= 18 && hour < 23) greeting = `Добрый вечер, ${name}`;
  else greeting = `Доброй ночи, ${name}`;

  const isNight = hour >= 23 || hour < 5;
  const subGreeting = isNight
    ? nightGreetings[day % nightGreetings.length]
    : dailyGreetings[day % dailyGreetings.length];

  return { greeting, subGreeting };
}

export default function Home({ onNavigate }: HomeProps) {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const season = getSeason();

  useEffect(() => {
    const saved = localStorage.getItem('mirror_user_name');
    if (saved) setName(saved);
  }, []);

  const { greeting, subGreeting } = getGreeting(name || 'друг');

  return (
    <div style={{ padding: '1.5rem 1rem 6rem', maxWidth: '600px', margin: '0 auto' }}>
      {/* Приветствие */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '2.5rem' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.8rem',
          fontWeight: 600,
          color: isDark ? '#e8d5b7' : '#2c2416',
          marginBottom: '0.5rem',
        }}>
          {greeting}
        </h1>
        <p style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: '0.9rem',
          color: isDark ? '#a89070' : '#8B7355',
          fontStyle: 'italic',
        }}>
          {subGreeting}
        </p>
      </div>

      {/* Цитата Лао-Цзы */}
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        marginBottom: '1rem',
        borderTop: `1px solid ${isDark ? '#2a1a08' : '#e8d5b7'}`,
        borderBottom: `1px solid ${isDark ? '#2a1a08' : '#e8d5b7'}`,
      }}>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1rem',
          fontStyle: 'italic',
          color: isDark ? '#a89070' : '#8B7355',
        }}>
          «Путь в тысячу ли начинается с первого шага»
        </p>
        <p style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: '0.75rem',
          color: isDark ? '#6b5a44' : '#a09080',
          marginTop: '0.3rem',
        }}>
          — Лао-Цзы
        </p>
      </div>

      {/* Сезонная цитата */}
      <div style={{
        textAlign: 'center',
        padding: '0.8rem',
        marginBottom: '1rem',
        background: isDark ? 'rgba(200,146,42,0.05)' : 'rgba(200,146,42,0.08)',
        borderRadius: '12px',
      }}>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: isDark ? '#c8922a' : '#8B6914',
        }}>
          {seasonQuotes[season]}
        </p>
      </div>

      {/* Цитата дня */}
      <DailyQuote />

      {/* Виджет недели */}
      <WeekWidget />

      {/* Полка с книгами */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.2rem',
          fontWeight: 600,
          textAlign: 'center',
          color: isDark ? '#c8922a' : '#5c4a2a',
          marginBottom: '1rem',
        }}>
          Твоя полка
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.8rem',
        }}>
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => onNavigate(book.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '1rem 0.5rem',
                background: isDark ? 'rgba(200,146,42,0.08)' : 'rgba(255,255,255,0.6)',
                border: `1px solid ${isDark ? '#2a1a08' : '#e8d5b7'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span style={{ fontSize: '2rem' }}>{book.emoji}</span>
              <span style={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.7rem',
                color: isDark ? '#a89070' : '#5c4a2a',
              }}>
                {book.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Статистика */}
      <Stats />

      {/* Слоган */}
      <p style={{
        textAlign: 'center',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '0.85rem',
        fontStyle: 'italic',
        color: isDark ? '#6b5a44' : '#a09080',
        marginTop: '1.5rem',
      }}>
        Посмотри на себя. По-настоящему.
      </p>
    </div>
  );
}
