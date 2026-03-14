import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Practice {
  title: string;
  source: string;
  category: string;
  description: string;
  question: string;
}

const practices: Practice[] = [
  { title: 'Дихотомия контроля', source: 'Эпиктет', category: 'Стоицизм', description: 'Раздели то, что тебя беспокоит, на две части — что в твоём контроле и что нет. Сосредоточься только на первом.', question: 'Что сейчас тебя беспокоит? Что из этого в твоём контроле?' },
  { title: 'Premeditatio Malorum', source: 'Сенека', category: 'Стоицизм', description: 'Представь худший сценарий. Не чтобы бояться — а чтобы увидеть, что даже он переживаем.', question: 'Чего ты боишься? Что самое страшное может случиться — и как бы ты справился?' },
  { title: 'Memento Mori', source: 'Марк Аврелий', category: 'Стоицизм', description: 'Помни о конечности. Это не мрачность — это ясность. Что действительно важно?', question: 'Если бы у тебя остался один день — на что бы ты его потратил?' },
  { title: 'Amor Fati', source: 'Ницше / Стоики', category: 'Стоицизм', description: 'Любовь к судьбе. Принятие всего что происходит — не как наказания, а как материала для роста.', question: 'Что из происходящего сейчас ты можешь принять целиком — и хорошее, и трудное?' },
  { title: 'Вечерний обзор', source: 'Сенека', category: 'Стоицизм', description: 'Сенека каждый вечер задавал себе три вопроса. Простая и мощная практика.', question: 'Что я сделал хорошо сегодня? Что мог сделать лучше? Что я узнал?' },
  { title: 'Взгляд сверху', source: 'Марк Аврелий', category: 'Стоицизм', description: 'Представь свою жизнь с высоты птичьего полёта. Потом из космоса. Масштаб меняет восприятие.', question: 'Насколько важна твоя текущая проблема в масштабе года? Десяти лет? Жизни?' },
  { title: 'Добровольный дискомфорт', source: 'Сенека', category: 'Стоицизм', description: 'Время от времени лишай себя комфорта намеренно. Это учит ценить то что имеешь.', question: 'От чего ты можешь отказаться на один день — и что это тебе покажет?' },
  { title: 'Когнитивная реструктуризация', source: 'Аарон Бек', category: 'КПТ', description: 'Мысль — не факт. Запиши автоматическую негативную мысль и найди альтернативный взгляд.', question: 'Какая мысль тебя мучает? Есть ли другой способ посмотреть на эту ситуацию?' },
  { title: 'Взгляд со стороны', source: 'КПТ', category: 'КПТ', description: 'Мы к себе жёстче чем к другим. Представь что друг пришёл с твоей проблемой.', question: 'Что бы ты сказал близкому другу который чувствует то же что и ты сейчас?' },
  { title: 'Экспозиция страха', source: 'КПТ', category: 'КПТ', description: 'Назови страх. Оцени его от 1 до 10. Часто само называние уменьшает его силу.', question: 'Чего ты избегаешь? Насколько страшно это на самом деле от 1 до 10?' },
  { title: 'Поведенческий эксперимент', source: 'КПТ', category: 'КПТ', description: 'Проверь свою мысль на практике. Часто наши прогнозы не совпадают с реальностью.', question: 'Что ты считаешь правдой о себе — и как можешь это проверить сегодня?' },
  { title: 'Три хороших события', source: 'Мартин Селигман', category: 'Позитивная психология', description: 'Каждый вечер вспоминай три вещи которые пошли хорошо. Даже маленькие. Это меняет фокус.', question: 'Назови три вещи которые сегодня пошли хорошо. Почему они произошли?' },
  { title: 'Лучшее возможное Я', source: 'Лора Кинг', category: 'Позитивная психология', description: 'Представь себя через 5 лет в лучшем варианте. Не фантазия — а направление.', question: 'Кем ты хочешь быть через 5 лет? Что ты делаешь, чувствуешь, как живёшь?' },
  { title: 'Поток', source: 'Чиксентмихайи', category: 'Позитивная психология', description: 'Состояние полного погружения. Когда время исчезает и ты полностью в моменте.', question: 'Когда последний раз ты терял счёт времени от увлечённости? Что ты делал?' },
  { title: 'Акт доброты', source: 'Соня Любомирски', category: 'Позитивная психология', description: 'Одно маленькое доброе действие в день. Для другого или для себя. Это повышает уровень счастья.', question: 'Какой маленький акт доброты ты можешь совершить сегодня?' },
  { title: 'Сильные стороны', source: 'VIA Institute', category: 'Позитивная психология', description: 'Каждый человек обладает уникальным набором сильных сторон. Важно знать и использовать свои.', question: 'Какие три качества в себе ты ценишь больше всего? Как ты их проявил сегодня?' },
  { title: 'Сканирование момента', source: 'Джон Кабат-Зинн', category: 'Осознанность', description: 'Остановись прямо сейчас. Что ты видишь, слышишь, чувствуешь? Просто замечай.', question: 'Что ты замечаешь прямо сейчас — в теле, в мыслях, вокруг?' },
  { title: 'Наблюдение мыслей', source: 'ACT-терапия', category: 'Осознанность', description: 'Мысли — как облака. Они приходят и уходят. Ты — небо, а не облака.', question: 'Какие мысли сейчас проплывают? Можешь ли ты просто наблюдать их, не цепляясь?' },
  { title: 'Благодарное присутствие', source: 'Тик Нат Хан', category: 'Осознанность', description: 'Прямо сейчас есть многое за что можно быть благодарным. Дыхание. Тишина. Жизнь.', question: 'За что ты благодарен прямо в этот момент? Назови пять вещей.' },
  { title: 'Осознанная прогулка', source: 'MBSR', category: 'Осознанность', description: 'Иди медленно. Чувствуй каждый шаг. Замечай воздух на коже. Это медитация в движении.', question: 'Можешь ли ты сегодня выйти на 10 минут и просто идти — без телефона, без цели?' },
  { title: 'Поиск смысла', source: 'Виктор Франкл', category: 'Экзистенциальная', description: 'Человек может вынести почти всё — если знает зачем. Смысл не находят — его создают.', question: 'Что придаёт смысл твоей жизни прямо сейчас? Что делает её стоящей?' },
  { title: 'Свобода выбора', source: 'Ролло Мэй', category: 'Экзистенциальная', description: 'Между стимулом и реакцией есть пространство. В нём — твоя свобода. В нём — твой рост.', question: 'Где в жизни ты чувствуешь себя несвободным? Какой выбор у тебя на самом деле есть?' },
  { title: 'Конечность как дар', source: 'Ирвин Ялом', category: 'Экзистенциальная', description: 'Осознание конечности не отнимает радость — оно делает каждый момент ценнее.', question: 'Что бы изменилось в твоей жизни если бы ты помнил о конечности каждый день?' },
  { title: 'Аутентичность', source: 'Карл Роджерс', category: 'Экзистенциальная', description: 'Быть собой — самый смелый поступок. Не играть роль, а быть настоящим.', question: 'Где в жизни ты играешь роль? Каково было бы снять маску?' },
  { title: 'Парадоксальная интенция', source: 'Виктор Франкл', category: 'Экзистенциальная', description: 'Иногда чтобы победить страх — нужно пожелать того чего боишься. Парадокс который работает.', question: 'Что если то чего ты боишься — произойдёт? Представь это намеренно. Что чувствуешь?' },
  { title: 'Журнал энергии', source: 'Позитивная психология', category: 'Практическое', description: 'Отследи что даёт тебе энергию а что забирает. Знание — уже половина решения.', question: 'Что сегодня дало тебе энергию? Что забрало? Замечаешь паттерн?' },
  { title: 'Правило двух минут', source: 'Дэвид Аллен', category: 'Практическое', description: 'Если дело занимает меньше двух минут — сделай его сейчас. Маленькие победы складываются.', question: 'Что маленькое ты откладывал? Можешь ли сделать это прямо сейчас?' },
  { title: 'Одна вещь', source: 'Гэри Келлер', category: 'Практическое', description: 'Какая одна вещь, сделав которую сегодня, ты будешь доволен днём? Только одна.', question: 'Если бы ты мог сделать только одну вещь сегодня — что бы это было?' },
  { title: 'Письмо себе', source: 'Нарративная терапия', category: 'Практическое', description: 'Напиши письмо себе — из будущего или из прошлого. Это мощный инструмент самопознания.', question: 'Что бы ты сказал себе 10-летнему? Или что скажет тебе ты из будущего?' },
  { title: 'Ценности', source: 'ACT-терапия', category: 'Практическое', description: 'Ценности — это не цели. Это направления. Компас который всегда с тобой.', question: 'Какие три ценности для тебя самые важные? Живёшь ли ты в согласии с ними?' },
];

