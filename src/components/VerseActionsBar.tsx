import React from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { Bookmark, Star, FileText, Share2, Volume2, X, Copy, Check } from 'lucide-react';
import { HighlightColor } from '../types/bible';

interface VerseActionsBarProps {
  selectedVerse: {
    bookId: string;
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
  } | null;
  onClose: () => void;
  onOpenNote: () => void;
}

export const VerseActionsBar: React.FC<VerseActionsBarProps> = ({
  selectedVerse,
  onClose,
  onOpenNote,
}) => {
  const {
    isBookmarked,
    toggleBookmark,
    highlights,
    setHighlightColor,
    setVerseToShare,
    settings,
  } = useBible();

  const [copied, setCopied] = React.useState(false);
  const theme = getThemeStyles(settings.theme);

  if (!selectedVerse) return null;

  const verseId = `${selectedVerse.bookId}-${selectedVerse.chapter}-${selectedVerse.verse}`;
  const bookmarked = isBookmarked(selectedVerse.bookId, selectedVerse.chapter, selectedVerse.verse);
  const currentHighlight = highlights[verseId];

  const highlightColors: { id: HighlightColor; name: string; bg: string; dot: string }[] = [
    { id: 'gold', name: 'Dourado', bg: 'bg-amber-400', dot: 'ring-amber-500' },
    { id: 'green', name: 'Esmeralda', bg: 'bg-emerald-400', dot: 'ring-emerald-500' },
    { id: 'blue', name: 'Céu', bg: 'bg-sky-400', dot: 'ring-sky-500' },
    { id: 'rose', name: 'Rosa', bg: 'bg-rose-400', dot: 'ring-rose-500' },
    { id: 'purple', name: 'Púrpura', bg: 'bg-purple-400', dot: 'ring-purple-500' },
  ];

  const handleCopy = async () => {
    try {
      const formatted = `"${selectedVerse.text}" — ${selectedVerse.bookName} ${selectedVerse.chapter}:${selectedVerse.verse}`;
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedVerse.text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-lg animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`rounded-2xl border shadow-2xl p-3 sm:p-4 ${theme.cardBg} ${theme.cardBorder} backdrop-blur-md`}
      >
        {/* Top Info */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-inherit text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
            <span>{selectedVerse.bookName}</span>
            <span>{selectedVerse.chapter}:{selectedVerse.verse}</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
            aria-label="Fechar ações do versículo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Highlight Picker */}
        <div className="flex items-center justify-between gap-1 mb-3">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
            Marcar Cor:
          </span>
          <div className="flex items-center gap-2">
            {highlightColors.map((hc) => {
              const isSelected = currentHighlight?.color === hc.id;
              return (
                <button
                  key={hc.id}
                  onClick={() =>
                    setHighlightColor(
                      selectedVerse.bookId,
                      selectedVerse.chapter,
                      selectedVerse.verse,
                      isSelected ? null : hc.id
                    )
                  }
                  className={`w-6 h-6 rounded-full ${hc.bg} transition-all ${
                    isSelected ? `ring-2 ring-offset-2 ring-stone-600 scale-110` : 'opacity-80 hover:opacity-100'
                  }`}
                  title={hc.name}
                  aria-label={`Destacar com cor ${hc.name}`}
                />
              );
            })}
            {currentHighlight && (
              <button
                onClick={() =>
                  setHighlightColor(
                    selectedVerse.bookId,
                    selectedVerse.chapter,
                    selectedVerse.verse,
                    null
                  )
                }
                className="text-[10px] text-stone-400 hover:text-rose-500 ml-1 underline"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-5 gap-1 pt-1">
          {/* Bookmark */}
          <button
            onClick={() =>
              toggleBookmark(
                selectedVerse.bookId,
                selectedVerse.chapter,
                selectedVerse.verse,
                selectedVerse.text
              )
            }
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition-colors ${
              bookmarked
                ? 'text-amber-500 font-semibold bg-amber-500/10'
                : `${theme.textSecondary} hover:bg-stone-500/10`
            }`}
          >
            <Star className={`w-4 h-4 mb-1 ${bookmarked ? 'fill-amber-500' : ''}`} />
            <span className="text-[11px]">{bookmarked ? 'Favorito' : 'Favoritar'}</span>
          </button>

          {/* Note */}
          <button
            onClick={onOpenNote}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition-colors ${theme.textSecondary} hover:bg-stone-500/10`}
          >
            <FileText className="w-4 h-4 mb-1" />
            <span className="text-[11px]">Anotação</span>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition-colors ${theme.textSecondary} hover:bg-stone-500/10`}
          >
            {copied ? (
              <Check className="w-4 h-4 mb-1 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 mb-1" />
            )}
            <span className={`text-[11px] ${copied ? 'text-emerald-500 font-semibold' : ''}`}>
              {copied ? 'Copiado' : 'Copiar'}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              setVerseToShare({
                bookName: selectedVerse.bookName,
                chapter: selectedVerse.chapter,
                verse: selectedVerse.verse,
                text: selectedVerse.text,
              });
              onClose();
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition-colors ${theme.textSecondary} hover:bg-stone-500/10`}
          >
            <Share2 className="w-4 h-4 mb-1" />
            <span className="text-[11px]">Card/Share</span>
          </button>

          {/* Audio TTS */}
          <button
            onClick={handleSpeak}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition-colors ${theme.textSecondary} hover:bg-stone-500/10`}
            title="Ouvir em áudio"
          >
            <Volume2 className="w-4 h-4 mb-1 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px]">Ouvir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
