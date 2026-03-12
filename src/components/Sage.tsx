import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const SYSTEM_PROMPT = `Ты — Мудрец, душа приложения «Зеркало». Это личное пространство для встречи с собой, созданное психологом.

Твой характер:
- Мудрый, тёплый, спокойный. Как опытный психолог и близкий друг одновременно.
- Ты говоришь неспешно, вдумчиво. Никогда не торопишься с советами.
- Ты задаёшь вопросы, которые помогают человеку думать — не даёшь готовых ответов.
- Ты принимаешь без осуждения. Любую эмоцию, любую мысль.
- Ты говоришь по-русски, красиво и тепло.

Твой подход:
- Сначала — отразить то, что человек сказал. Показать, что ты услышал.
- Затем — мягко углубить. Задать один важный вопрос.
- Иногда — поделиться психологической мыслью, но без лекций.
- Ты помнишь весь контекст разговора и обращаешься к нему.

Важно:
- Ты не ставишь диагнозы. Ты не назначаешь лечение.
- При серьёзных темах (суицидальные мысли, тяжёлые кризисы) — с теплом рекомендуешь обратиться к живому специалисту.
- Отвечай умеренно по длине — не слишком коротко, не слишком длинно. 3-5 абзацев максимум.
- Никогда не начинай ответ с «Я понимаю» — это слишком шаблонно.`;

const STARTER_QUESTIONS = [
  'Мне тревожно, и я не знаю почему',
  'Я чувствую усталость от всего',
  'Как полюбить себя?',
  'Мне трудно с отношениями',
  'Я потерял смысл',
  'Мне тяжело, но я не могу объяснить',
];

interface Message {
  role: 'user' | 'sage';
  text: string;
}

