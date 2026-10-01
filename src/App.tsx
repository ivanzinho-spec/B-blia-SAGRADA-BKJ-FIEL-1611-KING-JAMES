/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BibleProvider, useBible } from './context/BibleContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { BooksView } from './views/BooksView';
import { ReaderView } from './views/ReaderView';
import { SearchView } from './views/SearchView';
import { MySpaceView } from './views/MySpaceView';
import { ShareVerseModal } from './components/ShareVerseModal';
import { getThemeStyles } from './utils/theme';
import { BookOpen, Heart } from 'lucide-react';

const BibleAppContent: React.FC = () => {
  const { activeTab, setActiveTab, settings } = useBible();
  const theme = getThemeStyles(settings.theme);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${theme.appBg} ${theme.textPrimary}`}
    >
      {/* Top Header */}
      <Header />

      {/* Main View Display */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'books' && <BooksView />}
        {activeTab === 'reader' && <ReaderView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'space' && <MySpaceView />}
      </main>

      {/* Verse Share & Graphic Card Generator Modal */}
      <ShareVerseModal />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Clean Footer (Desktop) */}
      <footer
        className={`hidden md:block py-6 border-t ${theme.cardBorder} transition-colors duration-200 text-xs ${theme.textMuted}`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              Bíblia Sagrada Digital
            </span>
            <span aria-hidden="true">·</span>
            <span>Tradução King James 1611 (BKJ)</span>
            <span aria-hidden="true">·</span>
            <span>66 Livros</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:${theme.textPrimary} transition-colors`}
            >
              Versículo do Dia
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`hover:${theme.textPrimary} transition-colors`}
            >
              Índice de Livros
            </button>
            <button
              onClick={() => setActiveTab('space')}
              className={`hover:${theme.textPrimary} transition-colors`}
            >
              Favoritos & Notas
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BibleProvider>
      <BibleAppContent />
    </BibleProvider>
  );
}