export default function Compass() {
  const { isDark } = useTheme();
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const todayPractice = practices[dayOfYear % practices.length];

  const history = JSON.parse(localStorage.getItem('mirror-compass') || '[]');

  const todayStr = today.toISOString().split('T')[0];
  const alreadyDone = history.some((h: any) => h.date === todayStr);

  const handleSave = () => {
    if (!answer.trim()) return;
    const entry = {
      date: todayStr,
      practice: todayPractice.title,
      answer: answer.trim(),
    };
    const updated = [entry, ...history];
    localStorage.setItem('mirror-compass', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setAnswer('');
  };

  const categoryColors: Record<string, string> = {
    'Стоицизм': '#8B6914',
    'КПТ': '#4A6B6B',
    'Позитивная психология': '#5B6B4A',
    'Осознанность': '#6B4A5B',
    'Экзистенциальная': '#4A4A6B',
    'Практическое': '#6B5B4A',
  };

  return (
    <div style={{ padding: '1rem 1rem 6rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧭</div>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.8rem',
          fontWeight: 600,
          color: isDark ? '#e8d5b7' : '#2c2416',
        }}>Компас</h1>
        <p style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: '0.85rem',
          color: isDark ? '#a89070' : '#8B7355',
          marginTop: '0.3rem',
        }}>
          Каждый день — новое направление
        </p>
      </div>

      {/* Практика дня */}
      <div style={{
        background: isDark ? 'rgba(200,146,42,0.08)' : 'rgba(255,255,255,0.7)',
        border: `1px solid ${isDark ? 'rgba(200,146,42,0.15)' : '#e8d5b7'}`,
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.2rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontFamily: 'Raleway, sans-serif',
          background: categoryColors[todayPractice.category] || '#6b5a44',
          color: '#fff',
          marginBottom: '0.8rem',
        }}>
          {todayPractice.category} · {todayPractice.source}
        </div>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.4rem',
          fontWeight: 600,
          color: isDark ? '#e8d5b7' : '#2c2416',
          marginBottom: '0.8rem',
        }}>
          {todayPractice.title}
        </h2>

        <p style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: isDark ? '#a89070' : '#5c4a2a',
          marginBottom: '1.2rem',
        }}>
          {todayPractice.description}
        </p>

        <div style={{
          padding: '1rem',
          background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(200,146,42,0.06)',
          borderRadius: '12px',
          marginBottom: '1rem',
        }}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: isDark ? '#c8922a' : '#8B6914',
          }}>
            «{todayPractice.question}»
          </p>
        </div>

        {!alreadyDone && !saved && (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Твой ответ..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '1rem',
                borderRadius: '12px',
                border: `1px solid ${isDark ? 'rgba(200,146,42,0.2)' : '#e8d5b7'}`,
                background: isDark ? 'rgba(0,0,0,0.3)' : '#fff',
                color: isDark ? '#e8d5b7' : '#2c2416',
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.9rem',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleSave}
              disabled={!answer.trim()}
              style={{
                width: '100%',
                padding: '0.8rem',
                marginTop: '0.8rem',
                borderRadius: '12px',
                border: 'none',
                background: answer.trim() ? 'linear-gradient(135deg, #c8922a, #a07520)' : (isDark ? '#2a2a2a' : '#ddd'),
                color: answer.trim() ? '#fff' : '#999',
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: answer.trim() ? 'pointer' : 'default',
              }}
            >
              Сохранить ✓
            </button>
          </>
        )}

        {(alreadyDone || saved) && (
          <div style={{
            textAlign: 'center',
            padding: '1rem',
            background: isDark ? 'rgba(200,146,42,0.08)' : 'rgba(200,146,42,0.06)',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1rem',
              color: isDark ? '#c8922a' : '#8B6914',
            }}>
              Сегодняшняя практика выполнена
            </p>
          </div>
        )}
      </div>

      {/* История */}
      {history.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'none',
              border: `1px solid ${isDark ? 'rgba(200,146,42,0.15)' : '#e8d5b7'}`,
              borderRadius: '12px',
              color: isDark ? '#a89070' : '#8B7355',
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {showHistory ? 'Скрыть историю' : `История практик (${history.length})`}
          </button>

          {showHistory && (
            <div style={{ marginTop: '1rem' }}>
              {history.map((h: any, i: number) => (
                <div key={i} style={{
                  padding: '1rem',
                  marginBottom: '0.8rem',
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${isDark ? 'rgba(200,146,42,0.1)' : '#e8d5b7'}`,
                  borderRadius: '12px',
                }}>
                  <div style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '0.7rem',
                    color: isDark ? '#6b5a44' : '#a09080',
                    marginBottom: '0.3rem',
                  }}>
                    {new Date(h.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: isDark ? '#c8922a' : '#5c4a2a',
                    marginBottom: '0.5rem',
                  }}>
                    {h.practice}
                  </div>
                  <p style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '0.85rem',
                    color: isDark ? '#a89070' : '#5c4a2a',
                    lineHeight: 1.5,
                  }}>
                    {h.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
