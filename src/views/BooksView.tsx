import React, { useState } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { BIBLE_BOOKS, CATEGORIES_ORDER } from '../data/bibleBooks';
import { Book, Testament, BookCategory } from '../types/bible';
import { Search, ChevronDown, ChevronUp, BookOpen, Layers } from 'lucide-react';

export const BooksView: React.FC = () => {
  const { openChapter, activeBook, activeChapter, settings } = useBible();
  const theme = getThemeStyles(settings.theme);

  const [testamentFilter, setTestamentFilter] = useState<'ALL' | Testament>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBookId, setExpandedBookId] = useState<string | null>(activeBook.id);

  // Filter books
  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    const matchesTestament = testamentFilter === 'ALL' || b.testament === testamentFilter;
    const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.abbrev.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesCategory && matchesSearch;
  });

  const categories =
    testamentFilter === 'AT'
      ? CATEGORIES_ORDER.AT
      : testamentFilter === 'NT'
      ? CATEGORIES_ORDER.NT
      : [...CATEGORIES_ORDER.AT, ...CATEGORIES_ORDER.NT];

  const uniqueCategories = Array.from(new Set(categories));

  const toggleExpand = (bookId: string) => {
    setExpandedBookId((prev) => (prev === bookId ? null : bookId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-display-bible text-2xl sm:text-3xl font-bold tracking-tight ${theme.textPrimary}`}>
            Livros e Capítulos
          </h1>
          <p className={`text-xs sm:text-sm ${theme.textSecondary} mt-1`}>
            Explore os 66 livros da Bíblia Sagrada. Toque em qualquer capítulo para ler os versículos.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar livro (ex: Salmos, Romanos)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${theme.cardBorder} bg-transparent ${theme.textPrimary} placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500`}
          />
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="space-y-3">
        {/* Testament Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-2xl w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => {
              setTestamentFilter('ALL');
              setSelectedCategory('ALL');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              testamentFilter === 'ALL'
                ? 'bg-amber-600 text-white shadow-xs'
                : `${theme.textSecondary} hover:${theme.textPrimary}`
            }`}
          >
            Todos os Livros (66)
          </button>
          <button
            onClick={() => {
              setTestamentFilter('AT');
              setSelectedCategory('ALL');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              testamentFilter === 'AT'
                ? 'bg-amber-600 text-white shadow-xs'
                : `${theme.textSecondary} hover:${theme.textPrimary}`
            }`}
          >
            Antigo Testamento (39)
          </button>
          <button
            onClick={() => {
              setTestamentFilter('NT');
              setSelectedCategory('ALL');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              testamentFilter === 'NT'
                ? 'bg-amber-600 text-white shadow-xs'
                : `${theme.textSecondary} hover:${theme.textPrimary}`
            }`}
          >
            Novo Testamento (27)
          </button>
        </div>

        {/* Category Pills (functional filter buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                : `${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`
            }`}
          >
            Todas as Categorias
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                  : `${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books List / Accordion Cards */}
      <div className="space-y-3">
        {filteredBooks.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${theme.cardBorder} ${theme.cardBg}`}>
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className={`font-semibold ${theme.textPrimary}`}>Nenhum livro encontrado</p>
            <p className={`text-xs ${theme.textMuted} mt-1`}>
              Tente buscar por outro termo ou remova os filtros ativos.
            </p>
          </div>
        ) : (
          filteredBooks.map((book) => {
            const isExpanded = expandedBookId === book.id;
            const isCurrentBook = activeBook.id === book.id;

            return (
              <div
                key={book.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${theme.cardBg} ${
                  isCurrentBook ? 'border-amber-500/60 shadow-xs' : theme.cardBorder
                }`}
              >
                {/* Book Header Trigger */}
                <button
                  onClick={() => toggleExpand(book.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors hover:bg-stone-500/5 focus-visible:outline-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 sm:gap-4 truncate">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                        book.testament === 'AT'
                          ? 'bg-amber-600/10 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {book.abbrev}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h2 className={`font-display-bible text-base sm:text-lg font-bold truncate ${theme.textPrimary}`}>
                          {book.name}
                        </h2>
                        {isCurrentBook && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 shrink-0">
                            Lendo Atual
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${theme.textMuted} mt-0.5`}>
                        <span>{book.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.chaptersCount} capítulos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="hidden sm:inline text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {isExpanded ? 'Ocultar Capítulos' : 'Ver Capítulos'}
                    </span>
                    <div className={`p-1.5 rounded-lg text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </button>

                {/* Expanded Chapters Drawer */}
                {isExpanded && (
                  <div className={`p-4 sm:p-5 border-t ${theme.cardBorder} bg-black/5 dark:bg-white/5 animate-in slide-in-from-top-2 duration-150`}>
                    <p className={`text-xs ${theme.textSecondary} mb-3 italic`}>
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className={`font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                        Selecione o Capítulo:
                      </span>
                      <span className={`text-[11px] ${theme.textMuted}`}>
                        Toque para abrir os versículos
                      </span>
                    </div>

                    {/* Chapters Grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2">
                      {Array.from({ length: book.chaptersCount }, (_, i) => i + 1).map((ch) => {
                        const isCurrentChapter = isCurrentBook && activeChapter === ch;
                        return (
                          <button
                            key={ch}
                            onClick={() => openChapter(book.id, ch)}
                            className={`h-11 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${
                              isCurrentChapter
                                ? 'bg-amber-600 text-white font-bold shadow-xs ring-2 ring-amber-500/40 scale-105'
                                : `border ${theme.cardBorder} ${theme.cardBg} ${theme.textPrimary} hover:border-amber-500 hover:bg-amber-500/10`
                            }`}
                            aria-label={`Abrir ${book.name} capítulo ${ch}`}
                          >
                            {ch}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
