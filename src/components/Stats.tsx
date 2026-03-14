import { useTheme } from '../context/ThemeContext';

export default function Stats() {
  const { isDark } = useTheme();

  const diaryEntries = JSON.parse(localStorage.getItem('mirror-diary-entries') || '[]');
  const gratitudeEntries = JSON.parse(localStorage.getItem('mirror-gratitude-entries') || '[]');
  const moodEntries = JSON.parse(localStorage.getItem('mirror-mood-entries') || '[]');
  const sessions = JSON.parse(localStorage.getItem('mirror-sessions') || '[]');
  const practiceCount = parseInt(localStorage.getItem('mirror-practice-count') || '0');

  const getStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const current = new Date(today);
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

  const items = [
    { emoji: '🔥', value: streak, label: 'Дней подряд' },
    { emoji: '📝', value: totalEntries, label: 'Записей' },
    { emoji: '🛠️', value: practiceCount, label: 'Практик' },
    { emoji: '🔮', value: sessions.length, label: 'Сеансов' },
  ];

  if (totalEntries === 0 && practiceCount === 0 && sessions.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(44,36,22,0.04)',
            borderRadius: '16px',
            padding: '0.8rem 0.5rem',
            textAlign: 'center',
            border: isDark ? '1px solid rgba(200,146,42,0.1)' : '1px solid rgba(44,36,22,0.08)',
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{item.emoji}</div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: isDark ? '#c8922a' : '#5c4a2a',
            }}>{item.value}</div>
            <div style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.6rem',
              color: isDark ? '#8a7a64' : '#8B7355',
            }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
