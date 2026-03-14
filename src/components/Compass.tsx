import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Practice { id: string; title: string; source: string; category: string; color: string; desc: string; benefit: string; question: string; }
interface Session { id: string; date: string; practiceId: string; practiceTitle: string; answer: string; }

const PRACTICES: Practice[] = [
  { id: 'dichotomy', title: 'Дихотомия контроля', source: 'Эпиктет', category: 'Стоицизм', color: '#6366f1', desc: 'Разделяй то что в твоей власти и то что не в твоей. Это основа стоического спокойствия.', benefit: 'Снижает тревогу и фрустрацию. Помогает сосредоточиться на действиях а не на результатах.', question: 'Запиши что тебя беспокоит. Раздели на две части: что ты можешь контролировать — и что нет?' },
  { id: 'premeditatio', title: 'Premeditatio malorum', source: 'Сенека', category: 'Стоицизм', color: '#6366f1', desc: 'Заранее представь худшее что может случиться. Это не пессимизм — это подготовка.', benefit: 'Снижает страх неизвестности. Парадоксально — делает тебя более спокойным и смелым.', question: 'Что самое страшное что может произойти в ситуации которая тебя беспокоит? Как бы ты справился?' },
  { id: 'memento', title: 'Memento mori', source: 'Марк Аврелий', category: 'Стоицизм', color: '#6366f1', desc: 'Помни о смерти — не чтобы бояться, а чтобы ценить каждый момент.', benefit: 'Меняет перспективу. Помогает отпустить мелкое и сосредоточиться на важном.', question: 'Если бы этот день был последним — что бы ты сделал иначе? Что действительно важно?' },
  { id: 'amor-fati', title: 'Amor fati', source: 'Ницше / Марк Аврелий', category: 'Стоицизм', color: '#6366f1', desc: 'Люби свою судьбу. Принимай всё что происходит — не терпи, а принимай с любовью.', benefit: 'Трансформирует отношение к трудностям. Превращает препятствие в путь.', question: 'Что трудного происходит в твоей жизни сейчас? Как это могло бы сделать тебя сильнее?' },
  { id: 'evening-review', title: 'Вечерний обзор стоика', source: 'Сенека', category: 'Стоицизм', color: '#6366f1', desc: 'Каждый вечер Сенека задавал себе три вопроса. Это практика честности с собой.', benefit: 'Развивает самоосознанность. Помогает учиться на каждом дне.', question: 'Что плохого ты сегодня сделал? Что хорошего? Что пропустил и можешь исправить?' },
  { id: 'view-from-above', title: 'Взгляд сверху', source: 'Марк Аврелий', category: 'Стоицизм', color: '#6366f1', desc: 'Представь себя с высоты птичьего полёта. Потом выше — из космоса.', benefit: 'Даёт перспективу. Мелкие проблемы становятся маленькими. Важное остаётся важным.', question: 'Посмотри на свою проблему с высоты 10 лет. Будет ли это важно? Что действительно останется?' },
  { id: 'three-good', title: 'Три хороших события', source: 'Мартин Селигман', category: 'Позитивная психология', color: '#f59e0b', desc: 'Каждый день записывай три вещи которые пошли хорошо. И почему.', benefit: 'Клинически доказано снижает депрессию и повышает удовлетворённость жизнью за 2 недели.', question: 'Назови три вещи которые сегодня пошли хорошо — даже маленькие. Почему они произошли?' },
  { id: 'best-self', title: 'Лучшее возможное Я', source: 'Лора Кинг, Позитивная психология', category: 'Позитивная психология', color: '#f59e0b', desc: 'Представь лучшую версию себя через 5 лет. Напиши об этом подробно.', benefit: 'Повышает оптимизм и мотивацию. Помогает прояснить ценности и цели.', question: 'Напиши о себе через 5 лет — если всё пошло хорошо. Кто ты? Как живёшь? Что чувствуешь?' },
  { id: 'flow', title: 'Поиск потока', source: 'Михай Чиксентмихайи', category: 'Позитивная психология', color: '#f59e0b', desc: 'Поток — состояние полного погружения когда время останавливается.', benefit: 'Высшая форма счастья по науке. Регулярный поток — основа смысла и благополучия.', question: 'Когда ты последний раз забывал о времени? Что ты делал? Как создать больше таких моментов?' },
  { id: 'cognitive', title: 'Когнитивная реструктуризация', source: 'Аарон Бек, КПТ', category: 'КПТ', color: '#10b981', desc: 'Найди автоматическую негативную мысль и оспорь её доказательствами.', benefit: 'Основа когнитивно-поведенческой терапии. Научно доказана эффективность при депрессии и тревоге.', question: 'Запиши негативную мысль которая тебя беспокоит. Каковы доказательства ЗА и ПРОТИВ неё?' },
  { id: 'friend-letter', title: 'Письмо другу', source: 'КПТ', category: 'КПТ', color: '#10b981', desc: 'Напиши себе письмо как написал бы другу в той же ситуации.', benefit: 'Снижает самокритику. Активирует систему самосострадания. Меняет внутренний диалог.', question: 'Представь что твой близкий друг в твоей ситуации. Что бы ты ему написал? Напиши это себе.' },
  { id: 'meaning', title: 'Поиск смысла', source: 'Виктор Франкл, Логотерапия', category: 'Экзистенциальная', color: '#8b5cf6', desc: 'Смысл можно найти в страдании, творчестве и любви. Даже в самых тёмных моментах.', benefit: 'Люди со смыслом переносят страдания в 10 раз лучше. Смысл — главный предиктор благополучия.', question: 'Что придаёт смысл твоей жизни прямо сейчас? Если трудно ответить — что могло бы придать?' },
  { id: 'values', title: 'Ценностный компас', source: 'ACT-терапия', category: 'ACT', color: '#ef4444', desc: 'Ценности — это не цели, это направления. Они не достигаются, по ним живут.', benefit: 'Жизнь в соответствии с ценностями — главный предиктор психологического благополучия.', question: 'Назови три ценности которые для тебя важнее всего. Живёшь ли ты в соответствии с ними?' },
  { id: 'discomfort', title: 'Добровольный дискомфорт', source: 'Сенека', category: 'Стоицизм', color: '#6366f1', desc: 'Раз в неделю намеренно откажись от удобства. Пойди пешком. Поголодай день.', benefit: 'Тренирует устойчивость. Снижает зависимость от комфорта. Делает тебя сильнее.', question: 'От какого удобства ты мог бы отказаться на один день? Что это изменит в твоём восприятии?' },
];

