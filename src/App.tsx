import { useState, useRef } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Diary from './components/Diary';
import Workshop from './components/Workshop';
import Gratitude from './components/Gratitude';
import Mood from './components/Mood';
import Sage from './components/Sage';
import Settings from './components/Settings';
import Weekly from './components/Weekly';
import Mirror from './components/Mirror';
import Onboarding from './components/Onboarding';

export type Section = 'home' | 'diary' | 'workshop' | 'gratitude' | 'mood' | 'sage' | 'settings' | 'weekly' | 'mirror';

function usePageSound() {
  const audioCtx = useRef<AudioContext | null>(null);

  const playPageTurn = () => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtx.current;
      const soundEnabled = localStorage.getItem('mirror_sound') !== 'false';
      if (!soundEnabled) return;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Мягкий тёплый тон — два синуса, как тихий вздох
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(200, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.2);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(300, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);

      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.06);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc1.connect(gain1); gain1.connect(masterGain);
      osc2.connect(gain2); gain2.connect(masterGain);

      osc1.start(ctx.currentTime); osc1.stop(ctx.currentTime + 0.25);
      osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // тихо игнорируем если браузер не поддерживает
    }
  };

  return playPageTurn;
}

function LibrarySound() {
  const { isDark } = useTheme();
  const [playing, setPlaying] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const noiseNode = useRef<AudioBufferSourceNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  const toggle = () => {
    try {
      if (playing) {
        gainNode.current?.gain.linearRampToValueAtTime(0, (audioCtx.current?.currentTime || 0) + 0.5);
        setTimeout(() => {
          noiseNode.current?.stop();
          setPlaying(false);
        }, 500);
        return;
      }

      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtx.current;

      // Создаём тихий розовый шум — как тишина библиотеки
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.05;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();

      noiseNode.current = source;
      gainNode.current = gain;
      setPlaying(true);
    } catch (e) {}
  };

  return (
    <button
      onClick={toggle}
      title={playing ? 'Выключить звук библиотеки' : 'Звук библиотеки'}
      style={{
        position: 'fixed',
        top: '16px',
        right: '64px',
        zIndex: 100,
        background: playing
          ? 'rgba(200, 146, 42, 0.2)'
          : isDark
            ? 'rgba(200, 146, 42, 0.1)'
            : 'rgba(44, 36, 22, 0.06)',
        border: playing
          ? '1px solid rgba(200, 146, 42, 0.4)'
          : isDark
            ? '1px solid rgba(200, 146, 42, 0.2)'
            : '1px solid rgba(44, 36, 22, 0.1)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.4s ease',
      }}
    >
      {playing ? '🔊' : '🔈'}
    </button>
  );
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Дневная тема' : 'Ночная тема'}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 100,
        background: isDark
          ? 'rgba(200, 146, 42, 0.15)'
          : 'rgba(44, 36, 22, 0.08)',
        border: isDark
          ? '1px solid rgba(200, 146, 42, 0.3)'
          : '1px solid rgba(44, 36, 22, 0.12)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.4s ease',
        boxShadow: isDark
          ? '0 2px 12px rgba(0,0,0,0.3)'
          : '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

function AppInner() {
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('mirror_onboarded') === 'true';
  });
  const [section, setSection] = useState<Section>('home');
  const [animKey, setAnimKey] = useState(0);
  const playPageTurn = usePageSound();

  const handleOnboardingComplete = (name: string) => {
    if (name) localStorage.setItem('mirror_user_name', name);
    localStorage.setItem('mirror_onboarded', 'true');
    setOnboarded(true);
  };

  const navigate = (s: Section) => {
    playPageTurn();
    setSection(s);
    setAnimKey(k => k + 1);
  };

  const renderSection = () => {
    switch (section) {
      case 'home':      return <Home onNavigate={navigate} />;
      case 'diary':     return <Diary />;
      case 'workshop':  return <Workshop />;
      case 'gratitude': return <Gratitude />;
      case 'mood':      return <Mood />;
      case 'sage':      return <Sage onGoToSettings={() => navigate('settings')} />;
      case 'settings':  return <Settings />;
      case 'weekly':    return <Weekly />;
      case 'mirror':    return <Mirror />;
      default:          return <Home onNavigate={navigate} />;
    }
  };

  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="library-bg" style={{ minHeight: '100vh' }}>
      <ThemeToggle />
      <LibrarySound />
      <main key={animKey} className="page-flip">
        {renderSection()}
      </main>
      <Navigation current={section} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