export default function Sage({ onGoToSettings }: { onGoToSettings?: () => void }) {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem('mirror_sage');
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasApiKey = !!localStorage.getItem('mirror_openai_key');

  useEffect(() => {
    localStorage.setItem('mirror_sage', JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setError('');

    const userMsg: Message = { role: 'user', text: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    const apiKey = localStorage.getItem('mirror_openai_key');

    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'sage',
          text: 'Чтобы я мог по-настоящему думать и отвечать тебе — нужно добавить API ключ в Настройках. Это займёт одну минуту. 🗝️',
        }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    const gptMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...updatedMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: gptMessages,
          temperature: 0.85,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Ошибка OpenAI');
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'sage', text: reply }]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      setError(message);
      setMessages(prev => [...prev, {
        role: 'sage',
        text: 'Что-то пошло не так при соединении. Проверь ключ в Настройках или попробуй снова. 🌿',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  // Цвета по теме
  const bg = isDark ? '#1a1510' : 'transparent';

  const titleColor = isDark ? '#e8dcc8' : '#2c2416';
  const subtitleColor = isDark ? '#b8a882' : '#8b6914';
  const textColor = isDark ? '#d4c5a9' : '#2c2416';
  const mutedColor = isDark ? '#8b7a5e' : '#5c4f3a';
  const borderColor = isDark ? 'rgba(200, 146, 42, 0.18)' : 'rgba(200, 146, 42, 0.12)';
  const inputBg = isDark ? 'rgba(45, 36, 22, 0.9)' : 'rgba(245, 240, 232, 0.9)';
  const inputBorder = isDark ? 'rgba(200, 146, 42, 0.3)' : 'rgba(200, 146, 42, 0.25)';
  const userMsgBg = isDark
    ? 'linear-gradient(135deg, rgba(200, 146, 42, 0.18), rgba(139, 105, 20, 0.12))'
    : 'linear-gradient(135deg, rgba(200, 146, 42, 0.12), rgba(139, 105, 20, 0.08))';
  const sageMsgBg = isDark ? 'rgba(38, 30, 18, 0.97)' : 'rgba(250, 247, 242, 0.95)';
  const noticeBg = isDark ? 'rgba(200, 146, 42, 0.07)' : 'rgba(200, 146, 42, 0.05)';
  const noticeBorder = isDark ? 'rgba(200, 146, 42, 0.2)' : 'rgba(200, 146, 42, 0.15)';
  const starterBg = isDark ? 'rgba(45, 36, 22, 0.9)' : 'rgba(245, 240, 232, 0.9)';
  const starterHoverBg = isDark ? 'rgba(200, 146, 42, 0.14)' : 'rgba(200, 146, 42, 0.08)';
  const footerBg = isDark ? 'rgba(26, 21, 16, 0.97)' : 'rgba(250, 247, 242, 0.95)';

  return (
    <div className="min-h-screen library-bg pt-8 pb-28 px-6" style={{ background: isDark ? bg : undefined }}>
      <div className="max-w-2xl mx-auto flex flex-col" style={{ minHeight: 'calc(100vh - 7rem)' }}>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <span className="text-4xl">💬</span>
          <h2
            style={{ fontFamily: 'Cormorant Garamond, serif', color: titleColor }}
            className="text-4xl font-light mt-3 mb-2"
          >
            Мудрец
          </h2>
          <p style={{ color: subtitleColor, fontFamily: 'Cormorant Garamond, serif' }} className="text-lg italic">
            Что мне нужно услышать?
          </p>

          {/* Статус подключения */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                color: hasApiKey ? '#5a7a2e' : subtitleColor,
                background: hasApiKey
                  ? 'rgba(139, 195, 74, 0.1)'
                  : isDark ? 'rgba(200, 146, 42, 0.1)' : 'rgba(200, 146, 42, 0.08)',
                border: `1px solid ${hasApiKey
                  ? 'rgba(139, 195, 74, 0.25)'
                  : isDark ? 'rgba(200, 146, 42, 0.25)' : 'rgba(200, 146, 42, 0.2)'}`,
                borderRadius: '20px',
                padding: '3px 12px',
              }}
            >
              {hasApiKey ? '✓ GPT-4o подключён' : '○ Без API ключа'}
            </span>
            {!hasApiKey && onGoToSettings && (
              <button
                onClick={onGoToSettings}
                style={{
                  fontSize: '0.72rem',
                  color: '#c8922a',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'Raleway, sans-serif',
                }}
              >
                Добавить ключ →
              </button>
            )}
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([]);
                localStorage.removeItem('mirror_sage');
              }}
              style={{
                marginTop: '12px',
                background: 'none',
                border: `1px solid ${isDark ? 'rgba(200, 146, 42, 0.25)' : 'rgba(200, 146, 42, 0.2)'}`,
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '0.72rem',
                color: subtitleColor,
                cursor: 'pointer',
                fontFamily: 'Raleway, sans-serif',
                letterSpacing: '0.06em',
                transition: 'all 0.3s ease',
              }}
            >
              Начать новый разговор
            </button>
          )}
        </div>

        {/* Предупреждение */}
        <div
          className="mb-6"
          style={{
            animationFillMode: 'forwards',
            background: noticeBg,
            border: `1px solid ${noticeBorder}`,
            borderRadius: '8px',
            padding: '14px 18px',
          }}
        >
          <p style={{ color: subtitleColor, fontSize: '0.8rem', lineHeight: 1.6 }}>
            🌿 <em>Мудрец — это голос внутри тебя, которому я помогаю звучать. Это не замена живому психологу, но это пространство, где можно думать вслух.</em>
          </p>
        </div>

        {/* Ошибка */}
        {error && (
          <div
            className="mb-4 animate-fadeIn"
            style={{
              background: isDark ? 'rgba(200, 50, 50, 0.08)' : 'rgba(200, 50, 50, 0.05)',
              border: '1px solid rgba(200, 50, 50, 0.2)',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '0.78rem',
              color: isDark ? '#e07070' : '#a04040',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Стартовые вопросы */}
        {messages.length === 0 && (
          <div className="mb-6">
            <p style={{ color: subtitleColor, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              С чего начать
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  style={{
                    background: starterBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    color: mutedColor,
                    cursor: 'pointer',
                    fontFamily: 'Cormorant Garamond, serif',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = starterHoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = starterBg)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Диалог */}
        <div
          className="flex-1 flex flex-col gap-4 mb-4 overflow-y-auto"
          style={{ minHeight: messages.length > 0 ? '300px' : 'auto' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className="animate-fadeInUp"
              style={{
                animationFillMode: 'forwards',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.role === 'sage' && (
                <div style={{ marginRight: '10px', marginTop: '4px', fontSize: '1.2rem' }}>🪞</div>
              )}
              <div
                style={{
                  maxWidth: '80%',
                  background: msg.role === 'user' ? userMsgBg : sageMsgBg,
                  border: `1px solid ${msg.role === 'user'
                    ? isDark ? 'rgba(200, 146, 42, 0.3)' : 'rgba(200, 146, 42, 0.25)'
                    : borderColor}`,
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  padding: '14px 18px',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1rem',
                  color: textColor,
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  boxShadow: isDark
                    ? '0 2px 12px rgba(0,0,0,0.3)'
                    : '0 2px 12px rgba(44, 36, 22, 0.06)',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="animate-fadeIn">
              <span style={{ fontSize: '1.2rem' }}>🪞</span>
              <div
                style={{
                  background: sageMsgBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '4px 16px 16px 16px',
                  padding: '12px 18px',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                }}
              >
                {[0, 1, 2].map(d => (
                  <div
                    key={d}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#c8922a',
                      animation: `flicker 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Поле ввода */}
        <div
          className=""
          style={{
            animationFillMode: 'forwards',
            position: 'sticky',
            bottom: '0',
            paddingBottom: '16px',
            paddingTop: '8px',
            background: footerBg,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Напиши, что у тебя на душе..."
              rows={2}
              style={{
                flex: 1,
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: '10px',
                padding: '14px 18px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                lineHeight: '1.6',
                color: textColor,
                transition: 'border-color 0.3s ease',
                resize: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200, 146, 42, 0.6)')}
              onBlur={e => (e.target.style.borderColor = inputBorder)}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              style={{
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #c8922a, #8b6914)'
                  : isDark ? 'rgba(200, 146, 42, 0.15)' : 'rgba(200, 146, 42, 0.2)',
                color: input.trim() && !isTyping ? '#faf7f2' : subtitleColor,
                border: 'none',
                borderRadius: '10px',
                width: '48px',
                height: '48px',
                fontSize: '1.2rem',
                cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
