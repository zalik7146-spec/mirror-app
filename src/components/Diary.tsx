import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface DiaryEntry {
  id: string;
  date: string;
  dateKey: string;
  text: string;
  mood: string;
  mode: string;
  answers?: Record<string, string>;
}

const MOODS = [
  { emoji: '😌', label: 'Спокойно' },
  { emoji: '😔', label: 'Грустно' },
  { emoji: '😤', label: 'Напряжённо' },
  { emoji: '🥰', label: 'Тепло' },
  { emoji: '😰', label: 'Тревожно' },
  { emoji: '✨', label: 'Вдохновлённо' },
];

const SIX_QUESTIONS = [
  { key: 'worry', label: 'Что сейчас тяжело лежит на сердце?', hint: 'Позволь себе это назвать — уже легче' },
  { key: 'joy', label: 'Что сегодня согрело тебя изнутри?', hint: 'Даже маленькое, едва заметное' },
  { key: 'avoid', label: 'От чего ты сегодня уходишь в сторону?', hint: 'Без осуждения — просто замечаем' },
  { key: 'want', label: 'Чего тебе сейчас по-настоящему хочется?', hint: 'Не то, что надо — а то, что хочется' },
  { key: 'grateful', label: 'За что ты можешь сказать себе спасибо сегодня?', hint: 'Ты заслуживаешь собственной благодарности' },
  { key: 'insight', label: 'Что ты сегодня узнал о себе?', hint: 'Любое наблюдение, даже тихое' },
];

const MODES = [
  { id: 'free', label: 'Свободный поток', emoji: '🌊', desc: 'Пиши всё, что приходит — без правил' },
  { id: 'morning', label: 'Утренние страницы', emoji: '🌅', desc: 'Первые мысли дня, поток сознания' },
  { id: 'six', label: 'Шесть вопросов', emoji: '🔍', desc: 'Структурированный взгляд внутрь' },
];

const MORNING_PROMPTS = [
  'Сейчас, в эту минуту, я думаю о...',
  'Доброе утро. Что первым приходит в голову?',
  'Не думай — просто пиши. Что внутри прямо сейчас?',
  'Начни с любого слова. Просто начни.',
];

function getDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonthDays(year: number, month: number) {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export default function Diary() {
  const { isDark } = useTheme();
  const [mode, setMode] = useState('free');
  const [text, setText] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMood, setSelectedMood] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [morningPrompt] = useState(() => MORNING_PROMPTS[Math.floor(Math.random() * MORNING_PROMPTS.length)]);
  const [openEntry, setOpenEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mirror_diary');
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    const hasContent = mode === 'six'
      ? Object.values(answers).some(a => a.trim())
      : text.trim();
    if (!hasContent) return;

    const now = new Date();
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      dateKey: getDayKey(now),
      text: text.trim(),
      mood: selectedMood,
      mode,
      answers: mode === 'six' ? { ...answers } : undefined,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('mirror_diary', JSON.stringify(updated));
    setText('');
    setAnswers({});
    setSelectedMood('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('mirror_diary', JSON.stringify(updated));
  };

  const daysWithEntries = new Set(entries.map(e => e.dateKey));
  const calDays = getMonthDays(calYear, calMonth);
  const todayKey = getDayKey(new Date());

  const filteredEntries = selectedDay
    ? entries.filter(e => e.dateKey === selectedDay)
    : entries;

  const card = {
    background: isDark ? 'rgba(30, 24, 18, 0.85)' : 'rgba(250, 247, 242, 0.9)',
    border: '1px solid rgba(200, 146, 42, 0.15)',
    borderRadius: '12px',
    padding: '24px',
  };

  const textColor = isDark ? '#e8dcc8' : '#2c2416';
  const subColor = isDark ? '#b8a882' : '#5c4f3a';
  const goldColor = '#8b6914';

  return (
    <div className="min-h-screen library-bg pt-8 pb-28 px-6" style={{ opacity: 1 }}>

      {/* Модальное окно просмотра записи */}
      {openEntry && (
        <div
          onClick={() => setOpenEntry(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: isDark ? '#1e1812' : '#faf7f2',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: `1px solid ${isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.15)'}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              animation: 'fadeInUp 0.4s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: goldColor, fontSize: '0.75rem', marginBottom: '4px' }}>{openEntry.date}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {openEntry.mood && (
                    <span style={{ fontSize: '0.82rem', color: subColor }}>
                      {MOODS.find(m => m.label === openEntry.mood)?.emoji} {openEntry.mood}
                    </span>
                  )}
                  {openEntry.mode && openEntry.mode !== 'free' && (
                    <span style={{ fontSize: '0.75rem', color: subColor, opacity: 0.7 }}>
                      · {MODES.find(m => m.id === openEntry.mode)?.emoji} {MODES.find(m => m.id === openEntry.mode)?.label}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpenEntry(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: subColor, cursor: 'pointer', lineHeight: 1 }}
              >×</button>
            </div>

            <div style={{ height: '1px', background: 'rgba(200,146,42,0.15)', marginBottom: '1.5rem' }} />

            {openEntry.mode === 'six' && openEntry.answers ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {SIX_QUESTIONS.filter(q => openEntry.answers![q.key]?.trim()).map(q => (
                  <div key={q.key}>
                    <p style={{ fontSize: '0.78rem', color: goldColor, fontStyle: 'italic', marginBottom: '6px' }}>{q.label}</p>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, lineHeight: '1.8', fontSize: '1.05rem' }}>
                      {openEntry.answers![q.key]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, lineHeight: '1.9', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {openEntry.text}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto">

        {/* Заголовок */}
        <div className="text-center mb-10">
          <span className="text-4xl">📖</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor }} className="text-4xl font-light mt-3 mb-2">
            Дневник
          </h2>
          <p style={{ color: goldColor, fontFamily: 'Cormorant Garamond, serif' }} className="text-lg italic">
            Что я думаю?
          </p>
        </div>

        {/* Режимы */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setText(''); setAnswers({}); }}
                style={{
                  background: mode === m.id
                    ? isDark ? 'rgba(200, 146, 42, 0.15)' : 'rgba(200, 146, 42, 0.1)'
                    : isDark ? 'rgba(30, 24, 18, 0.6)' : 'rgba(250, 247, 242, 0.7)',
                  border: mode === m.id ? '1px solid rgba(200, 146, 42, 0.5)' : '1px solid rgba(200, 146, 42, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{m.emoji}</div>
                <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.72rem', color: mode === m.id ? '#c8922a' : subColor, letterSpacing: '0.05em', fontWeight: mode === m.id ? '600' : '400' }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.78rem', color: subColor, marginTop: '2px', opacity: 0.8 }}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Поле записи */}
        <div className="mb-4">

          {/* Свободный поток */}
          {mode === 'free' && (
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Пиши всё, что приходит. Здесь нет правил и нет осуждения..."
              rows={9}
              style={{
                width: '100%',
                background: isDark ? 'rgba(30, 24, 18, 0.9)' : 'rgba(250, 247, 242, 0.9)',
                border: '1px solid rgba(200, 146, 42, 0.2)',
                borderRadius: '10px',
                padding: '20px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.05rem',
                lineHeight: '1.9',
                color: textColor,
                transition: 'all 0.3s ease',
                resize: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.2)')}
            />
          )}

          {/* Утренние страницы */}
          {mode === 'morning' && (
            <div>
              <div style={{ ...card, marginBottom: '12px', padding: '14px 20px' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '1rem', fontStyle: 'italic' }}>
                  🌅 {morningPrompt}
                </p>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Не редактируй, не думай — просто пиши. Позволь словам течь..."
                rows={9}
                style={{
                  width: '100%',
                  background: isDark ? 'rgba(30, 24, 18, 0.9)' : 'rgba(250, 247, 242, 0.9)',
                  border: '1px solid rgba(200, 146, 42, 0.2)',
                  borderRadius: '10px',
                  padding: '20px',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.05rem',
                  lineHeight: '1.9',
                  color: textColor,
                  transition: 'all 0.3s ease',
                  resize: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.2)')}
              />
            </div>
          )}

          {/* Шесть вопросов */}
          {mode === 'six' && (
            <div className="flex flex-col gap-4">
              {SIX_QUESTIONS.map((q, i) => (
                <div key={q.key}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.05rem', marginBottom: '2px' }}>
                    {i + 1}. {q.label}
                  </p>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '0.82rem', fontStyle: 'italic', marginBottom: '8px', opacity: 0.8 }}>
                    {q.hint}
                  </p>
                  <textarea
                    value={answers[q.key] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                    placeholder="..."
                    rows={2}
                    style={{
                      width: '100%',
                      background: isDark ? 'rgba(30, 24, 18, 0.9)' : 'rgba(250, 247, 242, 0.9)',
                      border: '1px solid rgba(200, 146, 42, 0.15)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1rem',
                      lineHeight: '1.7',
                      color: textColor,
                      transition: 'all 0.3s ease',
                      resize: 'none',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.45)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.15)')}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Настроение */}
        <div className="mb-4">
          <p style={{ color: goldColor, fontSize: '0.72rem', letterSpacing: '0.1em' }} className="uppercase mb-3">
            Как ты себя сейчас чувствуешь?
          </p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => setSelectedMood(selectedMood === m.label ? '' : m.label)}
                style={{
                  background: selectedMood === m.label
                    ? isDark ? 'rgba(200, 146, 42, 0.18)' : 'rgba(200, 146, 42, 0.12)'
                    : isDark ? 'rgba(30, 24, 18, 0.6)' : 'rgba(245, 240, 232, 0.8)',
                  border: selectedMood === m.label ? '1px solid rgba(200, 146, 42, 0.5)' : '1px solid rgba(200, 146, 42, 0.15)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  color: isDark ? '#b8a882' : '#5c4f3a',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопка сохранить */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            style={{
              background: 'none',
              border: '1px solid rgba(200, 146, 42, 0.25)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: goldColor,
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            📅 {showCalendar ? 'Скрыть календарь' : 'Мои записи'}
          </button>

          <div className="flex items-center gap-4">
            {saved && (
              <span style={{ color: '#4a7c6f', fontFamily: 'Cormorant Garamond, serif' }} className="text-sm italic animate-fadeIn">
                ✓ Сохранено
              </span>
            )}
            <button
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #c8922a, #8b6914)',
                color: '#faf7f2',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 28px',
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(200, 146, 42, 0.3)',
                opacity: (mode === 'six' ? Object.values(answers).some(a => a.trim()) : text.trim()) ? 1 : 0.4,
              }}
            >
              Сохранить
            </button>
          </div>
        </div>

        {/* Календарь */}
        {showCalendar && (
          <div className="mb-8" style={{ ...card }}>
            {/* Навигация месяца */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                style={{ background: 'none', border: 'none', color: goldColor, cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px' }}
              >‹</button>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.1rem' }}>
                {MONTHS[calMonth]} {calYear}
              </span>
              <button
                onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                style={{ background: 'none', border: 'none', color: goldColor, cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px' }}
              >›</button>
            </div>

            {/* Дни недели */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', color: goldColor, letterSpacing: '0.05em', padding: '4px 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Дни */}
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEntry = daysWithEntries.has(key);
                const isToday = key === todayKey;
                const isSelected = key === selectedDay;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(isSelected ? null : key)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '50%',
                      border: isToday ? '1px solid rgba(200, 146, 42, 0.6)' : 'none',
                      background: isSelected
                        ? 'rgba(200, 146, 42, 0.3)'
                        : hasEntry
                        ? isDark ? 'rgba(200, 146, 42, 0.12)' : 'rgba(200, 146, 42, 0.08)'
                        : 'transparent',
                      color: hasEntry ? '#c8922a' : isDark ? '#6b5c47' : '#b8a882',
                      fontSize: '0.82rem',
                      fontFamily: 'Raleway, sans-serif',
                      cursor: hasEntry ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      fontWeight: hasEntry ? '600' : '400',
                      position: 'relative',
                    }}
                  >
                    {day}
                    {hasEntry && (
                      <span style={{
                        position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)',
                        width: '3px', height: '3px', borderRadius: '50%', background: '#c8922a',
                      }} />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDay && (
              <div style={{ marginTop: '12px', padding: '10px 0', borderTop: '1px solid rgba(200, 146, 42, 0.1)' }}>
                <p style={{ color: subColor, fontSize: '0.8rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
                  {filteredEntries.length === 0 ? 'Нет записей за этот день' : `Записей за день: ${filteredEntries.length}`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Пустое состояние */}
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '1.3rem', marginBottom: '0.75rem' }}>
              Здесь будут жить твои мысли
            </p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.8' }}>
              Начни с первой записи — просто открой страницу<br />и напиши что есть. Без правил.
            </p>
          </div>
        )}

        {/* Прошлые записи */}
        {filteredEntries.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div style={{ height: '1px', background: 'rgba(200, 146, 42, 0.2)', flex: 1 }} />
              <p style={{ color: goldColor, fontSize: '0.72rem', letterSpacing: '0.1em' }} className="uppercase">
                {selectedDay ? 'Записи за день' : 'Прошлые записи'}
              </p>
              <div style={{ height: '1px', background: 'rgba(200, 146, 42, 0.2)', flex: 1 }} />
            </div>

            <div className="flex flex-col gap-4">
              {filteredEntries.map(entry => (
                <div key={entry.id} onClick={() => setOpenEntry(entry)} style={{ ...card, position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p style={{ color: goldColor, fontSize: '0.72rem' }}>{entry.date}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {entry.mood && (
                          <p style={{ color: subColor, fontSize: '0.78rem' }}>
                            {MOODS.find(m => m.label === entry.mood)?.emoji} {entry.mood}
                          </p>
                        )}
                        {entry.mode && entry.mode !== 'free' && (
                          <p style={{ color: subColor, fontSize: '0.72rem', opacity: 0.7 }}>
                            · {MODES.find(m => m.id === entry.mode)?.emoji} {MODES.find(m => m.id === entry.mode)?.label}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                      style={{ color: 'rgba(92, 79, 58, 0.3)', fontSize: '1.2rem', lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none' }}
                    >×</button>
                  </div>

                  {entry.mode === 'six' && entry.answers ? (
                    <div className="flex flex-col gap-2">
                      {SIX_QUESTIONS.filter(q => entry.answers![q.key]?.trim()).map(q => (
                        <div key={q.key}>
                          <p style={{ fontSize: '0.75rem', color: goldColor, fontStyle: 'italic', marginBottom: '2px' }}>{q.label}</p>
                          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, lineHeight: '1.7', fontSize: '0.98rem' }}>
                            {entry.answers![q.key]}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, lineHeight: '1.8', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                      {entry.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
