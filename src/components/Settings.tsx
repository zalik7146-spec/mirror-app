import { useState, useEffect } from 'react';

export default function Settings() {
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [visible, setVisible] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('mirror_sound') !== 'false';
  });

  useEffect(() => {
    const stored = localStorage.getItem('mirror_openai_key');
    if (stored) setKey(stored);
    const storedName = localStorage.getItem('mirror_user_name');
    if (storedName) setName(storedName);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('mirror_sound', next ? 'true' : 'false');
  };

  const handleSaveName = () => {
    const trimmed = name.trim();
    localStorage.setItem('mirror_user_name', trimmed);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 3000);
  };

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    localStorage.setItem('mirror_openai_key', trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem('mirror_openai_key');
    setKey('');
    setSaved(false);
  };

  const isStored = !!localStorage.getItem('mirror_openai_key');

  const card = {
    background: 'rgba(250, 247, 242, 0.95)',
    border: '1px solid rgba(200, 146, 42, 0.18)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 24px rgba(44, 36, 22, 0.06)',
    marginBottom: '16px',
  };

  return (
    <div className="min-h-screen library-bg pt-8 pb-28 px-6">
      <div className="max-w-xl mx-auto">

        {/* Заголовок */}
        <div className="text-center mb-10">
          <span className="text-4xl">⚙️</span>
          <h2
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2c2416' }}
            className="text-4xl font-light mt-3 mb-2"
          >
            Настройки
          </h2>
          <p style={{ color: '#8b6914', fontFamily: 'Cormorant Garamond, serif' }} className="text-lg italic">
            Твоё пространство, твои правила
          </p>
        </div>

        {/* Карточка звука */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2c2416', fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.25rem' }}>
                🔊 Звук страниц
              </h3>
              <p style={{ color: '#8b6914', fontSize: '0.82rem' }}>
                Тихий шелест при переходе между разделами
              </p>
            </div>
            <button
              onClick={toggleSound}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                background: soundEnabled ? '#c8922a' : 'rgba(200,146,42,0.2)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s ease',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                top: '3px',
                left: soundEnabled ? '27px' : '3px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.3s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </div>

        {/* Карточка имени */}
        <div style={card}>
          <h3
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2c2416' }}
            className="text-2xl font-light mb-2"
          >
            🌿 Как тебя зовут?
          </h3>
          <p style={{ color: '#5c4f3a', fontSize: '0.88rem', lineHeight: 1.7 }} className="mb-6">
            Приложение будет обращаться к тебе по имени — это делает пространство более личным.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Александр..."
              style={{
                flex: 1,
                background: 'rgba(245, 240, 232, 0.9)',
                border: '1px solid rgba(200, 146, 42, 0.25)',
                borderRadius: '10px',
                padding: '13px 16px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.05rem',
                color: '#2c2416',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.25)')}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); }}
            />
            <button
              onClick={handleSaveName}
              style={{
                background: 'linear-gradient(135deg, #c8922a, #8b6914)',
                color: '#faf7f2',
                border: 'none',
                borderRadius: '10px',
                padding: '13px 22px',
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {nameSaved ? '✓ Сохранено' : 'Сохранить'}
            </button>
          </div>
        </div>

        {/* Карточка API */}
        <div style={card}>
          <h3
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2c2416' }}
            className="text-2xl font-light mb-2"
          >
            🤖 OpenAI API ключ
          </h3>
          <p style={{ color: '#5c4f3a', fontSize: '0.88rem', lineHeight: 1.7 }} className="mb-6">
            Ключ нужен для того, чтобы Мудрец стал по-настоящему думающим — он хранится только в твоём браузере и никуда не отправляется, кроме серверов OpenAI.
          </p>

          {isStored && (
            <div className="mb-4" style={{
              background: 'rgba(139, 195, 74, 0.08)',
              border: '1px solid rgba(139, 195, 74, 0.25)',
              borderRadius: '8px',
              padding: '10px 14px',
            }}>
              <span style={{ fontSize: '0.85rem', color: '#5a7a2e' }}>
                ✓ Ключ сохранён — Мудрец подключён к OpenAI
              </span>
            </div>
          )}

          <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#8b6914', textTransform: 'uppercase' }} className="block mb-2">
            API ключ
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={visible ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-..."
              style={{
                width: '100%',
                background: 'rgba(245, 240, 232, 0.9)',
                border: '1px solid rgba(200, 146, 42, 0.25)',
                borderRadius: '10px',
                padding: '13px 48px 13px 16px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#2c2416',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.25)')}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            />
            <button
              onClick={() => setVisible(v => !v)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1rem', opacity: 0.5,
              }}
            >
              {visible ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              style={{
                flex: 1,
                background: key.trim() ? 'linear-gradient(135deg, #c8922a, #8b6914)' : 'rgba(200, 146, 42, 0.2)',
                color: key.trim() ? '#faf7f2' : '#8b6914',
                border: 'none', borderRadius: '10px', padding: '13px',
                fontFamily: 'Raleway, sans-serif', fontSize: '0.88rem',
                cursor: key.trim() ? 'pointer' : 'default',
              }}
            >
              {saved ? '✓ Сохранено' : 'Сохранить'}
            </button>
            {isStored && (
              <button
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: '1px solid rgba(200, 146, 42, 0.2)',
                  borderRadius: '10px', padding: '13px 18px',
                  fontFamily: 'Raleway, sans-serif', fontSize: '0.82rem',
                  color: '#8b6914', cursor: 'pointer',
                }}
              >
                Удалить
              </button>
            )}
          </div>
        </div>

        {/* Подсказка */}
        <div style={{
          background: 'rgba(200, 146, 42, 0.04)',
          border: '1px solid rgba(200, 146, 42, 0.12)',
          borderRadius: '12px', padding: '20px 24px', marginBottom: '16px',
        }}>
          <p style={{ color: '#8b6914', fontSize: '0.82rem', lineHeight: 1.8 }}>
            🔐 <strong>Приватность:</strong> ключ хранится исключительно в памяти твоего браузера. Мы не имеем к нему доступа.
          </p>
          <p style={{ color: '#8b6914', fontSize: '0.82rem', lineHeight: 1.8, marginTop: '8px' }}>
            📖 Получить ключ можно на <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: '#c8922a', textDecoration: 'underline' }}>platform.openai.com</a>
          </p>
        </div>

        {/* О Зеркале */}
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🪞</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2c2416', fontSize: '1.6rem', fontWeight: 400, marginBottom: '12px' }}>
              О Зеркале
            </h3>
            <div style={{ width: '30px', height: '1px', background: '#c8922a', margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ color: '#c8922a', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.7 }}>
              Разве кто-то может знать наверняка как жить эту жизнь,<br />
              если каждый живёт её впервые?
            </p>
          </div>

          {[
            { icon: '🪞', title: 'Что такое Зеркало?', text: 'Зеркало — это пространство для паузы. В нашем быстром и шумном мире мы разучились останавливаться. Здесь ты можешь побыть с собой. Без спешки. Без осуждения.' },
            { icon: '🌿', title: 'Зачем оно?', text: 'Для разговора с собой. Для анализа и тишины. Чтобы окинуть взглядом свои переживания — оставить их здесь, прожить, попытаться понять и двигаться дальше.' },
            { icon: '✦', title: 'Философия', text: 'Зеркало не меняет тебя — оно помогает тебя увидеть. Здесь нет правильных ответов. Нет нормы. Нет оценки. Только ты и твоё отражение.' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', padding: '18px 0', borderTop: '1px solid rgba(200, 146, 42, 0.1)' }}>
              <div style={{ fontSize: '1.2rem', background: 'rgba(200, 146, 42, 0.06)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2c2416', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{s.title}</p>
                <p style={{ color: '#5c4f3a', fontSize: '0.85rem', lineHeight: 1.8 }}>{s.text}</p>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(200, 146, 42, 0.05)', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: '#5c4f3a', fontSize: '1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
              Мы все живём эту жизнь впервые.<br />
              Но можно учиться. Чувствовать. Замечать. Быть с собой.<br />
              <span style={{ color: '#c8922a' }}>Это всё, что нужно.</span>
            </p>
          </div>

          <p style={{ color: '#8b6914', fontSize: '0.75rem', marginTop: '20px', fontStyle: 'italic', textAlign: 'center', opacity: 0.6 }}>
            Создано с душой · 2024
          </p>
        </div>

      </div>
    </div>
  );
}
