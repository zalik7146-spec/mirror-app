
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

interface GratitudeEntry {
  id: string
  date: string
  world: string
  people: string
  self: string
  letter: string
}

const PROMPTS = {
  world: [
    'Что сегодня тронуло тебя в мире вокруг?',
    'Какой момент сегодня был особенным?',
    'Что ты заметил сегодня, чего обычно не замечаешь?',
    'Какая мелочь сегодня согрела тебя изнутри?',
    'Что в этом дне было по-настоящему живым?',
  ],
  people: [
    'Кто сегодня был рядом — и что это значило для тебя?',
    'Чьё присутствие ты почувствовал сегодня?',
    'Кто сделал что-то маленькое, но важное?',
    'Кому ты сегодня был благодарен, даже если не сказал этого?',
    'Чей голос, взгляд или слово остались с тобой сегодня?',
  ],
  self: [
    'Что ты сделал для себя сегодня, пусть совсем маленькое?',
    'За что ты можешь похвалить себя сегодня?',
    'Какое качество в себе ты заметил сегодня?',
    'Что ты выдержал сегодня — и это достойно уважения?',
    'Что ты позволил себе сегодня?',
  ],
  letter: [
    'Напиши себе несколько слов. Как близкому другу.',
    'Что ты хочешь сказать себе сегодня?',
    'Какое послание ты хочешь оставить себе на этот вечер?',
  ]
}

const getPrompt = (type: keyof typeof PROMPTS) => {
  const arr = PROMPTS[type]
  const day = new Date().getDate()
  return arr[day % arr.length]
}

