import { ThemeMode } from '../types/bible';

export interface ThemeStyles {
  appBg: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentBg: string;
  highlightGold: string;
  highlightGreen: string;
  highlightBlue: string;
  highlightRose: string;
  highlightPurple: string;
}

export const getThemeStyles = (theme: ThemeMode): ThemeStyles => {
  switch (theme) {
    case 'dark':
      return {
        appBg: 'bg-slate-950',
        cardBg: 'bg-slate-900',
        cardBorder: 'border-slate-800',
        headerBg: 'bg-slate-950/90 backdrop-blur-md border-slate-800/80',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-500',
        accent: 'text-amber-400',
        accentHover: 'hover:text-amber-300',
        accentBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        highlightGold: 'bg-amber-950/60 border-l-4 border-amber-500 text-amber-200',
        highlightGreen: 'bg-emerald-950/60 border-l-4 border-emerald-500 text-emerald-200',
        highlightBlue: 'bg-sky-950/60 border-l-4 border-sky-500 text-sky-200',
        highlightRose: 'bg-rose-950/60 border-l-4 border-rose-500 text-rose-200',
        highlightPurple: 'bg-purple-950/60 border-l-4 border-purple-500 text-purple-200',
      };
    case 'sepia':
      return {
        appBg: 'bg-[#F4EFE6]',
        cardBg: 'bg-[#EFE8DD]',
        cardBorder: 'border-[#DFD5C6]',
        headerBg: 'bg-[#F4EFE6]/95 backdrop-blur-md border-[#DFD5C6]',
        textPrimary: 'text-[#362B20]',
        textSecondary: 'text-[#5C4D3C]',
        textMuted: 'text-[#8A7965]',
        accent: 'text-[#8C4A17]',
        accentHover: 'hover:text-[#6D360E]',
        accentBg: 'bg-[#E8DCC9] text-[#7A3F14] border-[#D6C4AD]',
        highlightGold: 'bg-[#F6E7B8]/70 border-l-4 border-[#C88A22] text-[#4A3205]',
        highlightGreen: 'bg-[#D6E6D1]/70 border-l-4 border-[#4E8546] text-[#1E3B18]',
        highlightBlue: 'bg-[#D2E2EC]/70 border-l-4 border-[#3D779A] text-[#183547]',
        highlightRose: 'bg-[#F2D6DB]/70 border-l-4 border-[#B85368] text-[#4F1A25]',
        highlightPurple: 'bg-[#E4D7EC]/70 border-l-4 border-[#7E5296] text-[#341845]',
      };
    case 'light':
    default:
      return {
        appBg: 'bg-[#FBF9F5]',
        cardBg: 'bg-white',
        cardBorder: 'border-stone-200',
        headerBg: 'bg-[#FBF9F5]/90 backdrop-blur-md border-stone-200',
        textPrimary: 'text-stone-900',
        textSecondary: 'text-stone-700',
        textMuted: 'text-stone-400',
        accent: 'text-amber-700',
        accentHover: 'hover:text-amber-800',
        accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
        highlightGold: 'bg-amber-50/90 border-l-4 border-amber-400 text-stone-900',
        highlightGreen: 'bg-emerald-50/90 border-l-4 border-emerald-400 text-stone-900',
        highlightBlue: 'bg-sky-50/90 border-l-4 border-sky-400 text-stone-900',
        highlightRose: 'bg-rose-50/90 border-l-4 border-rose-400 text-stone-900',
        highlightPurple: 'bg-purple-50/90 border-l-4 border-purple-400 text-stone-900',
      };
  }
};
