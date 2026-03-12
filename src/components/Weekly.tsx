import { useTheme } from '../context/ThemeContext';

interface DiaryEntry {
  date: string;
  mood: string;
  text: string;
}

interface GratitudeEntry {
  date: string;
  items: string[];
  letter: string;
}

interface MoodEntry {
  date: string;
  wellbeing: number;
  energy: number;
  emotions: string[];
}

const MOOD_LABELS: Record<string, string> = {
  '😊': 'радость',
  '😔': 'грусть',
  '😰': 'тревога',
  '😤': 'злость',
  '😌': 'покой',
  '😕': 'растерянность',
  '🥰': 'любовь',
  '😴': 'усталость',
};

const DAYS_RU = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function formatDateRu(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export default function Weekly() {
  const { isDark } = useTheme();

  const weekDates = getWeekDates();

  // Загружаем данные из localStorage
  const diaryEntries: DiaryEntry[] = JSON.parse(localStorage.getItem('mirror_diary') || '[]');
  const gratitudeEntries: GratitudeEntry[] = JSON.parse(localStorage.getItem('mirror_gratitude') || '[]');
  const moodEntries: MoodEntry[] = JSON.parse(localStorage.getItem('mirror_mood') || '[]');

  // Фильтруем по текущей неделе
  const weekDiary = diaryEntries.filter(e => weekDates.includes(e.date));
  const weekGratitude = gratitudeEntries.filter(e => weekDates.includes(e.date));
  const weekMood = moodEntries.filter(e => weekDates.includes(e.date));

  // Считаем средние значения
  const avgWellbeing = weekMood.length
    ? Math.round(weekMood.reduce((s, e) => s + e.wellbeing, 0) / weekMood.length)
    : null;
  const avgEnergy = weekMood.length
    ? Math.round(weekMood.reduce((s, e) => s + e.energy, 0) / weekMood.length)
    : null;

  // Самые частые эмоции
  const emotionCount: Record<string, number> = {};
  weekMood.forEach(e => e.emotions.forEach(em => {
    emotionCount[em] = (emotionCount[em] || 0) + 1;
  }));
  const topEmotions = Object.entries(emotionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([em]) => em);

  // Настроения из дневника
  const diaryMoods = weekDiary.map(e => e.mood).filter(Boolean);
  const moodCount: Record<string, number> = {};
  diaryMoods.forEach(m => { moodCount[m] = (moodCount[m] || 0) + 1; });

  // Все слова благодарности
  const allGratitudeItems = weekGratitude.flatMap(e => e.items).filter(Boolean);

  // Стили
  const titleColor = isDark ? '#e8dcc8' : '#2c2416';
  const subtitleColor = isDark ? '#b8a882' : '#8b6914';
  const textColor = isDark ? '#d4c5a9' : '#3a3020';
  const mutedColor = isDark ? '#8b7a5e' : '#5c4f3a';
  const cardBg = isDark ? 'rgba(35, 28, 18, 0.95)' : 'rgba(250, 247, 242, 0.95)';
  const cardBorder = isDark ? 'rgba(200, 146, 42, 0.15)' : 'rgba(200, 146, 42, 0.18)';
  const tagBg = isDark ? 'rgba(200, 146, 42, 0.12)' : 'rgba(200, 146, 42, 0.08)';
  const tagBorder = isDark ? 'rgba(200, 146, 42, 0.22)' : 'rgba(200, 146, 42, 0.18)';

  const hasData = weekDiary.length > 0 || weekGratitude.length > 0 || weekMood.length > 0;

  const card = (content: React.ReactNode, _delay = '0s') => (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: '14px',
        padding: '24px 28px',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 20px rgba(44,36,22,0.06)',
        marginBottom: '16px',
      }}
    >
      {content}
    </div>
  );

  const label = (text: string) => (
    <p style={{
      fontSize: '0.65rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#c8922a',
      marginBottom: '14px',
      fontFamily: 'Raleway, sans-serif',
    }}>
      {text}
    </p>
  );

  return (
    <div className="min-h-screen library-bg pt-8 pb-28 px-6">
      <div className="max-w-2xl mx-auto" style={{ opacity: 1 }}>

        {/* Заголовок */}
        <div className="text-center mb-10">
          <span className="text-4xl">📅</span>
          <h2
            style={{ fontFamily: 'Cormorant Garamond, serif', color: titleColor }}
            className="text-4xl font-light mt-3 mb-2"
          >
            Неделя
          </h2>
          <p style={{ color: subtitleColor, fontFamily: 'Cormorant Garamond, serif' }} className="text-lg italic">
            {formatDateRu(weekDates[0])} — {formatDateRu(weekDates[6])}
          </p>
        </div>

        {!hasData ? (
          /* Пустое состояние */
          <div
            className="text-center"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: '16px',
              padding: '48px 32px',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</div>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: textColor,
              fontSize: '1.2rem',
              fontStyle: 'italic',
              marginBottom: '12px',
            }}>
              Эта неделя только начинается
            </p>
            <p style={{ color: mutedColor, fontSize: '0.88rem', lineHeight: 1.7 }}>
              Заходи в Дневник, отмечай Состояние, пиши Благодарности —<br />
              и здесь появится твой еженедельный портрет.
            </p>
          </div>
        ) : (
          <>
            {/* Активность недели */}
            {card(
              <>
                {label('✦ Активность на этой неделе')}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                  {weekDates.map((date, _i) => {
                    const hasDiary = weekDiary.some(e => e.date === date);
                    const hasGratitude = weekGratitude.some(e => e.date === date);
                    const hasMood = weekMood.some(e => e.date === date);
                    const isToday = date === new Date().toISOString().split('T')[0];
                    const count = [hasDiary, hasGratitude, hasMood].filter(Boolean).length;

                    return (
                      <div key={date} style={{ flex: 1, textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '0.65rem',
                            color: isToday ? '#c8922a' : mutedColor,
                            fontFamily: 'Raleway, sans-serif',
                            letterSpacing: '0.06em',
                            marginBottom: '6px',
                            fontWeight: isToday ? 700 : 400,
                          }}
                        >
                          {DAYS_RU[new Date(date).getDay()]}
                        </div>
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: '8px',
                            background: count === 0
                              ? isDark ? 'rgba(200, 146, 42, 0.06)' : 'rgba(200, 146, 42, 0.05)'
                              : count === 1
                              ? 'rgba(200, 146, 42, 0.2)'
                              : count === 2
                              ? 'rgba(200, 146, 42, 0.45)'
                              : 'rgba(200, 146, 42, 0.75)',
                            border: `1px solid ${isToday ? '#c8922a' : 'transparent'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: count > 0 ? (isDark ? '#e8dcc8' : '#3a2810') : mutedColor,
                          }}
                        >
                          {count > 0 ? count : '·'}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: '4px' }}>
                          {new Date(date).getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p style={{ color: mutedColor, fontSize: '0.72rem', marginTop: '12px', textAlign: 'center' }}>
                  Число в квадрате — сколько разделов заполнено за день
                </p>
              </>,
              '0.1s'
            )}

            {/* Внутренний климат */}
            {weekMood.length > 0 && card(
              <>
                {label('🌡️ Внутренний климат недели')}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: mutedColor, fontSize: '0.8rem', marginBottom: '6px' }}>Самочувствие</p>
                    <div style={{
                      height: '8px',
                      background: isDark ? 'rgba(200, 146, 42, 0.1)' : 'rgba(200, 146, 42, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${(avgWellbeing || 0) * 10}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #c8922a, #e8b84b)',
                        borderRadius: '4px',
                        transition: 'width 1s ease',
                      }} />
                    </div>
                    <p style={{ color: textColor, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', marginTop: '4px' }}>
                      {avgWellbeing}/10
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: mutedColor, fontSize: '0.8rem', marginBottom: '6px' }}>Энергия</p>
                    <div style={{
                      height: '8px',
                      background: isDark ? 'rgba(200, 146, 42, 0.1)' : 'rgba(200, 146, 42, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${(avgEnergy || 0) * 10}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #5a7a2e, #8ab44e)',
                        borderRadius: '4px',
                        transition: 'width 1s ease',
                      }} />
                    </div>
                    <p style={{ color: textColor, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', marginTop: '4px' }}>
                      {avgEnergy}/10
                    </p>
                  </div>
                </div>

                {topEmotions.length > 0 && (
                  <>
                    <p style={{ color: mutedColor, fontSize: '0.8rem', marginBottom: '8px' }}>Преобладающие эмоции</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {topEmotions.map(em => (
                        <span key={em} style={{
                          background: tagBg,
                          border: `1px solid ${tagBorder}`,
                          borderRadius: '20px',
                          padding: '4px 12px',
                          fontSize: '0.85rem',
                          color: textColor,
                          fontFamily: 'Cormorant Garamond, serif',
                        }}>
                          {em} {MOOD_LABELS[em] || em}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </>,
              '0.2s'
            )}

            {/* Дневник недели */}
            {weekDiary.length > 0 && card(
              <>
                {label('📖 Из дневника этой недели')}
                <p style={{ color: mutedColor, fontSize: '0.8rem', marginBottom: '12px' }}>
                  {weekDiary.length} {weekDiary.length === 1 ? 'запись' : weekDiary.length < 5 ? 'записи' : 'записей'} за неделю
                </p>
                {weekDiary.slice(-3).reverse().map((entry, idx) => (
                  <div key={idx} style={{
                    borderLeft: `2px solid rgba(200, 146, 42, 0.3)`,
                    paddingLeft: '14px',
                    marginBottom: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1rem' }}>{entry.mood}</span>
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>
                        {formatDateRu(entry.date)}
                      </span>
                    </div>
                    <p style={{
                      color: textColor,
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {entry.text}
                    </p>
                  </div>
                ))}
              </>,
              '0.3s'
            )}

            {/* Благодарности */}
            {allGratitudeItems.length > 0 && card(
              <>
                {label('🙏 За что ты был благодарен')}
                <p style={{ color: mutedColor, fontSize: '0.8rem', marginBottom: '12px' }}>
                  {allGratitudeItems.length} {allGratitudeItems.length === 1 ? 'вещь' : 'вещи'} за неделю
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allGratitudeItems.filter(Boolean).map((item, i) => (
                    <span key={i} style={{
                      background: tagBg,
                      border: `1px solid ${tagBorder}`,
                      borderRadius: '20px',
                      padding: '6px 14px',
                      fontSize: '0.88rem',
                      color: textColor,
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </>,
              '0.4s'
            )}

            {/* Рефлексия */}
            {card(
              <>
                {label('🪞 Вопрос для рефлексии')}
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  color: textColor,
                  fontSize: '1.15rem',
                  lineHeight: 1.9,
                  fontStyle: 'italic',
                  marginBottom: '20px',
                }}>
                  {weekDiary.length === 0
                    ? 'Что ты замечаешь в себе прямо сейчас — тихо, без осуждения? Что эта неделя хотела тебе сказать?'
                    : avgWellbeing !== null && avgWellbeing < 5
                    ? 'Эта неделя потребовала от тебя усилий. Что помогло тебе устоять? Что ты узнал о своей силе?'
                    : weekGratitude.length === 0
                    ? 'Прежде чем неделя закончится — есть хоть одна маленькая вещь, за которую ты можешь сказать спасибо?'
                    : allGratitudeItems.length > 3
                    ? 'Ты замечал хорошее на этой неделе. Что из этого ты хочешь намеренно создать снова?'
                    : 'Ты был здесь. Ты справлялся. Что ты хочешь взять с собой в следующую неделю?'}
                </p>
                <div style={{
                  borderTop: `1px solid ${isDark ? 'rgba(200, 146, 42, 0.1)' : 'rgba(200, 146, 42, 0.12)'}`,
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <span style={{ fontSize: '1rem' }}>🌱</span>
                  <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    color: isDark ? 'rgba(184, 168, 130, 0.6)' : 'rgba(92, 79, 58, 0.55)',
                    fontSize: '0.88rem',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                  }}>
                    Каждую неделю ты делаешь шаг. Иногда большой, иногда едва заметный. Но каждый имеет значение.
                  </p>
                </div>
              </>,
              '0.5s'
            )}
          </>
        )}
      </div>
    </div>
  );
}
