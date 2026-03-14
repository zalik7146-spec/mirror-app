import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SeasonProvider } from './context/SeasonContext';
import Home from './components/Home';
import Diary from './components/Diary';
import Workshop from './components/Workshop';
import Gratitude from './components/Gratitude';
import Mood from './components/Mood';
import Sage from './components/Sage';
import Settings from './components/Settings';
import Compass from './components/Compass';
import Mirror from './components/Mirror';
import Onboarding from './components/Onboarding';
import Navigation from './components/Navigation';

export type Section = 'home' | 'diary' | 'workshop' | 'gratitude' | 'mood' | 'sage' | 'settings' | 'compass' | 'mirror';

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const [section, setSection] = useState<Section>('home');
  const [animKey, setAnimKey] = useState(0);
  const [onboarded] = useState(() => !!localStorage.getItem('mirror-onboarding-complete'));
  const [showOnboarding, setShowOnboarding] = useState(!onboarded);

  const navigate = (s: Section) => {
    setAnimKey(k => k + 1);
    setSection(s);
  };

  const bg = isDark ? '#1a1410' : '#fdf6ec';

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      {/* Theme toggle */}
      <button onClick={toggleTheme} className="safe-top-buttons" style={{
        position: 'fixed', right: '4rem', zIndex: 150,
        background: isDark ? '#2d2218' : '#fff9f0',
        border: `1px solid ${isDark ? '#3d2e1e' : '#e8d5b0'}`,
        borderRadius: '50%', width: '2.5rem', height: '2.5rem',
        cursor: 'pointer', fontSize: '1.1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isDark ? '☀️' : '🌙'}
      </button>

      <main key={animKey} className="animate-bookOpen" style={{ paddingBottom: '5rem' }}>
        {section === 'home' && <Home onNavigate={navigate} />}
        {section === 'diary' && <Diary />}
        {section === 'gratitude' && <Gratitude />}
        {section === 'mood' && <Mood />}
        {section === 'workshop' && <Workshop />}
        {section === 'compass' && <Compass />}
        {section === 'mirror' && <Mirror />}
        {section === 'sage' && <Sage />}
        {section === 'settings' && <Settings />}
      </main>

      <Navigation current={section} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SeasonProvider>
        <AppContent />
      </SeasonProvider>
    </ThemeProvider>
  );
}
