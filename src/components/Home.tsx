import { useTheme } from '../context/ThemeContext';
import { useSeason } from '../context/SeasonContext';
import { Section } from '../App';
import DailyQuote from './DailyQuote';
import Stats from './Stats';
import WeekWidget from './WeekWidget';

interface Props { onNavigate: (s: Section) => void; }

const WARM_PHRASES = [
  'Рад что ты здесь.', 'Новый день — новая страница.', 'Ты пришёл. Это уже важно.',
  'Каждый момент — возможность.', 'Дыши. Ты справляешься.', 'Сегодня хороший день чтобы быть собой.',
  'Маленькие шаги тоже считаются.', 'Ты делаешь лучшее что можешь.', 'Сегодня достаточно — быть здесь.',
  'Твои чувства важны.', 'Пауза — тоже движение.', 'Ты заслуживаешь доброты — особенно от себя.',
  'Что-то хорошее уже есть в этом дне.', 'Зеркало ждало тебя.',
];

const NIGHT_PHRASES = [
  'Тихий вечер. Хорошее время побыть с собой.', 'Ночь — время честности с собой.',
  'День прожит. Ты справился.', 'Тишина вечера — пространство для себя.',
];

const SEASON_QUOTES: Record<string, string> = {
  spring: '🌸 Весна — напоминание что после любой зимы приходит обновление',
  summer: '☀️ Лето напоминает нам — жизнь создана чтобы её проживать',
  autumn: '🍂 Осень учит нас отпускать с достоинством',
  winter: '❄️ Зима — время тишины в которой слышно самое важное',
};

const books: { id: Section; emoji: string; title: string; color: string }[] = [
  { id: 'diary', emoji: '📖', title: 'Дневник', color: '#8B7355' },
  { id: 'gratitude', emoji: '🙏', title: 'Благодарность', color: '#7A8B6F' },
  { id: 'mood', emoji: '🌡️', title: 'Состояние', color: '#8B7082' },
  { id: 'workshop', emoji: '🛠️', title: 'Мастерская', color: '#7B8B6F' },
  { id: 'compass', emoji: '🧭', title: 'Компас', color: '#6B7B8B' },
  { id: 'mirror', emoji: '🔮', title: 'Зеркало', color: '#4B5B7B' },
  { id: 'sage', emoji: '💬', title: 'Мудрец', color: '#8B6B4B' },
];

export default function Home({ onNavigate }: Props) {
  const { isDark } = useTheme();
  const { season } = useSeason();
  const hour = new Date().getHours();
  const isNight = hour >= 23 || hour < 5;

  const name = localStorage.getItem('mirror-user-name') || '';
  const lastVisit = localStorage.getItem('mirror-last-visit');
  const today = new Date().toDateString();
  const daysSince = lastVisit ? Math.floor((Date.now() - parseInt(lastVisit)) / 86400000) : 0;
  localStorage.setItem('mirror-last-visit', Date.now().toString());

  const greeting = hour >= 5 && hour < 12 ? 'Доброе утро' : hour >= 12 && hour < 18 ? 'Добрый день' : hour >= 18 && hour < 23 ? 'Добрый вечер' : 'Доброй ночи';
  const phrase = isNight ? NIGHT_PHRASES[new Date().getDay() % NIGHT_PHRASES.length] : WARM_PHRASES[new Date().getDate() % WARM_PHRASES.length];

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      {/* Greeting */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {daysSince >= 2 && (
          <p style={{ color: '#b8860b', fontSize: '0.85rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
            {daysSince === 2 ? 'Вчера тебя не было. Рад что ты вернулся.' : `${daysSince} дня прошло. Ты снова здесь — и это важно.`}
          </p>
        )}
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: 0 }}>
          {greeting}{name ? `, ${name}` : ''}
        </h1>
        <p style={{ color: soft, fontSize: '0.9rem', marginTop: '0.3rem', fontStyle: 'italic' }}>{phrase}</p>
      </div>

      {/* Season quote */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '1rem', textAlign: 'center' }}>
        <p style={{ color: soft, fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>{SEASON_QUOTES[season]}</p>
      </div>

      {/* Daily quote */}
      <DailyQuote />

      {/* Stats */}
      <Stats />

      {/* Week widget */}
      <WeekWidget />

      {/* Lao Tzu */}
      <div style={{ textAlign: 'center', padding: '1rem', marginBottom: '1.5rem' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: soft, fontStyle: 'italic', margin: 0 }}>
          «Познающий других — мудр. Познающий себя — просветлён.»
        </p>
        <p style={{ color: soft, fontSize: '0.75rem', marginTop: '0.3rem' }}>— Лао-Цзы</p>
      </div>

      {/* Books */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {books.map(book => (
          <button key={book.id} onClick={() => onNavigate(book.id)} style={{
            background: card, border: `1px solid ${border}`, borderRadius: '12px',
            padding: '1rem 0.5rem', cursor: 'pointer', transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(184,134,11,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            <span style={{ fontSize: '2rem' }}>{book.emoji}</span>
            <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.75rem', color: text, fontWeight: 600 }}>{book.title}</span>
          </button>
        ))}
      </div>

      {/* Slogan */}
      <p style={{ textAlign: 'center', color: soft, fontSize: '0.8rem', fontStyle: 'italic', marginTop: '1rem' }}>
        Посмотри на себя. По-настоящему.
      </p>
    </div>
  );
}
