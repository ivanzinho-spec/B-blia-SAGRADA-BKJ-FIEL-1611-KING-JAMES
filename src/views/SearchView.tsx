import React, { useState, useMemo } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { searchScripture, SearchResult } from '../data/bibleVerses';
import { Search, BookOpen, ArrowRight, Sparkles, X } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { openChapter, settings } = useBible();
  const theme = getThemeStyles(settings.theme);

  const [query, setQuery] = useState('');

  const suggestions = [
    'Amor',
    'Paz',
    'Fé',
    'Esperança',
    'Perdão',
    'Coração',
    'Luz',
    'Graça',
    'Salvação',
    'João 3:16',
    'Salmos 23',
    'Salmos 91',
    'Mateus 5',
  ];

  const results: SearchResult[] = useMemo(() => {
    return searchScripture(query, settings.translation || 'BKJ');
  }, [query, settings.translation]);

  const highlightMatch = (text: string, term: string) => {
    if (!term || term.length < 2) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark
          key={i}
          className="bg-amber-300 dark:bg-amber-500/40 text-stone-950 dark:text-amber-100 rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className={`font-display-bible text-2xl sm:text-3xl font-bold tracking-tight ${theme.textPrimary}`}>
          Pesquisa Bíblica
        </h1>
        <p className={`text-xs sm:text-sm ${theme.textSecondary} mt-1`}>
          Busque por palavras sagradas, temas de reflexão ou referências diretas (ex: João 3:16, Salmos 23, Fé).
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: João 3:16, amor, refúgio, pastor..."
          autoFocus
          className={`w-full pl-11 pr-10 py-3 rounded-2xl border text-sm sm:text-base ${theme.cardBorder} ${theme.cardBg} ${theme.textPrimary} placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs`}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            aria-label="Limpar pesquisa"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested Search Keywords */}
      <div className="space-y-2">
        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${theme.textMuted}`}>
          Sugestões Frequentes:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {suggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => setQuery(sug)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                query.toLowerCase() === sug.toLowerCase()
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : `${theme.cardBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.textPrimary} hover:border-amber-500`
              }`}
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-semibold uppercase tracking-wider ${theme.textMuted}`}>
            Resultados Encontrados ({results.length})
          </span>
          {query && (
            <span className={theme.textSecondary}>
              Para termo "{query}"
            </span>
          )}
        </div>

        {results.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${theme.cardBorder} ${theme.cardBg}`}>
            <Search className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
            <p className={`font-semibold ${theme.textPrimary}`}>
              {query ? 'Nenhum versículo encontrado' : 'Digite uma palavra ou referência acima'}
            </p>
            <p className={`text-xs ${theme.textMuted} mt-1 max-w-sm mx-auto`}>
              {query
                ? 'Tente buscar por termos como "pastor", "esperança", "caminho" ou livros como "Salmos" e "João".'
                : 'Você pode pesquisar passagens como "Salmos 91:1", "Mateus 5" ou palavras inspiradoras como "Paz".'}
            </p>
          </div>
        ) : (
          results.map((res, idx) => (
            <div
              key={`${res.bookId}-${res.chapter}-${res.verse}-${idx}`}
              onClick={() => openChapter(res.bookId, res.chapter)}
              className={`p-4 sm:p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} hover:border-amber-500 hover:shadow-xs transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display-bible font-bold text-sm sm:text-base text-amber-600 dark:text-amber-400 group-hover:underline">
                    {res.bookName} {res.chapter}:{res.verse}
                  </span>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${theme.cardBorder} border ${theme.textMuted}`}>
                    {res.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}
                  </span>
                </div>

                <p className={`font-serif-bible text-sm sm:text-base leading-relaxed ${theme.textPrimary}`}>
                  {highlightMatch(res.text, query)}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 self-end sm:self-center">
                <span>Ler Capítulo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
