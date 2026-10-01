import React, { useState, useEffect } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Star,
  FileText,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { VerseActionsBar } from '../components/VerseActionsBar';
import { NoteModal } from '../components/NoteModal';
import { SettingsModal } from '../components/SettingsModal';
import { ChapterPickerModal } from '../components/ChapterPickerModal';
import { Verse } from '../types/bible';

export const ReaderView: React.FC = () => {
  const {
    activeBook,
    activeChapter,
    currentVerses,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
    isBookmarked,
    highlights,
    notes,
    settings,
  } = useBible();

  const theme = getThemeStyles(settings.theme);

  const [selectedVerse, setSelectedVerse] = useState<{
    bookId: string;
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
  } | null>(null);

  const [noteModalVerse, setNoteModalVerse] = useState<{
    bookId: string;
    bookName: string;
    chapter: number;
    verse: number;
    verseText: string;
  } | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Audio reader states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentlySpeakingVerse, setCurrentlySpeakingVerse] = useState<number | null>(null);

  // Stop speech when chapter changes or unmounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentlySpeakingVerse(null);
    }
  }, [activeBook.id, activeChapter]);

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Síntese de voz não suportada neste navegador.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentlySpeakingVerse(null);
      return;
    }

    // Build speech queue or continuous text
    setIsPlayingAudio(true);
    let verseIndex = 0;

    const speakNext = () => {
      if (verseIndex >= currentVerses.length) {
        setIsPlayingAudio(false);
        setCurrentlySpeakingVerse(null);
        return;
      }

      const v = currentVerses[verseIndex];
      setCurrentlySpeakingVerse(v.number);

      const utterance = new SpeechSynthesisUtterance(`Versículo ${v.number}. ${v.text}`);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;

      utterance.onend = () => {
        verseIndex++;
        speakNext();
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setCurrentlySpeakingVerse(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const handleVerseClick = (v: Verse) => {
    if (selectedVerse?.verse === v.number) {
      setSelectedVerse(null);
    } else {
      setSelectedVerse({
        bookId: activeBook.id,
        bookName: activeBook.name,
        chapter: activeChapter,
        verse: v.number,
        text: v.text,
      });
    }
  };

  // Font size classes
  const fontSizeClass =
    settings.fontSize === 'sm'
      ? 'text-base sm:text-lg'
      : settings.fontSize === 'base'
      ? 'text-lg sm:text-xl'
      : settings.fontSize === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-2xl sm:text-3xl';

  const lineHeightClass =
    settings.lineHeight === 'normal'
      ? 'leading-relaxed'
      : settings.lineHeight === 'relaxed'
      ? 'leading-loose'
      : 'leading-extra-loose';

  const fontFamilyClass =
    settings.fontFamily === 'serif' ? 'font-serif-bible' : 'font-sans-bible';

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-300">
      {/* Reader Sticky Header Bar */}
      <div
        className={`sticky top-16 z-20 border-b transition-colors duration-200 ${theme.headerBg} ${theme.cardBorder}`}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          {/* Book & Chapter Trigger + Translation */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsPickerOpen(true)}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} ${theme.textPrimary} hover:border-amber-500 transition-colors focus-visible:outline-none`}
              title="Trocar Livro ou Capítulo"
            >
              <span className="font-display-bible text-base sm:text-lg font-bold">
                {activeBook.name} {activeChapter}
              </span>
              <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold uppercase">
                {activeBook.category}
              </span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-2 py-1 text-xs font-mono font-bold rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Tradução atual: King James 1611 (Toque para trocar)"
            >
              {settings.translation || 'BKJ'}
            </button>
          </div>

          {/* Action buttons: Speech & Settings */}
          <div className="flex items-center gap-2">
            {/* Audio Reader Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                  : `${theme.cardBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
              title={isPlayingAudio ? 'Parar leitura em voz' : 'Ouvir capítulo em áudio'}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Parar Áudio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="hidden sm:inline">Ouvir Capítulo</span>
                </>
              )}
            </button>

            {/* Typography Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-xl border ${theme.cardBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.textPrimary} transition-colors`}
              title="Ajustar Fonte e Modo de Leitura"
              aria-label="Ajustar fonte e modo"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Scripture Text Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        {/* Chapter Title Head */}
        <div className="text-center mb-8 pb-6 border-b border-inherit border-stone-200/50 dark:border-slate-800/50">
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-400 mb-1 block">
            {activeBook.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'} · {activeBook.category} · {settings.translation === 'BKJ' ? 'BKJ Fiel 1611' : settings.translation}
          </span>
          <h1 className={`font-display-bible text-3xl sm:text-4xl font-bold tracking-tight ${theme.textPrimary}`}>
            {activeBook.name} {activeChapter}
          </h1>
          <p className={`text-xs ${theme.textMuted} mt-1.5 max-w-md mx-auto`}>
            {activeBook.description} · <span className="font-semibold text-amber-700 dark:text-amber-400">Tradução King James Fiel 1611</span>
          </p>
        </div>

        {/* Verses List */}
        <div className={`space-y-4 ${fontFamilyClass} ${fontSizeClass} ${lineHeightClass}`}>
          {currentVerses.map((v) => {
            const verseKey = `${activeBook.id}-${activeChapter}-${v.number}`;
            const isSelected = selectedVerse?.verse === v.number;
            const bookmarked = isBookmarked(activeBook.id, activeChapter, v.number);
            const hl = highlights[verseKey];
            const verseNote = notes[verseKey];
            const isSpeakingThis = currentlySpeakingVerse === v.number;

            // Highlight theme style
            let highlightStyle = '';
            if (hl) {
              if (hl.color === 'gold') highlightStyle = theme.highlightGold;
              else if (hl.color === 'green') highlightStyle = theme.highlightGreen;
              else if (hl.color === 'blue') highlightStyle = theme.highlightBlue;
              else if (hl.color === 'rose') highlightStyle = theme.highlightRose;
              else if (hl.color === 'purple') highlightStyle = theme.highlightPurple;
            }

            return (
              <div
                key={v.number}
                onClick={() => handleVerseClick(v)}
                className={`relative group rounded-xl p-2.5 sm:p-3 cursor-pointer transition-all duration-150 ${
                  highlightStyle ? highlightStyle : ''
                } ${
                  isSelected
                    ? 'ring-2 ring-amber-500 bg-amber-500/10'
                    : 'hover:bg-stone-500/5'
                } ${isSpeakingThis ? 'ring-2 ring-amber-400 bg-amber-400/15' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Verse Number */}
                  <span
                    className={`select-none font-mono text-xs font-bold shrink-0 mt-1 ${
                      isSelected
                        ? 'text-amber-600 dark:text-amber-400'
                        : theme.textMuted
                    }`}
                  >
                    {v.number}
                  </span>

                  {/* Verse Text */}
                  <p className={`flex-1 ${theme.textPrimary}`}>
                    {v.text}
                  </p>

                  {/* Visual Badges: Bookmark & Note indicators */}
                  <div className="flex items-center gap-1 shrink-0 ml-1 select-none">
                    {bookmarked && (
                      <span title="Versículo Favorito">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      </span>
                    )}
                    {verseNote && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteModalVerse({
                            bookId: activeBook.id,
                            bookName: activeBook.name,
                            chapter: activeChapter,
                            verse: v.number,
                            verseText: v.text,
                          });
                        }}
                        className="text-amber-600 dark:text-amber-400 hover:scale-110 p-0.5"
                        title="Ver Anotação Pessoal"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline note preview if exists */}
                {verseNote && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setNoteModalVerse({
                        bookId: activeBook.id,
                        bookName: activeBook.name,
                        chapter: activeChapter,
                        verse: v.number,
                        verseText: v.text,
                      });
                    }}
                    className={`mt-2 ml-6 p-2.5 rounded-lg border text-xs sm:text-sm font-sans-bible ${theme.cardBorder} bg-black/5 dark:bg-white/5 ${theme.textSecondary} flex items-start gap-2`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 truncate">
                      <span className="font-semibold block text-[11px] text-amber-700 dark:text-amber-400">
                        Sua Nota:
                      </span>
                      <span className="line-clamp-2">{verseNote.noteText}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Previous & Next Chapter Navigation */}
        <div className="mt-12 pt-8 border-t border-inherit border-stone-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3">
          <button
            onClick={goToPreviousChapter}
            disabled={!canGoPrevious}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
              canGoPrevious
                ? `${theme.cardBorder} ${theme.cardBg} ${theme.textPrimary} hover:border-amber-500`
                : 'opacity-40 cursor-not-allowed border-transparent'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Capítulo Anterior</span>
          </button>

          <button
            onClick={() => setIsPickerOpen(true)}
            className={`hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium ${theme.textSecondary} hover:${theme.textPrimary}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Trocar Capítulo</span>
          </button>

          <button
            onClick={goToNextChapter}
            disabled={!canGoNext}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
              canGoNext
                ? `${theme.cardBorder} ${theme.cardBg} ${theme.textPrimary} hover:border-amber-500`
                : 'opacity-40 cursor-not-allowed border-transparent'
            }`}
          >
            <span>Próximo Capítulo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Floating Verse Action Bar (when verse selected) */}
      <VerseActionsBar
        selectedVerse={selectedVerse}
        onClose={() => setSelectedVerse(null)}
        onOpenNote={() => {
          if (selectedVerse) {
            setNoteModalVerse({
              bookId: selectedVerse.bookId,
              bookName: selectedVerse.bookName,
              chapter: selectedVerse.chapter,
              verse: selectedVerse.verse,
              verseText: selectedVerse.text,
            });
          }
        }}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={!!noteModalVerse}
        onClose={() => setNoteModalVerse(null)}
        verseData={noteModalVerse}
      />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Chapter Picker Modal */}
      <ChapterPickerModal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} />
    </div>
  );
};
