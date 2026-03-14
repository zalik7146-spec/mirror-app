import { useTheme } from '../context/ThemeContext';

type Section = 'home' | 'diary' | 'workshop' | 'gratitude' | 'mood' | 'sage' | 'compass' | 'mirror' | 'settings';

interface NavigationProps {
  current: Section;
  onNavigate: (section: Section) => void;
}

const navItems = [
  { id: 'diary' as Section, emoji: '📖' },
  { id: 'workshop' as Section, emoji: '🛠️' },
  { id: 'gratitude' as Section, emoji: '🙏' },
  { id: 'mood' as Section, emoji: '🌡️' },
  { id: 'compass' as Section, emoji: '🧭' },
  { id: 'mirror' as Section, emoji: '🔮' },
  { id: 'sage' as Section, emoji: '💬' },
  { id: 'settings' as Section, emoji: '⚙️' },
];

export default function Navigation({ current, onNavigate }: NavigationProps) {
  const { isDark } = useTheme();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: isDark ? 'rgba(15,10,5,0.95)' : 'rgba(250,243,230,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${isDark ? '#2a1a08' : '#e8d5b7'}`,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        <button
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: 'none',
            background: current === 'home' ? (isDark ? '#2a1a08' : '#f0e0c8') : 'transparent',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '1.1rem', opacity: current === 'home' ? 1 : 0.6 }}>🪞</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: isDark ? '#2a1a08' : '#e8d5b7' }} />

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: current === item.id ? (isDark ? '#2a1a08' : '#f0e0c8') : 'transparent',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '1.1rem', opacity: current === item.id ? 1 : 0.6 }}>{item.emoji}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
