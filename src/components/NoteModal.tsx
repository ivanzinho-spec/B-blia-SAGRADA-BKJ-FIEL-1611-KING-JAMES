import React, { useState, useEffect } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { X, FileText, Trash2, Save } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseData: {
    bookId: string;
    bookName: string;
    chapter: number;
    verse: number;
    verseText: string;
  } | null;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, verseData }) => {
  const { notes, saveNote, deleteNote, settings } = useBible();
  const theme = getThemeStyles(settings.theme);

  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (verseData) {
      const id = `${verseData.bookId}-${verseData.chapter}-${verseData.verse}`;
      const existing = notes[id];
      setNoteContent(existing ? existing.noteText : '');
    }
  }, [verseData, notes]);

  if (!isOpen || !verseData) return null;

  const handleSave = () => {
    if (!noteContent.trim()) {
      deleteNote(verseData.bookId, verseData.chapter, verseData.verse);
    } else {
      saveNote(
        verseData.bookId,
        verseData.chapter,
        verseData.verse,
        verseData.verseText,
        noteContent.trim()
      );
    }
    onClose();
  };

  const handleDelete = () => {
    deleteNote(verseData.bookId, verseData.chapter, verseData.verse);
    onClose();
  };

  const noteId = `${verseData.bookId}-${verseData.chapter}-${verseData.verse}`;
  const hasExistingNote = !!notes[noteId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${theme.cardBg} ${theme.cardBorder} transition-colors duration-200 animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme.cardBorder} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <FileText className={`w-5 h-5 ${theme.accent}`} />
            <h2 className={`font-display-bible text-lg font-bold ${theme.textPrimary}`}>
              Anotação Devocional
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg text-stone-400 hover:${theme.textPrimary} transition-colors`}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Verse context */}
          <div className={`p-3.5 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5`}>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">
              {verseData.bookName} {verseData.chapter}:{verseData.verse}
            </span>
            <p className={`font-serif-bible italic text-xs sm:text-sm ${theme.textSecondary}`}>
              "{verseData.verseText}"
            </p>
          </div>

          {/* Textarea */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
              Sua Reflexão ou Oração
            </label>
            <textarea
              rows={5}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Escreva seus pensamentos, orações, ou aprendizado sobre este versículo..."
              className={`w-full p-3.5 text-sm rounded-xl border ${theme.cardBorder} bg-transparent ${theme.textPrimary} placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500`}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            {hasExistingNote ? (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:opacity-80 py-2 px-3 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className={`py-2 px-4 rounded-xl border ${theme.cardBorder} ${theme.textSecondary} text-xs sm:text-sm font-medium hover:${theme.textPrimary}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Anotação</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
