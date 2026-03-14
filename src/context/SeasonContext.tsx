import { createContext, useContext, ReactNode } from 'react';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonContextType { season: Season; }

const SeasonContext = createContext<SeasonContextType>({ season: 'spring' });

function getSeason(): Season {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

export function SeasonProvider({ children }: { children: ReactNode }) {
  return <SeasonContext.Provider value={{ season: getSeason() }}>{children}</SeasonContext.Provider>;
}

export function useSeason() { return useContext(SeasonContext); }
