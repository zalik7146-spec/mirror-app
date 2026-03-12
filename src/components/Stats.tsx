import { useTheme } from '../context/ThemeContext';

interface StatsProps {
  onNavigate: (section: any) => void;
}

export default function Stats({ onNavigate }: StatsProps) {
  const { isDark } = useTheme();

  // Собираем статистику
  const diaryEntries = JSON.parse(localStorage.getItem('mirror-diary-entries') || '[]');
  const gratitudeEntries = JSON.parse(localStorage.getItem('mirror-gratitude-entries') || '[]');
  const moodEntries = JSON.parse(localStorage.getItem('mirror-mood-entries') || '[]');
  const sessions = JSON.parse(localStorage.getItem('mirror-sessions') || '[]');
  const practiceCount = parseInt(localStorage.getItem('mirror-practice-count') || '0');

  // Streak — дни подряд
  const getStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let current = new Date(today);

    while (true) {
      const dateStr = current.toISOString().split('T')[0];
      const hasEntry =
        diaryEntries.some((e: any) => e.date?.startsWith(dateStr)) ||
        gratitudeEntries.some((e: any) => e.date?.startsWith(dateStr)) ||
        moodEntries.some((e: any) => e.date?.startsWith(dateStr));

      if (!hasEntry) break;
      streak++;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  };

  const streak = getStreak();
  const totalEntries = diaryEntries.length + gratitudeEntries.length + moodEntries.length;

  const card = (emoji: string, value: string | number, label: string, section?: any) => (
    <div
      onClick={section ? () => onNavigate(section) : undefined}
      style={{
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(44,36,22,0.04)',
        borderRadius: '16px',
        padding: '1rem',
        textAlign: 'center',
        cursor: section ? 'pointer' : 'default',
        border: isDark ? '1px solid rgba(200,146,42,0.1)' : '1px solid rgba(44,36,22,0.08)',
        transition: 'all 0.3s ease',
        flex: '1',
        minWidth: '0',
      }}
    >
      <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{emoji}</div>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '1.6rem',
        fontWeight: '500',
        color: '#c8922a',
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: 'Raleway, sans-serif',
        fontSize: '0.65rem',
        fontWeight: '300',
        color: isDark ? 'rgba(245,240,232,0.5)' : 'rgba(44,36,22,0.5)',
        marginTop: '0.25rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );

  return (
    <div style={{ padding: '0 1rem 0.5rem' }}>
      <div style={{
        fontFamily: 'Raleway, sans-serif',
        fontSize: '0.65rem',
        fontWeight: '400',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(245,240,232,0.35)' : 'rgba(44,36,22,0.35)',
        textAlign: 'center',
        marginBottom: '0.75rem',
      }}>
        твой путь
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {card('🔥', streak > 0 ? streak : '—', streak === 1 ? 'день подряд' : streak > 1 ? 'дня подряд' : 'начни сегодня')}
        {card('📝', totalEntries, 'записей')}
        {card('🛠️', practiceCount, 'практик')}
        {card('🔮', sessions.length, 'сеансов', 'mirror')}
      </div>
    </div>
  );
}
