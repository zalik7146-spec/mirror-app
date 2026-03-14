import { Section } from '../App';
import { useTheme } from '../context/ThemeContext';

interface Props { current: Section; onNavigate: (s: Section) => void; }

export default function Navigation({ current, onNavigate }: Props) {
  const { isDark } = useTheme();
  const bg = isDark ? '#1a1410' : '#fdf6ec';
  const border = isDark ? '#3d2e1e' : '#e8d5b0';

  const items: { id: Section; emoji: string }[] = [
    { id: 'home', emoji: '🪞' },
    { id: 'diary', emoji: '📖' },
    { id: 'gratitude', emoji: '🙏' },
    { id: 'mood', emoji: '🌡️' },
    { id: 'workshop', emoji: '🛠️' },
    { id: 'compass', emoji: '🧭' },
    { id: 'mirror', emoji: '🔮' },
    { id: 'sage', emoji: '💬' },
    { id: 'settings', emoji: '⚙️' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: bg, borderTop: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingTop: '0.5rem', zIndex: 100,
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)} style={{
          background: current === item.id ? (isDark ? '#2d1f0e' : '#f5e6c8') : 'none',
          border: 'none', cursor: 'pointer',
          fontSize: current === item.id ? '1.6rem' : '1.4rem',
          padding: '0.4rem',
          width: '2.5rem', height: '2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%',
          transform: current === item.id ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.2s ease',
        }}>
          {item.emoji}
        </button>
      ))}
    </nav>
  );
}