export default function Compass() {
  const { isDark } = useTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [current, setCurrent] = useState<Practice | null>(null);
  const [answer, setAnswer] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('mirror-compass-favorites') || '[]'));
  const [saved, setSaved] = useState(false);

  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const text = isDark ? '#e8d5b0' : '#5c4a2a';
  const soft = isDark ? '#a89070' : '#8a7560';
  const card = isDark ? '#2d2218' : '#fff9f0';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';
  const input = isDark ? '#3d2e1e' : '#fff';

  useEffect(() => {
    const saved = localStorage.getItem('mirror-compass-sessions');
    if (saved) setSessions(JSON.parse(saved));
    const dayIndex = Math.floor(Date.now() / 86400000) % PRACTICES.length;
    setCurrent(PRACTICES[dayIndex]);
  }, []);

  const toggleFav = (id: string) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('mirror-compass-favorites', JSON.stringify(updated));
  };

  const saveSession = () => {
    if (!answer.trim() || !current) return;
    const session: Session = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      practiceId: current.id, practiceTitle: current.title, answer,
    };
    const updated = [session, ...sessions];
    setSessions(updated);
    localStorage.setItem('mirror-compass-sessions', JSON.stringify(updated));
    setAnswer('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (showAll) {
    return (
      <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setShowAll(false)} style={{ background: 'none', border: 'none', color: soft, cursor: 'pointer', fontSize: '0.9rem' }}>← Назад</button>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: text, margin: 0 }}>Все практики</h2>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {PRACTICES.map(p => (
            <div key={p.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1rem', cursor: 'pointer' }}
              onClick={() => { setCurrent(p); setShowAll(false); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', margin: '0 0 0.2rem' }}>{p.title}</p>
                  <p style={{ color: p.color, fontSize: '0.75rem', margin: '0 0 0.3rem' }}>{p.source} · {p.category}</p>
                  <p style={{ color: soft, fontSize: '0.82rem', margin: 0 }}>{p.desc}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleFav(p.id); }} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
                  {favorites.includes(p.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1.5rem 1rem 6rem', fontFamily: 'Raleway, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem' }}>🧭</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: text, margin: '0.3rem 0' }}>Компас</h1>
        <p style={{ color: soft, fontSize: '0.85rem', fontStyle: 'italic' }}>Практика дня — твоё направление</p>
      </div>

      {current && (
        <div style={{ background: card, border: `2px solid ${current.color}40`, borderRadius: '20px', padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ background: current.color + '20', color: current.color, borderRadius: '10px', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>{current.category}</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: text, margin: '0.5rem 0 0.2rem' }}>{current.title}</h2>
              <p style={{ color: current.color, fontSize: '0.8rem', margin: 0 }}>{current.source}</p>
            </div>
            <button onClick={() => toggleFav(current.id)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
              {favorites.includes(current.id) ? '❤️' : '🤍'}
            </button>
          </div>

          <p style={{ color: soft, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{current.desc}</p>

          <div style={{ background: current.color + '10', border: `1px solid ${current.color}30`, borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem' }}>
            <p style={{ color: soft, fontSize: '0.75rem', margin: '0 0 0.3rem' }}>💡 Польза</p>
            <p style={{ color: text, fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{current.benefit}</p>
          </div>

          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: text, fontStyle: 'italic', lineHeight: 1.6 }}>
              {current.question}
            </p>
          </div>

          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Твой ответ..."
            style={{ width: '100%', minHeight: '120px', background: input, border: `1px solid ${border}`, borderRadius: '12px', padding: '0.75rem', outline: 'none', color: text, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box' }} />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button onClick={() => { const r = Math.floor(Math.random() * PRACTICES.length); setCurrent(PRACTICES[r]); setAnswer(''); }} style={{ flex: 1, padding: '0.75rem', background: 'none', border: `1px solid ${border}`, borderRadius: '12px', color: soft, cursor: 'pointer', fontSize: '0.85rem' }}>
              Другая →
            </button>
            <button onClick={saveSession} style={{ flex: 2, padding: '0.75rem', background: saved ? '#10b981' : 'linear-gradient(135deg, #b8860b, #d4a017)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem' }}>
              {saved ? '✓ Сохранено' : 'Сохранить ответ'}
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setShowAll(true)} style={{ width: '100%', padding: '0.75rem', background: card, border: `1px solid ${border}`, borderRadius: '12px', color: soft, cursor: 'pointer', marginBottom: '1.5rem', fontFamily: 'Raleway, sans-serif' }}>
        Все практики ({PRACTICES.length}) →
      </button>

      {sessions.length > 0 && (
        <div>
          <p style={{ color: soft, fontSize: '0.8rem', marginBottom: '1rem', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>История практик</p>
          {sessions.slice(0, 5).map(s => (
            <div key={s.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: text, fontSize: '0.9rem', fontFamily: 'Cormorant Garamond, serif' }}>{s.practiceTitle}</span>
                <span style={{ color: soft, fontSize: '0.75rem' }}>{s.date}</span>
              </div>
              <p style={{ color: soft, fontSize: '0.85rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
