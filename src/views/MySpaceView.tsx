import React, { useState } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import {
  Star,
  Highlighter,
  FileText,
  History,
  Trash2,
  BookOpen,
  ArrowRight,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { NoteModal } from '../components/NoteModal';

export const MySpaceView: React.FC = () => {
  const {
    bookmarks,
    toggleBookmark,
    highlights,
    setHighlightColor,
    notes,
    deleteNote,
    history,
    clearHistory,
    openChapter,
    setVerseToShare,
    settings,
  } = useBible();

  const theme = getThemeStyles(settings.theme);

  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'highlights' | 'notes' | 'history'>('bookmarks');
  const [editingNoteVerse, setEditingNoteVerse] = useState<{
    bookId: string;
    bookName: string;
    chapter: number;
    verse: number;
    verseText: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string, ref: string) => {
    try {
      await navigator.clipboard.writeText(`"${text}" — ${ref}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const highlightList = Object.values(highlights);
  const notesList = Object.values(notes);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className={`font-display-bible text-2xl sm:text-3xl font-bold tracking-tight ${theme.textPrimary}`}>
          Meu Espaço Espiritual
        </h1>
        <p className={`text-xs sm:text-sm ${theme.textSecondary} mt-1`}>
          Seus versículos favoritos, marcações coloridas, anotações e histórico de leitura.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'bookmarks'
              ? 'bg-amber-600 text-white shadow-xs'
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          }`}
        >
          <Star className={`w-4 h-4 ${activeSubTab === 'bookmarks' ? 'fill-white' : ''}`} />
          <span>Favoritos ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('highlights')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'highlights'
              ? 'bg-amber-600 text-white shadow-xs'
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          }`}
        >
          <Highlighter className="w-4 h-4" />
          <span>Marcações ({highlightList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'notes'
              ? 'bg-amber-600 text-white shadow-xs'
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Anotações ({notesList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'history'
              ? 'bg-amber-600 text-white shadow-xs'
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          }`}
        >
          <History className="w-4 h-4" />
          <span>Histórico ({history.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookmarks */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${theme.cardBorder} ${theme.cardBg}`}>
              <Star className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
              <p className={`font-semibold ${theme.textPrimary}`}>Nenhum versículo favoritado ainda</p>
              <p className={`text-xs ${theme.textMuted} mt-1`}>
                No Leitor, toque em qualquer versículo e selecione a estrela para favoritá-lo.
              </p>
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className={`p-4 sm:p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display-bible font-bold text-base text-amber-600 dark:text-amber-400">
                    {b.bookName} {b.chapter}:{b.verse}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(b.id, b.text, `${b.bookName} ${b.chapter}:${b.verse}`)}
                      className={`p-1.5 rounded-lg border ${theme.cardBorder} text-stone-400 hover:${theme.textPrimary}`}
                      title="Copiar versículo"
                    >
                      {copiedId === b.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setVerseToShare({
                          bookName: b.bookName,
                          chapter: b.chapter,
                          verse: b.verse,
                          text: b.text,
                        })
                      }
                      className={`p-1.5 rounded-lg border ${theme.cardBorder} text-stone-400 hover:${theme.textPrimary}`}
                      title="Gerar card / Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleBookmark(b.bookId, b.chapter, b.verse, b.text)}
                      className="p-1.5 rounded-lg text-amber-500 hover:text-rose-500 transition-colors"
                      title="Remover dos favoritos"
                    >
                      <Star className="w-4 h-4 fill-amber-500" />
                    </button>
                  </div>
                </div>

                <p className={`font-serif-bible text-base leading-relaxed ${theme.textPrimary}`}>
                  "{b.text}"
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => openChapter(b.bookId, b.chapter)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <span>Abrir Capítulo {b.chapter}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Highlights */}
      {activeSubTab === 'highlights' && (
        <div className="space-y-3">
          {highlightList.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${theme.cardBorder} ${theme.cardBg}`}>
              <Highlighter className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
              <p className={`font-semibold ${theme.textPrimary}`}>Nenhuma marcação colorida</p>
              <p className={`text-xs ${theme.textMuted} mt-1`}>
                No leitor, toque em qualquer versículo para marcá-lo com cores (Dourado, Esmeralda, Céu, Rosa ou Púrpura).
              </p>
            </div>
          ) : (
            highlightList.map((hl) => {
              const colorDot =
                hl.color === 'gold'
                  ? 'bg-amber-400'
                  : hl.color === 'green'
                  ? 'bg-emerald-400'
                  : hl.color === 'blue'
                  ? 'bg-sky-400'
                  : hl.color === 'rose'
                  ? 'bg-rose-400'
                  : 'bg-purple-400';

              return (
                <div
                  key={hl.id}
                  className={`p-4 sm:p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 rounded-full ${colorDot} shrink-0 ring-2 ring-stone-300 dark:ring-stone-700`} />
                    <div>
                      <span className={`font-display-bible font-bold text-base ${theme.textPrimary}`}>
                        {hl.bookName} {hl.chapter}:{hl.verse}
                      </span>
                      <span className={`block text-xs ${theme.textMuted}`}>
                        Marcado com destaque {hl.color}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHighlightColor(hl.bookId, hl.chapter, hl.verse, null)}
                      className={`p-2 rounded-xl text-stone-400 hover:text-rose-500 transition-colors`}
                      title="Remover marcação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openChapter(hl.bookId, hl.chapter)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      <span>Ler</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Notes */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          {notesList.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${theme.cardBorder} ${theme.cardBg}`}>
              <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
              <p className={`font-semibold ${theme.textPrimary}`}>Nenhuma anotação registrada</p>
              <p className={`text-xs ${theme.textMuted} mt-1`}>
                Ao ler os versículos, toque em qualquer versículo e escolha "Anotação" para salvar suas reflexões e orações.
              </p>
            </div>
          ) : (
            notesList.map((nt) => (
              <div
                key={nt.id}
                className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs space-y-3`}
              >
                <div className="flex items-center justify-between border-b border-inherit pb-2.5">
                  <span className="font-display-bible font-bold text-base text-amber-600 dark:text-amber-400">
                    {nt.bookName} {nt.chapter}:{nt.verse}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setEditingNoteVerse({
                          bookId: nt.bookId,
                          bookName: nt.bookName,
                          chapter: nt.chapter,
                          verse: nt.verse,
                          verseText: nt.verseText,
                        })
                      }
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${theme.cardBorder} ${theme.textSecondary} hover:${theme.textPrimary}`}
                    >
                      Editar Nota
                    </button>

                    <button
                      onClick={() => deleteNote(nt.bookId, nt.chapter, nt.verse)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500"
                      title="Excluir anotação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5`}>
                  <p className={`font-serif-bible italic text-xs sm:text-sm ${theme.textSecondary}`}>
                    "{nt.verseText}"
                  </p>
                </div>

                <div className="pt-1">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 text-amber-700 dark:text-amber-400`}>
                    Reflexão Salva:
                  </span>
                  <p className={`text-sm leading-relaxed ${theme.textPrimary} whitespace-pre-wrap`}>
                    {nt.noteText}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => openChapter(nt.bookId, nt.chapter)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <span>Ir para o Capítulo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: History */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${theme.textMuted}`}>
              Capítulos que você abriu recentemente
            </span>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${theme.cardBorder} ${theme.cardBg}`}>
              <History className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
              <p className={`font-semibold ${theme.textPrimary}`}>Nenhum histórico registrado</p>
              <p className={`text-xs ${theme.textMuted} mt-1`}>
                Ao navegar pelos livros e capítulos, seu progresso ficará guardado aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openChapter(item.bookId, item.chapter)}
                  className={`p-4 rounded-xl border ${theme.cardBg} ${theme.cardBorder} hover:border-amber-500 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`font-display-bible font-bold text-sm sm:text-base ${theme.textPrimary} group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors`}>
                        {item.bookName} {item.chapter}
                      </span>
                      <span className={`block text-[11px] ${theme.textMuted}`}>
                        {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Note Modal */}
      <NoteModal
        isOpen={!!editingNoteVerse}
        onClose={() => setEditingNoteVerse(null)}
        verseData={editingNoteVerse}
      />
    </div>
  );
};
