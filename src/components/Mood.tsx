import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import EmotionWheel from './EmotionWheel';

interface MoodLog {
  id: string;
  date: string;
  score: number;
  energy: number;
  emotions: string[];
  note: string;
}

export default function Mood() {
  const { isDark } = useTheme();
  const [score, setScore] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savedScore, setSavedScore] = useState(5);

  const getWarmMessage = (n: number) => {
    if (n <= 2) return { emoji: '🤍', text: 'Сегодня тяжело. Это честно.', sub: 'Позволь себе просто быть. Ты не обязан быть в порядке.' };
    if (n <= 4) return { emoji: '🌧️', text: 'Непростой день.', sub: 'Это тоже часть жизни. Ты справляешься — даже если не чувствуешь этого.' };
    if (n <= 6) return { emoji: '🌿', text: 'Обычный день.', sub: 'В тишине и обычности тоже есть своя ценность.' };
    if (n <= 8) return { emoji: '☀️', text: 'Хороший день.', sub: 'Замечай это. Такие дни важно помнить.' };
    return { emoji: '✨', text: 'Ты светишься сегодня.', sub: 'Береги это состояние — и возвращайся к нему в памяти.' };
  };

  useEffect(() => {
    const stored = localStorage.getItem('mirror_mood');
    if (stored) setLogs(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    const log: MoodLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
      }),
      score, energy, emotions, note: note.trim(),
    };
    const updated = [log, ...logs];
    setLogs(updated);
    localStorage.setItem('mirror_mood', JSON.stringify(updated));
    setSavedScore(score);
    setScore(5); setEnergy(5); setEmotions([]); setNote('');
    setSaved(true);
    setShowModal(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem('mirror_mood', JSON.stringify(updated));
  };

  const getMoodLabel = (n: number) => {
    if (n <= 2) return 'Очень тяжело';
    if (n <= 4) return 'Непросто';
    if (n <= 6) return 'Нейтрально';
    if (n <= 8) return 'Хорошо';
    return 'Отлично';
  };

  const getMoodColor = (n: number) => {
    if (n <= 2) return '#8b3a3a';
    if (n <= 4) return '#7a5c2e';
    if (n <= 6) return '#5c4f3a';
    if (n <= 8) return '#4a7c6f';
    return '#2d4a3e';
  };

  const card = {
    background: isDark ? 'rgba(30, 24, 18, 0.85)' : 'rgba(250, 247, 242, 0.9)',
    border: '1px solid rgba(200, 146, 42, 0.15)',
    borderRadius: '10px',
    padding: '28px',
    transition: 'background 0.4s ease',
  };

  const textColor = isDark ? '#e8dcc8' : '#2c2416';
  const subColor = isDark ? '#b8a882' : '#5c4f3a';
  const goldColor = '#8b6914';

  return (
    <div className="min-h-screen library-bg pt-8 pb-28 px-6">

      {/* Модальное окно тёплой обратной связи */}
      {showModal && (() => {
        const msg = getWarmMessage(savedScore);
        return (
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: isDark ? '#1e1812' : '#faf7f2',
                borderRadius: '20px',
                padding: '2.5rem 2rem',
                maxWidth: '340px',
                width: '100%',
                textAlign: 'center',
                border: `1px solid ${isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.15)'}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                animation: 'fadeInUp 0.4s ease',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{msg.emoji}</div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                color: isDark ? '#e8d5b0' : '#2c2416',
                marginBottom: '0.75rem',
                fontWeight: 300,
              }}>{msg.text}</h3>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                color: isDark ? '#b8a882' : '#5c4f3a',
                fontStyle: 'italic',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}>{msg.sub}</p>
              <button
                onClick={() => setShowModal(false)}
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
                }}
              >
                Благодарю
              </button>
            </div>
          </div>
        );
      })()}
      <div className="max-w-2xl mx-auto">

        {/* Заголовок */}
        <div className="text-center mb-12">
          <span className="text-4xl">🌡️</span>
          <h2
            style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor }}
            className="text-4xl font-light mt-3 mb-2"
          >
            Состояние
          </h2>
          <p style={{ color: goldColor, fontFamily: 'Cormorant Garamond, serif' }} className="text-lg italic">
            Каков я сегодня?
          </p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Общее самочувствие */}
          <div>
            <div style={card}>
              <p style={{ color: goldColor, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
                Общее самочувствие
              </p>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '0.9rem' }}>Тяжело</span>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', color: getMoodColor(score), fontSize: '2.5rem', fontWeight: 300 }}>
                    {score}
                  </span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', color: goldColor, fontSize: '0.95rem' }} className="block">{getMoodLabel(score)}</span>
                </div>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '0.9rem' }}>Отлично</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={score}
                onChange={e => setScore(Number(e.target.value))}
                style={{ width: '100%', accentColor: getMoodColor(score), cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Уровень энергии */}
          <div>
            <div style={card}>
              <p style={{ color: goldColor, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
                Уровень энергии
              </p>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '0.9rem' }}>😴 Истощён</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c8922a', fontSize: '2.5rem', fontWeight: 300 }}>
                  {energy}
                </span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', color: subColor, fontSize: '0.9rem' }}>⚡ Полон сил</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={energy}
                onChange={e => setEnergy(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#c8922a', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Колесо эмоций */}
          <div>
            <p style={{ color: goldColor, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Колесо эмоций — что сейчас присутствует?
            </p>
            <EmotionWheel selected={emotions} onChange={setEmotions} />
          </div>

          {/* Заметка */}
          <div>
            <p style={{ color: goldColor, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Хочешь добавить что-то? (необязательно)
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Любая мысль, которую хочется зафиксировать..."
              rows={3}
              style={{
                width: '100%',
                background: isDark ? 'rgba(30, 24, 18, 0.85)' : 'rgba(250, 247, 242, 0.9)',
                border: '1px solid rgba(200, 146, 42, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                lineHeight: '1.7',
                color: textColor,
                transition: 'all 0.4s ease',
                resize: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.2)')}
            />
          </div>

          {/* Сохранить */}
          <div className="flex justify-end">
            {saved && (
              <span style={{ color: '#4a7c6f', fontFamily: 'Cormorant Garamond, serif' }} className="text-sm italic mr-4 self-center">
                ✓ Состояние зафиксировано
              </span>
            )}
            <button
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #c8922a, #8b6914)',
                color: '#faf7f2', border: 'none', borderRadius: '6px',
                padding: '10px 28px', fontFamily: 'Raleway, sans-serif',
                fontSize: '0.85rem', letterSpacing: '0.08em', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(200, 146, 42, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              Зафиксировать
            </button>
          </div>
        </div>

        {/* Пустое состояние */}
        {logs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌡️</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: isDark ? '#e8dcc8' : '#2c2416', fontSize: '1.3rem', marginBottom: '0.75rem' }}>
              Здесь будет твой внутренний климат
            </p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: isDark ? '#b8a882' : '#5c4f3a', fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.8' }}>
              Первая запись — уже шаг<br />к пониманию себя.
            </p>
          </div>
        )}

        {/* История */}
        {logs.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-4 mb-6">
              <div style={{ height: '1px', background: 'rgba(200, 146, 42, 0.2)', flex: 1 }} />
              <p style={{ color: goldColor, fontSize: '0.75rem', letterSpacing: '0.1em' }} className="uppercase">
                Твой внутренний климат
              </p>
              <div style={{ height: '1px', background: 'rgba(200, 146, 42, 0.2)', flex: 1 }} />
            </div>

            <div className="flex flex-col gap-3">
              {logs.map(log => (
                <div
                  key={log.id}
                  style={{
                    background: isDark ? 'rgba(30, 24, 18, 0.85)' : 'rgba(250, 247, 242, 0.8)',
                    border: '1px solid rgba(200, 146, 42, 0.12)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'background 0.4s ease',
                  }}
                >
                  <div style={{ textAlign: 'center', minWidth: '48px' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', color: getMoodColor(log.score), fontSize: '1.8rem', fontWeight: 300, lineHeight: 1 }}>
                      {log.score}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: goldColor, marginTop: '2px' }}>настр.</div>
                  </div>
                  <div style={{ width: '1px', height: '40px', background: 'rgba(200, 146, 42, 0.15)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: goldColor, fontSize: '0.72rem', marginBottom: '4px' }}>{log.date}</p>
                    {log.emotions.length > 0 && (
                      <p style={{ color: subColor, fontSize: '0.8rem' }}>{log.emotions.join(' · ')}</p>
                    )}
                    {log.note && (
                      <p style={{ fontFamily: 'Cormorant Garamond, serif', color: textColor, fontSize: '0.9rem', marginTop: '4px', fontStyle: 'italic' }}>
                        {log.note}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '40px' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c8922a', fontSize: '1.4rem', lineHeight: 1 }}>
                      {log.energy}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: goldColor, marginTop: '2px' }}>энерг.</div>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    style={{ color: isDark ? 'rgba(184, 168, 130, 0.3)' : 'rgba(92, 79, 58, 0.3)', fontSize: '1.2rem', lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.3s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(139, 58, 58, 0.6)')}
                    onMouseLeave={e => (e.currentTarget.style.color = isDark ? 'rgba(184, 168, 130, 0.3)' : 'rgba(92, 79, 58, 0.3)')}
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
