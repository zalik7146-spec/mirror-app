import { useTheme } from '../context/ThemeContext';

export default function WeekWidget() {
  const { isDark } = useTheme();

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const diaryEntries = JSON.parse(localStorage.getItem('mirror-diary-entries') || '[]');
  const gratitudeEntries = JSON.parse(localStorage.getItem('mirror-gratitude-entries') || '[]');
  const moodEntries = JSON.parse(localStorage.getItem('mirror-mood-entries') || '[]');

  const weekDays = days.map((day, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = i + 1 === (dayOfWeek === 0 ? 7 : dayOfWeek);
    const isFuture = date > today;

    const hasEntry =
      diaryEntries.some((e: any) => e.date?.startsWith(dateStr)) ||
      gratitudeEntries.some((e: any) => e.date?.startsWith(dateStr)) ||
      moodEntries.some((e: any) => e.date?.startsWith(dateStr));

    return { day, isToday, isFuture, hasEntry };
  });

  return (
    <div style={{ padding: '0 1rem 1rem' }}>
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
        эта неделя
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.3rem',
      }}>
        {weekDays.map(({ day, isToday, isFuture, hasEntry }) => (
          <div key={day} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            <div style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.6rem',
              fontWeight: '400',
              color: isToday
                ? '#c8922a'
                : isDark ? 'rgba(245,240,232,0.4)' : 'rgba(44,36,22,0.4)',
              letterSpacing: '0.05em',
            }}>{day}</div>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: hasEntry
                ? 'linear-gradient(135deg, #c8922a, #e8b84b)'
                : isFuture
                  ? 'transparent'
                  : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(44,36,22,0.06)',
              border: isToday
                ? '2px solid #c8922a'
                : hasEntry
                  ? 'none'
                  : isDark
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(44,36,22,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              transition: 'all 0.3s ease',
            }}>
              {hasEntry ? '✓' : isToday ? '·' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
