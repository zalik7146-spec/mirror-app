import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

interface DiarySection {
  id: string
  icon: string
  question: string
  placeholder: string
  color: string
}

interface DiaryEntry {
  id: string
  date: string
  mood: string
  moodColor: string
  sections: { [key: string]: string }
  timestamp: number
}

const SECTIONS: DiarySection[] = [
  {
    id: 'morning',
    icon: '🌅',
    question: 'Как начался твой день?',
    placeholder: 'Первые мысли, ощущения, настроение с утра...',
    color: '#F59E0B'
  },
  {
    id: 'mind',
    icon: '💭',
    question: 'Что сейчас на уме?',
    placeholder: 'Мысли, которые крутятся в голове...',
    color: '#8B5CF6'
  },
  {
    id: 'moment',
    icon: '✨',
    question: 'Момент который запомнится',
    placeholder: 'Что-то маленькое или большое, что тронуло...',
    color: '#10B981'
  },
  {
    id: 'evening',
    icon: '🌙',
    question: 'Как заканчивается день?',
    placeholder: 'Итог дня, ощущение, с чем ложишься спать...',
    color: '#3B82F6'
  }
]

const MOODS = [
  { emoji: '😌', label: 'Спокойно', color: '#10B981' },
  { emoji: '😊', label: 'Хорошо', color: '#F59E0B' },
  { emoji: '🥰', label: 'Радостно', color: '#EC4899' },
  { emoji: '😔', label: 'Грустно', color: '#6366F1' },
  { emoji: '😰', label: 'Тревожно', color: '#EF4444' },
  { emoji: '😤', label: 'Раздражённо', color: '#F97316' },
  { emoji: '😴', label: 'Устало', color: '#8B5CF6' },
  { emoji: '🤔', label: 'Задумчиво', color: '#14B8A6' },
]

const getDayName = () => {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  return days[new Date().getDay()]
}

