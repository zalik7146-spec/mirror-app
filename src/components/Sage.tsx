import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Message { role: 'user' | 'assistant'; text: string; }

const RESPONSES: Record<string, string[]> = {
  тревог: ['Тревога — это сигнал, не приговор. Она говорит о том, что что-то важно для тебя. Можешь назвать — что именно сейчас тревожит больше всего?', 'Когда тревожно, тело напрягается. Попробуй сделать три медленных вдоха. Что происходит внутри прямо сейчас?'],
  грустн: ['Грусть — это не слабость. Это честность. Что за ней стоит — потеря, усталость, одиночество?', 'Позволь себе побыть с этой грустью. Она тоже часть тебя. Как давно это чувство рядом?'],
  устал: ['Усталость — это сигнал что ты много отдавал. Что сейчас больше всего истощает тебя?', 'Когда последний раз ты делал что-то только для себя — без пользы, без цели?'],
  один: ['Одиночество бывает разным. Иногда это нехватка людей. Иногда — нехватка понимания. Что именно сейчас?', 'Ты не один в своём одиночестве — парадоксально, но так. Что помогло бы тебе сейчас?'],
  злост: ['Злость говорит о нарушенных границах или несправедливости. На что направлена твоя злость?', 'Злость — это энергия. Что за ней скрывается — боль, страх, разочарование?'],
  смысл: ['Вопрос смысла — самый честный вопрос. Виктор Франкл говорил: смысл не найти, его нужно создать. Что даёт тебе ощущение важности прямо сейчас?'],
  default: ['Я слышу тебя. Расскажи мне больше — что происходит?', 'Это звучит важно. Как давно это с тобой?', 'Что ты чувствуешь когда думаешь об этом?', 'Как это влияет на твою жизнь сейчас?'],
};

function getResponse(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, responses] of Object.entries(RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)];
}

export default function Sage() {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey] = useState(() => localStorage.getItem('mirror-api-key') || '');
  const bottomRef = useRef<HTMLDivElement>(null);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const inputBg = isDark ? '#3d2e1e' : '#fff';
  const userBubble = isDark ? '#4a3520' : '#f5e6c8';
  const aiBubble = isDark ? '#2d2218' : '#fff9f0';

  useEffect(() => {
    const saved = localStorage.getItem('mirror-sage-messages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    if (apiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'Ты — мудрый, тёплый и внимательный психологический помощник. Ты говоришь по-русски, мягко и глубоко. Ты не даёшь советов сразу — сначала слушаешь, задаёшь вопросы, помогаешь человеку самому прийти к пониманию. Ты говоришь как мудрый друг, не как бот.' },
              ...updated.map(m => ({ role: m.role, content: m.text })),
            ],
          }),
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || getResponse(input);
        const withReply = [...updated, { role: 'assistant' as const, text: reply }];
        setMessages(withReply);
        localStorage.setItem('mirror-sage-messages', JSON.stringify(withReply));
      } catch {
        const reply = getResponse(input);
        const withReply = [...updated, { role: 'assistant' as const, text: reply }];
        setMessages(withReply);
        localStorage.setItem('mirror-sage-messages', JSON.stringify(withReply));
      }
    } else {
      setTimeout(() => {
        const reply = getResponse(input);
        const withReply = [...updated, { role: 'assistant' as const, text: reply }];
        setMessages(withReply);
        localStorage.setItem('mirror-sage-messages', JSON.stringify(withReply));
        setLoading(false);
      }, 800);
      return;
    }
    setLoading(false);
  };

  const clear = () => { setMessages([]); localStorage.removeItem('mirror-sage-messages'); };

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', fontFamily: 'Raleway, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '1.5rem 1rem 0.75rem' }}>
        <div style={{ fontSize: '2rem' }}>💬</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: '0.3rem 0' }}>Мудрец</h1>
        {!apiKey && <p style={{ color: soft, fontSize: '0.8rem', fontStyle: 'italic' }}>Добавь API ключ в настройках для полного диалога</p>}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '8rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: text, marginBottom: '1.5rem', fontStyle: 'italic' }}>
              «Всё, что нас беспокоит — внутри нас, а не снаружи.» — Марк Аврелий
            </p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {['Мне тревожно и я не знаю почему', 'Я чувствую себя потерянным', 'Хочу поговорить о смысле', 'Мне грустно сегодня'].map(q => (
                <button key={q} onClick={() => { setInput(q); }} style={{
                  background: card, border: `1px solid ${border}`, borderRadius: '12px',
                  padding: '0.75rem 1rem', cursor: 'pointer', color: soft,
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
            <div style={{
              maxWidth: '80%', padding: '0.75rem 1rem',
              background: m.role === 'user' ? userBubble : aiBubble,
              border: `1px solid ${border}`, borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', lineHeight: 1.6,
            }}>{m.text}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.3rem', padding: '0.75rem 1rem', background: aiBubble, border: `1px solid ${border}`, borderRadius: '16px 16px 16px 4px', width: 'fit-content' }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: '6px', height: '6px', background: soft, borderRadius: '50%', animation: `pulse 1s ${i * 0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ position: 'fixed', bottom: '4.5rem', left: 0, right: 0, padding: '0.75rem 1rem', background: bg, borderTop: `1px solid ${border}` }}>
        {messages.length > 0 && (
          <button onClick={clear} style={{ background: 'none', border: 'none', color: soft, fontSize: '0.75rem', cursor: 'pointer', marginBottom: '0.5rem' }}>Очистить диалог</button>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Напиши что на душе..."
            rows={1}
            style={{ flex: 1, background: inputBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '0.75rem', outline: 'none', color: text, fontFamily: 'Raleway, sans-serif', fontSize: '0.95rem', resize: 'none' }} />
          <button onClick={send} style={{ background: 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 1rem', cursor: 'pointer', fontSize: '1.2rem' }}>→</button>
        </div>
      </div>
    </div>
  );
}
