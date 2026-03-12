import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';



type Practice = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  source: string;
  emoji: string;
  description: string;
  steps: string[];
  color: string;
};

const categories = [
  {
    id: 'anxiety',
    emoji: '🌊',
    label: 'Когда тревожно',
    practices: [
      {
        id: 'breathing478',
        title: 'Дыхание 4-7-8',
        subtitle: 'Успокоение нервной системы',
        duration: '5 мин',
        source: 'Др. Эндрю Вейл',
        emoji: '🌬️',
        color: '#4a7c6f',
        description: 'Активирует парасимпатическую нервную систему — естественный тормоз тревоги. Снижает уровень кортизола и замедляет сердечный ритм.',
        steps: [
          'Сядь удобно. Закрой глаза.',
          'Вдох через нос — медленно считай до 4',
          'Задержи дыхание — считай до 7',
          'Выдох через рот — считай до 8',
          'Повтори 4 раза. С каждым разом тело расслабляется глубже.',
        ],
      },
      {
        id: 'grounding54321',
        title: 'Заземление 5-4-3-2-1',
        subtitle: 'Возвращение в настоящий момент',
        duration: '3 мин',
        source: 'Когнитивно-поведенческая терапия',
        emoji: '🌿',
        color: '#5a7a4a',
        description: 'Техника из КПТ для быстрого выхода из тревожных мыслей. Переключает внимание с внутреннего шума на реальность вокруг.',
        steps: [
          'Назови 5 вещей которые ВИДИШЬ прямо сейчас',
          'Назови 4 вещи которые можешь ПОТРОГАТЬ',
          'Назови 3 звука которые СЛЫШИШЬ',
          'Назови 2 запаха которые ЧУВСТВУЕШЬ',
          'Назови 1 вкус во рту прямо сейчас',
        ],
      },
    ],
  },
  {
    id: 'sadness',
    emoji: '🌑',
    label: 'Когда грустно',
    practices: [
      {
        id: 'selfcompassion',
        title: 'Самосострадание',
        subtitle: 'Три шага к себе',
        duration: '7 мин',
        source: 'Кристин Нефф, Гарвард',
        emoji: '🤍',
        color: '#7a6a8a',
        description: 'Исследования показывают: самосострадание снижает тревогу и депрессию эффективнее самокритики. Это не слабость — это мудрость.',
        steps: [
          'Признай боль: «Сейчас мне тяжело. Это больно.» — просто назови это.',
          'Вспомни: ты не один. Каждый человек иногда страдает. Это часть жизни.',
          'Скажи себе доброе слово — то, что сказал бы близкому другу в этой ситуации.',
          'Положи руку на сердце. Почувствуй тепло ладони.',
          'Побудь так минуту. Без оценок.',
        ],
      },
      {
        id: 'friendletter',
        title: 'Письмо другу',
        subtitle: 'Переформулировка самокритики',
        duration: '10 мин',
        source: 'Когнитивно-поведенческая терапия',
        emoji: '✉️',
        color: '#8a6a5a',
        description: 'Мы говорим себе то, что никогда не сказали бы другу. Эта практика из КПТ помогает увидеть себя с добротой.',
        steps: [
          'Вспомни что тебя сейчас беспокоит или за что ты себя критикуешь.',
          'Представь: твой близкий друг переживает то же самое.',
          'Напиши ему письмо — с заботой, без осуждения, с пониманием.',
          'Перечитай письмо. Теперь оно адресовано тебе.',
          'Замечаешь разницу между тем, как ты говоришь с другом и с собой?',
        ],
      },
    ],
  },
  {
    id: 'body',
    emoji: '🌿',
    label: 'Для тела',
    practices: [
      {
        id: 'bodyscan',
        title: 'Сканирование тела',
        subtitle: 'Осознанное внимание',
        duration: '10 мин',
        source: 'MBSR, Джон Кабат-Зинн',
        emoji: '🧘',
        color: '#4a6a7a',
        description: 'Основа программы снижения стресса на основе осознанности (MBSR). Снижает хроническую боль, тревогу и улучшает качество сна.',
        steps: [
          'Ляг или сядь удобно. Закрой глаза.',
          'Начни с пальцев ног — просто замечай ощущения. Тепло? Холод? Напряжение?',
          'Медленно двигайся вверх — стопы, голени, колени, бёдра.',
          'Живот, грудь — замечай дыхание изнутри.',
          'Плечи, руки, шея, лицо. Отпускай напряжение с каждым выдохом.',
        ],
      },
      {
        id: 'progressive',
        title: 'Прогрессивная релаксация',
        subtitle: 'Напряжение и отпускание',
        duration: '15 мин',
        source: 'Эдмунд Джейкобсон, 1920',
        emoji: '💆',
        color: '#6a7a4a',
        description: 'Один из самых изученных методов работы с телесным стрессом. Учит различать напряжение и расслабление — и выбирать второе.',
        steps: [
          'Сядь или ляг удобно.',
          'Сожми кулаки на 5 секунд — очень сильно. Потом резко отпусти. Почувствуй разницу.',
          'Напряги плечи — подними к ушам. 5 секунд. Отпусти.',
          'Зажмурься и наморщи лоб. 5 секунд. Отпусти.',
          'Пройди так всё тело сверху вниз. В конце — полная тишина.',
        ],
      },
    ],
  },
  {
    id: 'daily',
    emoji: '☀️',
    label: 'Каждый день',
    practices: [
      {
        id: 'morningpages',
        title: 'Утренние страницы',
        subtitle: 'Поток сознания',
        duration: '20 мин',
        source: 'Джулия Кэмерон',
        emoji: '🌅',
        color: '#8a7a4a',
        description: 'Практика из книги «Путь художника». Очищает ум от шума, снижает тревогу и открывает творческое мышление.',
        steps: [
          'Сразу после пробуждения — до телефона и кофе.',
          'Открой дневник или блокнот.',
          'Пиши всё что приходит в голову — без цензуры, без правил.',
          'Не перечитывай, не исправляй. Просто поток.',
          'Три страницы или 20 минут — каждый день.',
        ],
      },
      {
        id: 'sleepbreathing',
        title: 'Дыхание перед сном',
        subtitle: 'Переход в покой',
        duration: '5 мин',
        source: 'Нейронаука сна',
        emoji: '🌙',
        color: '#3a4a6a',
        description: 'Медленный выдох активирует блуждающий нерв и снижает частоту сердечных сокращений — тело начинает готовиться ко сну.',
        steps: [
          'Ляг в кровать. Закрой глаза.',
          'Вдох через нос — 4 секунды.',
          'Выдох через рот — 6 секунд. Медленно.',
          'Повтори 6 раз.',
          'Спокойной ночи. Ты сделал всё, что мог сегодня.',
        ],
      },
    ],
  },
  {
    id: 'quick',
    emoji: '⚡',
    label: 'Быстрая помощь',
    practices: [
      {
        id: 'stopmoment',
        title: 'Стоп-момент',
        subtitle: '60 секунд тишины',
        duration: '1 мин',
        source: 'Практика осознанности',
        emoji: '⏸️',
        color: '#6a5a4a',
        description: 'Одна минута полного присутствия. Исследования показывают: даже 60 секунд осознанной паузы снижают уровень стресса.',
        steps: [
          'Остановись. Прямо сейчас.',
          'Положи телефон. Закрой глаза.',
          'Просто дыши — ни о чём не думай.',
          '60 секунд. Только это.',
          'Открой глаза. Как ты?',
        ],
      },
      {
        id: 'fivesenses',
        title: 'Пять чувств',
        subtitle: 'Мгновенное присутствие',
        duration: '2 мин',
        source: 'Терапия принятия и ответственности (ACT)',
        emoji: '✨',
        color: '#4a5a7a',
        description: 'Техника из ACT-терапии. Мгновенно возвращает в настоящий момент через прямой контакт с реальностью через органы чувств.',
        steps: [
          'Что ты ВИДИШЬ прямо сейчас? Назови 3 вещи.',
          'Что ты СЛЫШИШЬ? Назови 3 звука.',
          'Что ты ЧУВСТВУЕШЬ кожей? Одежда, воздух, поверхность.',
          'Есть ли запах вокруг тебя?',
          'Ты здесь. Ты в настоящем. Это достаточно.',
        ],
      },
    ],
  },
];