const getDateStr = () => {
  return new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getSeason = () => {
  const m = new Date().getMonth()
  if (m >= 2 && m <= 4) return '🌸 Весна'
  if (m >= 5 && m <= 7) return '☀️ Лето'
  if (m >= 8 && m <= 10) return '🍂 Осень'
  return '❄️ Зима'
}

export default function Diary() {
  const { isDark } = useTheme()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list')
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [mood, setMood] = useState('')
  const [moodColor, setMoodColor] = useState('')
  const [sections, setSections] = useState<{ [key: string]: string }>({})
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [showMoodPicker, setShowMoodPicker] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('mirror-diary-entries')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  const bg = isDark ? '#1a1a2e' : '#faf7f2'
  const card = isDark ? '#16213e' : '#ffffff'
  const text = isDark ? '#e8d5b7' : '#3d2b1f'
  const sub = isDark ? '#a89070' : '#8b7355'
  const border = isDark ? '#2a2a4a' : '#e8ddd0'

  const goNext = () => {
    if (animating) return
    setDirection('next')
    setAnimating(true)
    setTimeout(() => {
      setCurrentSection(prev => prev + 1)
      setAnimating(false)
    }, 300)
  }

  const goPrev = () => {
    if (animating) return
    setDirection('prev')
    setAnimating(true)
    setTimeout(() => {
      setCurrentSection(prev => prev - 1)
      setAnimating(false)
    }, 300)
  }

  const startNew = () => {
    setMood('')
    setMoodColor('')
    setSections({})
    setCurrentSection(0)
    setShowMoodPicker(true)
    setView('new')
  }

  const saveEntry = () => {
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: getDateStr(),
      mood,
      moodColor,
      sections,
      timestamp: Date.now()
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('mirror-diary-entries', JSON.stringify(updated))
    setSelectedEntry(entry)
    setView('detail')
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('mirror-diary-entries', JSON.stringify(updated))
  }

  const filledSections = SECTIONS.filter(s => sections[s.id]?.trim()).length
  const progress = filledSections / SECTIONS.length

  // DETAIL VIEW
  if (view === 'detail' && selectedEntry) {
    return (
      <div style={{ minHeight: '100vh', background: bg, paddingBottom: '6rem' }}>
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <button onClick={() => setView('list')} style={{ color: sub, fontFamily: 'Raleway', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}>
            ← Назад
          </button>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selectedEntry.mood}</div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: text }}>{selectedEntry.date}</div>
          </div>
          {SECTIONS.map(s => selectedEntry.sections[s.id] && (
            <div key={s.id} style={{ background: card, borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: s.color }}>{s.question}</span>
              </div>
              <p style={{ fontFamily: 'Raleway', color: text, lineHeight: 1.7, margin: 0 }}>{selectedEntry.sections[s.id]}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // NEW ENTRY VIEW
  if (view === 'new') {
    const section = SECTIONS[currentSection]

    return (
      <div style={{ minHeight: '100vh', background: bg, paddingBottom: '6rem' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setView('list')} style={{ color: sub, fontFamily: 'Raleway', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← Отмена
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', color: text }}>{getDayName()}</div>
              <div style={{ fontFamily: 'Raleway', fontSize: '0.75rem', color: sub }}>{getSeason()}</div>
            </div>
            {filledSections > 0 && (
              <button onClick={saveEntry} style={{ color: '#c9a96e', fontFamily: 'Raleway', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Сохранить
              </button>
            )}
            {filledSections === 0 && <div style={{ width: '4rem' }} />}
          </div>

          {/* Progress */}
          {!showMoodPicker && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                {SECTIONS.map((s, i) => (
                  <button key={s.id} onClick={() => {
                    setDirection(i > currentSection ? 'next' : 'prev')
                    setCurrentSection(i)
                  }} style={{
                    width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: `2px solid ${i === currentSection ? s.color : border}`,
                    background: sections[s.id]?.trim() ? s.color : (i === currentSection ? `${s.color}20` : 'transparent'),
                    cursor: 'pointer', fontSize: '1rem', transition: 'all 0.3s'
                  }}>
                    {s.icon}
                  </button>
                ))}
              </div>
              <div style={{ height: '3px', background: border, borderRadius: '2px' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9a96e, #d4af85)', borderRadius: '2px', width: `${progress * 100}%`, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Mood Picker */}
        {showMoodPicker && (
          <div style={{ padding: '2rem 1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: text, marginBottom: '0.5rem' }}>
                Как ты себя сейчас чувствуешь?
              </div>
              <div style={{ fontFamily: 'Raleway', fontSize: '0.9rem', color: sub }}>{getDateStr()}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {MOODS.map(m => (
                <button key={m.label} onClick={() => {
                  setMood(m.emoji)
                  setMoodColor(m.color)
                  setTimeout(() => setShowMoodPicker(false), 300)
                }} style={{
                  background: mood === m.emoji ? `${m.color}30` : card,
                  border: `2px solid ${mood === m.emoji ? m.color : border}`,
                  borderRadius: '1rem', padding: '1rem 0.5rem', cursor: 'pointer',
                  transition: 'all 0.3s', transform: mood === m.emoji ? 'scale(1.05)' : 'scale(1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{m.emoji}</div>
                  <div style={{ fontFamily: 'Raleway', fontSize: '0.7rem', color: sub }}>{m.label}</div>
                </button>
              ))}
            </div>
            {mood && (
              <button onClick={() => setShowMoodPicker(false)} style={{
                width: '100%', marginTop: '1.5rem', padding: '1rem',
                background: 'linear-gradient(135deg, #c9a96e, #d4af85)',
                color: '#fff', border: 'none', borderRadius: '1rem',
                fontFamily: 'Raleway', fontSize: '1rem', cursor: 'pointer', fontWeight: 600
              }}>
                Далее →
              </button>
            )}
          </div>
        )}

        {/* Section */}
        {!showMoodPicker && (
          <div style={{
            padding: '2rem 1.5rem',
            opacity: animating ? 0 : 1,
            transform: animating ? (direction === 'next' ? 'translateX(30px)' : 'translateX(-30px)') : 'translateX(0)',
            transition: 'all 0.3s ease'
          }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '4rem', height: '4rem', borderRadius: '50%', margin: '0 auto 1rem',
                background: `${section.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', border: `2px solid ${section.color}40`
              }}>
                {section.icon}
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: text, lineHeight: 1.3 }}>
                {section.question}
              </div>
            </div>

            {/* Text Area */}
            <div style={{
              background: card, borderRadius: '1.5rem', padding: '1.5rem',
              border: `2px solid ${sections[section.id]?.trim() ? section.color : border}`,
              transition: 'border-color 0.3s', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <textarea
                value={sections[section.id] || ''}
                onChange={e => setSections(prev => ({ ...prev, [section.id]: e.target.value }))}
                placeholder={section.placeholder}
                rows={6}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                  fontFamily: 'Raleway', fontSize: '1rem', color: text, lineHeight: 1.8
                }}
              />
              {sections[section.id] && (
                <div style={{ textAlign: 'right', fontFamily: 'Raleway', fontSize: '0.75rem', color: sub, marginTop: '0.5rem' }}>
                  {sections[section.id].split(' ').filter(Boolean).length} слов
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {currentSection > 0 && (
                <button onClick={goPrev} style={{
                  flex: 1, padding: '1rem', background: card, border: `1px solid ${border}`,
                  borderRadius: '1rem', fontFamily: 'Raleway', color: sub, cursor: 'pointer', fontSize: '1rem'
                }}>
                  ← Назад
                </button>
              )}
              {currentSection < SECTIONS.length - 1 ? (
                <button onClick={goNext} style={{
                  flex: 2, padding: '1rem',
                  background: `linear-gradient(135deg, ${section.color}, ${section.color}cc)`,
                  border: 'none', borderRadius: '1rem', fontFamily: 'Raleway',
                  color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 600
                }}>
                  Следующий вопрос →
                </button>
              ) : (
                <button onClick={saveEntry} style={{
                  flex: 2, padding: '1rem',
                  background: 'linear-gradient(135deg, #c9a96e, #d4af85)',
                  border: 'none', borderRadius: '1rem', fontFamily: 'Raleway',
                  color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 600
                }}>
                  Сохранить страницу ✓
                </button>
              )}
            </div>

            {/* Skip */}
            <button onClick={currentSection < SECTIONS.length - 1 ? goNext : saveEntry} style={{
              width: '100%', marginTop: '0.75rem', padding: '0.5rem',
              background: 'none', border: 'none', fontFamily: 'Raleway',
              fontSize: '0.85rem', color: sub, cursor: 'pointer'
            }}>
              {currentSection < SECTIONS.length - 1 ? 'Пропустить этот вопрос' : 'Завершить без этого ответа'}
            </button>
          </div>
        )}
      </div>
    )
  }

  // LIST VIEW
  return (
    <div style={{ minHeight: '100vh', background: bg, paddingBottom: '6rem' }}>
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: text, margin: '0 0 0.25rem' }}>Дневник</h1>
          <p style={{ fontFamily: 'Raleway', fontSize: '0.9rem', color: sub, margin: 0 }}>Страницы твоей жизни</p>
        </div>

        {/* New Entry Button */}
        <button onClick={startNew} style={{
          width: '100%', padding: '1.25rem',
          background: 'linear-gradient(135deg, #c9a96e, #d4af85)',
          border: 'none', borderRadius: '1.25rem', cursor: 'pointer',
          marginBottom: '2rem', boxShadow: '0 4px 20px rgba(201,169,110,0.3)'
        }}>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', color: '#fff', marginBottom: '0.25rem' }}>
            + Новая страница
          </div>
          <div style={{ fontFamily: 'Raleway', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
            {getDayName()}, {getDateStr()}
          </div>
        </button>

        {/* Entries */}
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: text, marginBottom: '0.5rem' }}>
              Здесь будут жить твои страницы
            </div>
            <div style={{ fontFamily: 'Raleway', fontSize: '0.9rem', color: sub, lineHeight: 1.6 }}>
              Каждая запись — момент твоей жизни.<br />Начни с первой страницы.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: text, marginBottom: '1rem' }}>
              {entries.length} {entries.length === 1 ? 'страница' : entries.length < 5 ? 'страницы' : 'страниц'}
            </div>
            {entries.map((entry, i) => {
              const filled = SECTIONS.filter(s => entry.sections[s.id]?.trim())
              return (
                <div key={entry.id} onClick={() => { setSelectedEntry(entry); setView('detail') }} style={{
                  background: card, borderRadius: '1.25rem', padding: '1.25rem',
                  marginBottom: '1rem', cursor: 'pointer', border: `1px solid ${border}`,
                  transition: 'all 0.3s', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  animation: `fadeIn 0.4s ease ${i * 0.05}s both`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <div style={{
                        width: '3rem', height: '3rem', borderRadius: '50%',
                        background: entry.moodColor ? `${entry.moodColor}20` : '#c9a96e20',
                        border: `2px solid ${entry.moodColor || '#c9a96e'}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
                      }}>
                        {entry.mood || '📖'}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: text }}>{entry.date}</div>
                        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {filled.map(s => (
                            <span key={s.id} style={{ fontSize: '0.8rem' }}>{s.icon}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteEntry(entry.id) }} style={{
                      background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: '1rem', padding: '0.25rem'
                    }}>×</button>
                  </div>
                  {filled[0] && (
                    <div style={{
                      marginTop: '0.75rem', fontFamily: 'Raleway', fontSize: '0.85rem', color: sub,
                      lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                      {entry.sections[filled[0].id]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
