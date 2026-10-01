import React, { useState } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { X, Search, ChevronRight, BookOpen } from 'lucide-react';
import { Book, Testament } from '../types/bible';

interface ChapterPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChapterPickerModal: React.FC<ChapterPickerModalProps> = ({ isOpen, onClose }) => {
  const { activeBook, activeChapter, openChapter, settings } = useBible();
  const theme = getThemeStyles(settings.theme);

  const [selectedTestament, setSelectedTestament] = useState<Testament>(activeBook.testament);
  const [selectedBook, setSelectedBook] = useState<Book>(activeBook);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    const matchesTestament = b.testament === selectedTestament;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.abbrev.toLowerCase().includes(searchQuery.toLowerCase());
    return searchQuery ? matchesSearch : matchesTestament;
  });

  const handleSelectChapter = (chapterNum: number) => {
    openChapter(selectedBook.id, chapterNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${theme.cardBg} ${theme.cardBorder} transition-colors duration-200 animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme.cardBorder} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${theme.accent}`} />
            <h2 className={`font-display-bible text-lg font-bold ${theme.textPrimary}`}>
              Selecionar Livro e Capítulo
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg text-stone-400 hover:${theme.textPrimary} transition-colors`}
            aria-label="Fechar seletor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar: Testament buttons + Search */}
        <div className={`p-3 border-b ${theme.cardBorder} flex flex-col sm:flex-row gap-2.5`}>
          <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-xl self-start">
            <button
              onClick={() => {
                setSelectedTestament('AT');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTestament === 'AT' && !searchQuery
                  ? 'bg-amber-600 text-white shadow-xs'
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Antigo Testamento (39)
            </button>
            <button
              onClick={() => {
                setSelectedTestament('NT');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTestament === 'NT' && !searchQuery
                  ? 'bg-amber-600 text-white shadow-xs'
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Novo Testamento (27)
            </button>
          </div>

          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Filtrar livros (ex: Salmos, João...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border ${theme.cardBorder} bg-transparent ${theme.textPrimary} placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500`}
            />
          </div>
        </div>

        {/* Body: Two columns (Books on left, Chapters on right) */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-slate-800">
          {/* Books List */}
          <div className="overflow-y-auto max-h-[35vh] sm:max-h-[50vh] p-2 space-y-1">
            <div className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
              Livros ({filteredBooks.length})
            </div>
            {filteredBooks.map((book) => {
              const isSelected = selectedBook.id === book.id;
              return (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-amber-600 text-white font-medium shadow-xs'
                      : `${theme.textPrimary} hover:bg-stone-500/10`
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs opacity-80 shrink-0 w-8">{book.abbrev}</span>
                    <span className="truncate">{book.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-xs">
                    <span className="opacity-75">{book.chaptersCount} cap</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapters Grid */}
          <div className="overflow-y-auto max-h-[35vh] sm:max-h-[50vh] p-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className={`font-display-bible text-base font-bold ${theme.textPrimary}`}>
                  {selectedBook.name}
                </span>
                <span className={`block text-xs ${theme.textMuted}`}>
                  {selectedBook.category} · {selectedBook.chaptersCount} capítulos
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2">
              {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map((ch) => {
                const isCurrent = selectedBook.id === activeBook.id && ch === activeChapter;
                return (
                  <button
                    key={ch}
                    onClick={() => handleSelectChapter(ch)}
                    className={`h-10 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/30'
                        : `border ${theme.cardBorder} ${theme.textPrimary} hover:bg-amber-500/10 hover:border-amber-500/30`
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t ${theme.cardBorder} flex items-center justify-between text-xs ${theme.textMuted}`}>
          <span>Dica: Toque no número para abrir os versículos imediatamente.</span>
          <button
            onClick={onClose}
            className={`px-3 py-1.5 rounded-lg border ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
