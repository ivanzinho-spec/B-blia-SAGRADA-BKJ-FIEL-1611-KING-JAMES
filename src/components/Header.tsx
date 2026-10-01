import React, { useState } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { BookOpen, SlidersHorizontal, Layers } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { ChapterPickerModal } from './ChapterPickerModal';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, activeBook, activeChapter, settings } = useBible();
  const theme = getThemeStyles(settings.theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full transition-colors duration-200 border-b ${theme.headerBg} ${theme.cardBorder}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
            aria-label="Ir para a página inicial"
          >
            <div className="w-8 h-8 rounded-md bg-amber-600/10 flex items-center justify-center text-amber-700 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span
              className={`font-display-bible text-lg sm:text-xl font-bold tracking-tight ${theme.textPrimary}`}
            >
              Bíblia King James 1611
            </span>
          </button>

          {/* Zone 2: Navigation Links (single-line controls) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'home'
                  ? `${theme.cardBg} ${theme.textPrimary} shadow-xs border ${theme.cardBorder}`
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'books'
                  ? `${theme.cardBg} ${theme.textPrimary} shadow-xs border ${theme.cardBorder}`
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Livros
            </button>
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'reader'
                  ? `${theme.cardBg} ${theme.textPrimary} shadow-xs border ${theme.cardBorder}`
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Leitor ({activeBook.abbrev} {activeChapter})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'search'
                  ? `${theme.cardBg} ${theme.textPrimary} shadow-xs border ${theme.cardBorder}`
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Pesquisar
            </button>
            <button
              onClick={() => setActiveTab('space')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'space'
                  ? `${theme.cardBg} ${theme.textPrimary} shadow-xs border ${theme.cardBorder}`
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Meu Espaço
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Translation Badge Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-bold font-mono rounded-lg border transition-colors whitespace-nowrap bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20`}
              title="Tradução Ativa: Bíblia King James Fiel 1611 (Toque para trocar)"
            >
              <span>{settings.translation === 'BKJ' ? 'BKJ Fiel' : settings.translation}</span>
              {settings.translation === 'BKJ' && (
                <span className="text-[10px] opacity-75 hidden sm:inline">1611</span>
              )}
            </button>

            {/* Quick Book & Chapter Selector Button */}
            <button
              onClick={() => setIsPickerOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${theme.cardBg} ${theme.cardBorder} ${theme.textPrimary} hover:opacity-90`}
              title="Trocar Livro ou Capítulo"
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold">{activeBook.abbrev}</span>
              <span>{activeChapter}</span>
            </button>

            {/* Reading preferences: Font size, Theme & Translation */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-lg border transition-colors ${theme.cardBg} ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
              aria-label="Ajustes de leitura, tradução e tema"
              title="Ajustes de leitura (Tradução BKJ, Fonte e Tema)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Quick Chapter Picker Modal */}
      <ChapterPickerModal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} />
    </>
  );
};