export default function Gratitude() {
  const { isDark } = useTheme()
  const [world, setWorld] = useState('')
  const [people, setPeople] = useState('')
  const [self, setSelf] = useState('')
  const [letter, setLetter] = useState('')
  const [saved, setSaved] = useState(false)
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<GratitudeEntry | null>(null)
  const [activeLayer, setActiveLayer] = useState<'world' | 'people' | 'self' | 'letter'>('world')

  useEffect(() => {
    const stored = localStorage.getItem('zerkalo-gratitude')
    if (stored) setEntries(JSON.parse(stored))
  }, [])

  const layers = [
    {
      key: 'world' as const,
      emoji: '🌍',
      label: 'Миру',
      sublabel: 'что снаружи тронуло тебя',
      value: world,
      setValue: setWorld,
      color: isDark ? '#2d4a3e' : '#e8f5e9',
      accent: '#4caf50',
    },
    {
      key: 'people' as const,
      emoji: '🤝',
      label: 'Людям',
      sublabel: 'кто был рядом',
      value: people,
      setValue: setPeople,
      color: isDark ? '#3a3a2e' : '#fff8e1',
      accent: '#ff9800',
    },
    {
      key: 'self' as const,
      emoji: '🪞',
      label: 'Себе',
      sublabel: 'самое важное',
      value: self,
      setValue: setSelf,
      color: isDark ? '#3a2e4a' : '#f3e5f5',
      accent: '#9c27b0',
    },
    {
      key: 'letter' as const,
      emoji: '✉️',
      label: 'Письмо себе',
      sublabel: 'как близкому другу',
      value: letter,
      setValue: setLetter,
      color: isDark ? '#2e3a4a' : '#e3f2fd',
      accent: '#6b8fa3',
    },
  ]

  const handleSave = () => {
    if (!world && !people && !self && !letter) return
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      world, people, self, letter,
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('zerkalo-gratitude', JSON.stringify(updated))
    setWorld(''); setPeople(''); setSelf(''); setLetter('')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setActiveLayer('world')
  }

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('zerkalo-gratitude', JSON.stringify(updated))
    if (selectedEntry?.id === id) setSelectedEntry(null)
  }

  const cardBg = isDark ? 'rgba(30, 24, 18, 0.85)' : 'rgba(250, 247, 242, 0.9)'
  const text = isDark ? '#e8dcc8' : '#2c2416'
  const muted = isDark ? '#b8a882' : '#5c4f3a'

  const currentLayer = layers.find(l => l.key === activeLayer)!

  return (
    <div className="min-h-screen library-bg pb-28 px-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {/* Header */}
      <div className="text-center mb-10 pt-8">
        <span className="text-4xl">🙏</span>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.25rem', color: text, fontWeight: 300, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
          Благодарность
        </h2>
        <p style={{ color: '#8b6914', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic' }}>
          три слоя признательности
        </p>
      </div>

      {/* Layer tabs */}
      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: cardBg, borderRadius: '16px', padding: '0.4rem' }}>
          {layers.map(layer => (
            <button
              key={layer.key}
              onClick={() => setActiveLayer(layer.key)}
              style={{
                flex: 1,
                padding: '0.6rem 0.3rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                background: activeLayer === layer.key ? layer.color : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{layer.emoji}</span>
              <span style={{
                fontSize: '0.65rem',
                color: activeLayer === layer.key ? layer.accent : muted,
                fontWeight: activeLayer === layer.key ? 600 : 400,
              }}>
                {layer.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active layer */}
      <div style={{ maxWidth: '42rem', margin: '0 auto', paddingBottom: '1.5rem' }}>
        <div style={{
          background: currentLayer.color,
          borderRadius: '20px',
          padding: '1.5rem',
          border: `1px solid ${currentLayer.accent}30`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{currentLayer.emoji}</span>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: text, fontWeight: 600 }}>
                Благодарность {currentLayer.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: muted, fontStyle: 'italic' }}>
                {currentLayer.sublabel}
              </div>
            </div>
          </div>

          <p style={{ color: muted, fontSize: '0.85rem', marginBottom: '0.8rem', fontStyle: 'italic' }}>
            {getPrompt(currentLayer.key)}
          </p>

          <textarea
            value={currentLayer.value}
            onChange={e => currentLayer.setValue(e.target.value)}
            placeholder="Пиши свободно..."
            rows={4}
            style={{
              width: '100%',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${currentLayer.accent}40`,
              borderRadius: '12px',
              padding: '1rem',
              color: text,
              fontSize: '0.95rem',
              fontFamily: "'Raleway', sans-serif",
              resize: 'none',
              outline: 'none',
              lineHeight: 1.6,
              boxSizing: 'border-box',
            }}
          />

          {/* Next layer hint */}
          {activeLayer !== 'letter' && (
            <button
              onClick={() => {
                const idx = layers.findIndex(l => l.key === activeLayer)
                setActiveLayer(layers[idx + 1].key)
              }}
              style={{
                marginTop: '0.8rem',
                background: 'none',
                border: 'none',
                color: currentLayer.accent,
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              Следующий слой →
            </button>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {layers.map(layer => (
          <div
            key={layer.key}
            style={{
              width: layer.value ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: layer.value ? layer.accent : (isDark ? '#444' : '#ddd'),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => setActiveLayer(layer.key)}
          />
        ))}
      </div>

      {/* Save button */}
      <div style={{ maxWidth: '42rem', margin: '0 auto', paddingBottom: '2rem' }}>
        <button
          onClick={handleSave}
          disabled={!world && !people && !self && !letter}
          style={{
            width: '100%',
            padding: '1rem',
            background: saved ? '#4a7c6f' : (world || people || self || letter ? 'linear-gradient(135deg, #c8922a, #8b6914)' : (isDark ? 'rgba(30,24,18,0.6)' : 'rgba(200,146,42,0.15)')),
            color: saved ? 'white' : (world || people || self || letter ? '#faf7f2' : muted),
            border: 'none',
            borderRadius: '16px',
            fontSize: '1rem',
            fontFamily: "'Raleway', sans-serif",
            cursor: world || people || self || letter ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            fontWeight: 500,
          }}
        >
          {saved ? '✓ Сохранено с благодарностью' : 'Зафиксировать'}
        </button>
      </div>

      {/* Пустое состояние */}
      {entries.length === 0 && (
        <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: text, fontSize: '1.3rem', marginBottom: '0.75rem' }}>
            Здесь будет твоя благодарность
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: muted, fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.8' }}>
            Даже одна маленькая вещь в день<br />меняет восприятие мира.
          </p>
        </div>
      )}

      {/* History */}
      {entries.length > 0 && (
        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
          <div className="flex items-center gap-4 mb-6">
            <div style={{ height: '1px', background: 'rgba(200, 146, 42, 0.2)', flex: 1 }} />
            <p style={{ color: '#8b6914', fontSize: '0.72rem', letterSpacing: '0.1em', fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase' }}>
              История благодарностей
            </p>
            <div style={{ height: '1px', background: 'rgba(200, 146, 42, 0.2)', flex: 1 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                style={{
                  background: cardBg,
                  borderRadius: '12px',
                  padding: '1rem 1.2rem',
                  cursor: 'pointer',
                  border: '1px solid rgba(200, 146, 42, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '0.3rem' }}>{entry.date}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {entry.world && <span style={{ fontSize: '0.9rem' }}>🌍</span>}
                    {entry.people && <span style={{ fontSize: '0.9rem' }}>🤝</span>}
                    {entry.self && <span style={{ fontSize: '0.9rem' }}>🪞</span>}
                    {entry.letter && <span style={{ fontSize: '0.9rem' }}>✉️</span>}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(entry.id) }}
                  style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: '1.1rem', padding: '0.2rem 0.5rem' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedEntry && (
        <div
          onClick={() => setSelectedEntry(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1.5rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: isDark ? '#1e1812' : '#faf7f2',
              borderRadius: '20px', padding: '2rem',
              width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto',
              border: `1px solid ${isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.15)'}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: text }}>
                {selectedEntry.date}
              </div>
              <button onClick={() => setSelectedEntry(null)} style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            </div>

            {[
              { key: 'world', emoji: '🌍', label: 'Миру', value: selectedEntry.world },
              { key: 'people', emoji: '🤝', label: 'Людям', value: selectedEntry.people },
              { key: 'self', emoji: '🪞', label: 'Себе', value: selectedEntry.self },
              { key: 'letter', emoji: '✉️', label: 'Письмо себе', value: selectedEntry.letter },
            ].filter(l => l.value).map(layer => (
              <div key={layer.key} style={{ marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', color: muted, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{layer.emoji}</span> {layer.label}
                </div>
                <div style={{ color: text, fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                  «{layer.value}»
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