function PracticeDetail({ practice, onBack, onComplete }: { practice: Practice; onBack: () => void; onComplete: (id: string) => void }) {
  const { isDark } = useTheme();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const nextStep = () => {
    if (currentStep < practice.steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setDone(true);
      onComplete(practice.id);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '80px 20px 100px',
      background: isDark ? '#1a1410' : '#faf6f0',
    }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: isDark ? '#c8922a' : '#8b6914',
        fontSize: '0.9rem', marginBottom: '24px', display: 'flex',
        alignItems: 'center', gap: '6px', fontFamily: 'Raleway, sans-serif',
      }}>
        ← Назад
      </button>

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{practice.emoji}</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.8rem',
            color: isDark ? '#e8d5b0' : '#2c1810',
            marginBottom: '8px',
          }}>{practice.title}</h1>
          <p style={{ color: isDark ? '#a09070' : '#8b6914', fontSize: '0.9rem', marginBottom: '4px' }}>
            {practice.subtitle}
          </p>
          <p style={{ color: isDark ? '#706050' : '#b8a070', fontSize: '0.8rem' }}>
            {practice.duration} · {practice.source}
          </p>
        </div>

        <div style={{
          background: isDark ? 'rgba(200,146,42,0.08)' : 'rgba(139,105,20,0.06)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          borderLeft: `3px solid ${practice.color}`,
        }}>
          <p style={{
            color: isDark ? '#c8b090' : '#5a4020',
            fontSize: '0.95rem',
            lineHeight: '1.7',
            fontStyle: 'italic',
          }}>{practice.description}</p>
        </div>

        {!started ? (
          <button onClick={() => setStarted(true)} style={{
            width: '100%',
            padding: '16px',
            background: practice.color,
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1rem',
            fontFamily: 'Raleway, sans-serif',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}>
            Начать практику
          </button>
        ) : done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌿</div>
            <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.2rem',
            color: isDark ? '#e8d5b0' : '#2c1810',
            marginBottom: '8px',
          }}>Практика завершена</p>
            <p style={{ color: isDark ? '#a09070' : '#8b6914', fontSize: '0.9rem', marginBottom: '24px' }}>
              Заметь как ты себя чувствуешь прямо сейчас
            </p>
            <button onClick={() => { setStarted(false); setCurrentStep(0); setDone(false); }} style={{
              background: 'none',
              border: `1px solid ${isDark ? 'rgba(200,146,42,0.3)' : 'rgba(139,105,20,0.2)'}`,
              borderRadius: '12px',
              padding: '12px 24px',
              color: isDark ? '#c8922a' : '#8b6914',
              cursor: 'pointer',
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.9rem',
            }}>
              Повторить
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'flex', gap: '6px', marginBottom: '24px', justifyContent: 'center',
            }}>
              {practice.steps.map((_, i) => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: i <= currentStep ? practice.color : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <div style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
              borderRadius: '20px',
              padding: '32px 24px',
              marginBottom: '20px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.1rem',
                color: isDark ? '#e8d5b0' : '#2c1810',
                lineHeight: '1.8',
                textAlign: 'center',
              }}>{practice.steps[currentStep]}</p>
            </div>
            <button onClick={nextStep} style={{
              width: '100%',
              padding: '16px',
              background: practice.color,
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1rem',
              fontFamily: 'Raleway, sans-serif',
              cursor: 'pointer',
            }}>
              {currentStep < practice.steps.length - 1 ? 'Далее →' : 'Завершить'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Workshop() {
  const { isDark } = useTheme();
  const [selected, setSelected] = useState<Practice | null>(null);
  const [practiceCount, setPracticeCount] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mirror_practice_count');
    return saved ? JSON.parse(saved) : {};
  });

  const totalPractices = Object.values(practiceCount).reduce((a, b) => a + b, 0);
  const uniquePractices = Object.keys(practiceCount).length;

  const handleComplete = (id: string) => {
    const updated = { ...practiceCount, [id]: (practiceCount[id] || 0) + 1 };
    setPracticeCount(updated);
    localStorage.setItem('mirror_practice_count', JSON.stringify(updated));
  };

  if (selected) {
    return <PracticeDetail practice={selected} onBack={() => setSelected(null)} onComplete={handleComplete} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '80px 20px 100px',
      background: isDark ? '#1a1410' : '#faf6f0',
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛠️</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2rem',
            color: isDark ? '#e8d5b0' : '#2c1810',
            marginBottom: '8px',
          }}>Мастерская</h1>
          <p style={{
            color: isDark ? '#a09070' : '#8b6914',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            fontFamily: 'Raleway, sans-serif',
            marginBottom: totalPractices > 0 ? '16px' : '0',
          }}>Научно обоснованные практики для работы с собой. Выбери то, что нужно прямо сейчас.</p>
          {totalPractices > 0 && (
            <div style={{
              display: 'inline-flex',
              gap: '16px',
              background: isDark ? 'rgba(200,146,42,0.1)' : 'rgba(139,105,20,0.07)',
              border: `1px solid ${isDark ? 'rgba(200,146,42,0.2)' : 'rgba(139,105,20,0.15)'}`,
              borderRadius: '20px',
              padding: '8px 20px',
            }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: isDark ? '#c8a96e' : '#8b6914', fontSize: '0.9rem' }}>
                🌿 {totalPractices} {totalPractices === 1 ? 'практика' : totalPractices < 5 ? 'практики' : 'практик'} завершено
              </span>
              <span style={{ color: isDark ? 'rgba(200,146,42,0.3)' : 'rgba(139,105,20,0.2)' }}>·</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: isDark ? '#c8a96e' : '#8b6914', fontSize: '0.9rem' }}>
                {uniquePractices} уникальных
              </span>
            </div>
          )}
        </div>

        {categories.map(cat => (
          <div key={cat.id} style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '12px',
            }}>
              <span style={{ fontSize: '1.2rem' }}>{cat.emoji}</span>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.1rem',
                color: isDark ? '#c8b090' : '#5a3a20',
              }}>{cat.label}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cat.practices.map(practice => (
                <button
                  key={practice.id}
                  onClick={() => setSelected(practice as Practice)}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    borderRadius: '16px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px',
                    background: practice.color + '22',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', flexShrink: 0,
                  }}>
                    {practice.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.05rem',
                    color: isDark ? '#e8d5b0' : '#2c1810',
                    marginBottom: '2px',
                  }}>{practice.title}</div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: isDark ? '#a09070' : '#8b6914',
                    }}>{practice.subtitle} · {practice.duration}</div>
                  </div>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: practice.color, flexShrink: 0,
                  }} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
