import { useTheme } from '../context/ThemeContext';
import DailyQuote from './DailyQuote';
import Stats from './Stats';
import WeekWidget from './WeekWidget';
import { Section } from '../App';

interface ShelfBook {
  id: Section;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  spine: string;
}

const books: ShelfBook[] = [
  {
    id: 'diary',
    icon: '📖',
    title: 'Дневник',
    subtitle: 'Что я думаю?',
    color: '#2d4a3e',
    spine: '#1e3329',
  },
  {
    id: 'workshop',
    icon: '🛠️',
    title: 'Мастерская',
    subtitle: 'Практики для себя',
    color: '#7a5c2e',
    spine: '#5c4420',
  },
  {
    id: 'gratitude',
    icon: '🙏',
    title: 'Благодарность',
    subtitle: 'Что я ценю?',
    color: '#4a3a6b',
    spine: '#352a4f',
  },
  {
    id: 'mood',
    icon: '🌡️',
    title: 'Состояние',
    subtitle: 'Каков я сегодня?',
    color: '#8b3a3a',
    spine: '#6b2c2c',
  },
  {
    id: 'sage',
    icon: '💬',
    title: 'Мудрец',
    subtitle: 'Что мне нужно услышать?',
    color: '#3a5a7a',
    spine: '#2a4460',
  },
  {
    id: 'weekly',
    icon: '📅',
    title: 'Неделя',
    subtitle: 'Мой еженедельный обзор',
    color: '#5a4a2a',
    spine: '#3e3018',
  },
  {
    id: 'mirror',
    icon: '🔮',
    title: 'Зеркало',
    subtitle: 'Посмотри внутрь',
    color: '#1a2a3a',
    spine: '#0f1a26',
  },
];

interface Props {
  onNavigate: (s: Section) => void;
}

export default function Home({ onNavigate }: Props) {
  const { isDark } = useTheme();
  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const userName = localStorage.getItem('mirror_user_name') || '';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : hour < 22 ? 'Добрый вечер' : 'Доброй ночи';

  return (
    <div className="min-h-screen library-bg pt-12 pb-28 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Приветствие */}
        <div className="text-center mb-16">
          <p
            style={{ color: '#8b6914', fontFamily: 'Raleway, sans-serif', letterSpacing: '0.12em' }}
            className="text-xs uppercase mb-4"
          >
            {today}
          </p>
          <h1
            style={{ fontFamily: 'Cormorant Garamond, serif', color: isDark ? '#e8dcc8' : '#2c2416', lineHeight: 1.15 }}
            className="text-5xl md:text-7xl font-light mb-6"
          >
            Зеркало
          </h1>
          {userName && (
            <p
              className="text-2xl font-light mb-2"
              style={{ animationFillMode: 'forwards', animationDelay: '0.2s', color: '#c8922a', fontFamily: 'Cormorant Garamond, serif' }}
            >
              {greeting}, {userName}
            </p>
          )}
          <p
            style={{ color: isDark ? '#b8a882' : '#5c4f3a', fontFamily: 'Cormorant Garamond, serif' }}
            className="text-xl md:text-2xl font-light italic"
            >
            Посмотри на себя. По-настоящему.
          </p>

          {/* Разделитель */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #c8922a)', width: '80px' }} />
            <span style={{ color: '#c8922a', fontSize: '18px' }}>✦</span>
            <div style={{ height: '1px', background: 'linear-gradient(to left, transparent, #c8922a)', width: '80px' }} />
          </div>
        </div>

        {/* Вступительная цитата */}
        <div
          className="text-center mb-20"
          style={{ animationFillMode: 'forwards' }}
        >
          <blockquote
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: isDark ? '#b8a882' : '#5c4f3a',
              fontSize: '1.2rem',
              lineHeight: 1.8,
              maxWidth: '520px',
              margin: '0 auto',
            }}
            className="italic"
          >
            «Путешествие длиной в тысячу миль<br />
            начинается с одного шага внутрь себя»
          </blockquote>
          <p style={{ color: '#8b6914', fontSize: '0.8rem', letterSpacing: '0.08em' }} className="mt-4 uppercase">
            Лао-Цзы
          </p>
        </div>

        {/* Цитата дня */}
        <DailyQuote />

        {/* Полка с книгами */}
        <div className="mb-6">
          <p
            style={{ fontFamily: 'Cormorant Garamond, serif', color: isDark ? '#b8a882' : '#5c4f3a' }}
            className="text-center text-lg mb-10 italic"
          >
            Выбери, какую книгу открыть сегодня
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {books.map((book, i) => (
              <button
                key={book.id}
                onClick={() => onNavigate(book.id)}
                className="group text-left card-hover"
                style={{
                  animationDelay: `${0.6 + i * 0.1}s`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Корешок книги */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${book.color} 0%, ${book.spine} 100%)`,
                    borderRadius: '4px 8px 8px 4px',
                    boxShadow: `3px 6px 20px rgba(0,0,0,0.2), inset -2px 0 6px rgba(0,0,0,0.15)`,
                    transition: 'all 0.4s ease',
                    minHeight: '160px',
                  }}
                  className="w-full flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden"
                >
                  {/* Блик на книге */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '30%',
                      height: '100%',
                      background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)',
                      borderRadius: '4px 0 0 4px',
                    }}
                  />
                  <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {book.icon}
                  </span>
                  <div
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(255,255,255,0.95)' }}
                    className="text-center"
                  >
                    <div className="text-base font-semibold leading-tight">{book.title}</div>
                    <div className="text-xs mt-1 opacity-70 font-light">{book.subtitle}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Нижняя полка — декоративная линия */}
        <div
          style={{
            height: '12px',
            background: 'linear-gradient(to bottom, #8b6914, #5c4420)',
            borderRadius: '2px',
            boxShadow: '0 4px 12px rgba(139, 105, 20, 0.3)',
            marginTop: '8px',
          }}
        />

        {/* Виджет недели и статистика */}
        <div style={{
          marginTop: '2rem',
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(44,36,22,0.03)',
          borderRadius: '20px',
          padding: '1.25rem 0 0.5rem',
          border: isDark ? '1px solid rgba(200,146,42,0.08)' : '1px solid rgba(44,36,22,0.06)',
        }}>
          <WeekWidget />
          <div style={{ height: '1px', background: isDark ? 'rgba(200,146,42,0.1)' : 'rgba(44,36,22,0.06)', margin: '0.75rem 1rem' }} />
          <Stats onNavigate={onNavigate} />
        </div>

        {/* Дополнительная мотивация */}
        <div className="text-center mt-12 pb-4">
          <p style={{ color: isDark ? '#8b6914' : '#8b6914', fontFamily: 'Cormorant Garamond, serif' }} className="text-lg italic">
            Это твоё пространство. Здесь нет правил. Только ты.
          </p>
        </div>
      </div>
    </div>
  );
}
