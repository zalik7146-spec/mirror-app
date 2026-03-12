import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { isDark } = useTheme();

  const bg = isDark ? '#1a1610' : '#faf7f2';
  const cardBg = isDark ? 'rgba(44, 36, 22, 0.6)' : 'rgba(255, 252, 245, 0.9)';
  const border = isDark ? 'rgba(200, 146, 42, 0.15)' : 'rgba(200, 146, 42, 0.2)';
  const title = isDark ? '#e8dcc8' : '#2c2416';
  const text = isDark ? '#b8a882' : '#5c4f3a';
  const gold = '#c8922a';
  const subtle = isDark ? 'rgba(200, 146, 42, 0.08)' : 'rgba(200, 146, 42, 0.06)';

  const sections = [
    {
      icon: '🪞',
      title: 'Что такое Зеркало?',
      text: 'Зеркало — это пространство для паузы. В нашем быстром и шумном мире мы разучились останавливаться. Здесь ты можешь побыть с собой. Без спешки. Без осуждения.',
    },
    {
      icon: '🌿',
      title: 'Зачем оно?',
      text: 'Для разговора с собой. Для анализа и тишины. Чтобы окинуть взглядом свои переживания — оставить их здесь, прожить, попытаться понять и двигаться дальше. Жить, чувствовать, ощущать.',
    },
    {
      icon: '📖',
      title: 'Как пользоваться?',
      text: 'Открывай то, что нужно сейчас. Дневник — когда хочется выговориться. Сейчас — когда нужно вернуться в тело. Благодарность — когда важно заметить хорошее. Состояние — когда хочется понять себя. Мудрец — когда нужен собеседник. Нить — когда нужна опора.',
    },
    {
      icon: '✦',
      title: 'Философия',
      text: 'Зеркало не меняет тебя — оно помогает тебя увидеть. Здесь нет правильных ответов. Нет нормы. Нет оценки. Только ты и твоё отражение.',
    },
  ];

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 24px' }}>

        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🪞</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.4rem',
            fontWeight: 600,
            color: title,
            letterSpacing: '0.04em',
            marginBottom: '12px',
            lineHeight: 1.2,
          }}>
            О Зеркале
          </h1>
          <div style={{
            width: '40px',
            height: '1px',
            background: gold,
            margin: '0 auto 20px',
            opacity: 0.5,
          }} />
          <p style={{
            fontFamily: 'Raleway, sans-serif',
            fontSize: '1.05rem',
            color: gold,
            fontStyle: 'italic',
            lineHeight: 1.7,
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            Разве кто-то может знать наверняка как жить эту жизнь,<br />
            если каждый живёт её впервые?
          </p>
        </div>

        {/* Секции */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((s, i) => (
            <div
              key={i}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: '16px',
                padding: '28px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  fontSize: '1.5rem',
                  background: subtle,
                  borderRadius: '10px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: title,
                    marginBottom: '10px',
                    letterSpacing: '0.02em',
                  }}>
                    {s.title}
                  </h2>
                  <p style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '0.95rem',
                    color: text,
                    lineHeight: 1.8,
                  }}>
                    {s.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Финальная мысль */}
        <div style={{
          marginTop: '40px',
          padding: '32px',
          background: subtle,
          border: `1px solid ${border}`,
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.2rem',
            color: title,
            lineHeight: 1.8,
            fontStyle: 'italic',
          }}>
            Мы все живём эту жизнь впервые.<br />
            Но можно учиться. Чувствовать. Замечать.<br />
            Быть с собой.<br /><br />
            <span style={{ color: gold }}>Это всё, что нужно.</span>
          </p>
        </div>

        {/* Авторство */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Raleway, sans-serif',
            fontSize: '0.8rem',
            color: isDark ? 'rgba(184, 168, 130, 0.4)' : 'rgba(92, 79, 58, 0.4)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Создано с душой · 2024
          </p>
        </div>

      </div>
    </div>
  );
}
