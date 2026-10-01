import React from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { Home, BookOpen, BookMarked, Search, Bookmark } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeBook, activeChapter, settings } = useBible();
  const theme = getThemeStyles(settings.theme);

  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'books', label: 'Livros', icon: BookOpen },
    { id: 'reader', label: `${activeBook.abbrev} ${activeChapter}`, icon: BookMarked },
    { id: 'search', label: 'Busca', icon: Search },
    { id: 'space', label: 'Espaço', icon: Bookmark },
  ] as const;

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 border-t ${theme.headerBg} ${theme.cardBorder} px-2 flex items-center justify-around transition-colors duration-200`}
      aria-label="Navegação móvel"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-colors focus-visible:outline-none ${
              isActive
                ? `${theme.accent} font-semibold`
                : `${theme.textMuted} hover:${theme.textSecondary}`
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight truncate max-w-[60px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
