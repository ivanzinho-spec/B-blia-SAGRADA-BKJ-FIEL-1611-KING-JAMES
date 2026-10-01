import React, { useState } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { DAILY_VERSES_BKJ } from '../data/bibleVerses';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Star,
  Bookmark,
  Calendar,
  Layers,
  Heart,
  Flame,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    openChapter,
    setActiveTab,
    setVerseToShare,
    history,
    bookmarks,
    notes,
    settings,
  } = useBible();
  const theme = getThemeStyles(settings.theme);

  const [copied, setCopied] = useState(false);

  // Daily verse calculation based on day of month in BKJ translation
  const today = new Date();
  const dayIndex = (today.getDate() - 1) % DAILY_VERSES_BKJ.length;
  const dailyVerse = DAILY_VERSES_BKJ[dayIndex] || DAILY_VERSES_BKJ[0];

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today);

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Last read from history
  const lastRead = history.length > 0 ? history[0] : null;

  const handleCopyDailyVerse = async () => {
    try {
      const text = `"${dailyVerse.text}" — ${dailyVerse.reference} (Versículo do Dia · Bíblia King James 1611)`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareDailyVerse = () => {
    const book = BIBLE_BOOKS.find((b) => b.id === dailyVerse.bookId);
    setVerseToShare({
      bookName: book ? book.name : dailyVerse.reference,
      chapter: dailyVerse.chapter,
      verse: dailyVerse.verse,
      text: dailyVerse.text,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Marquee Section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl bg-stone-900 text-white min-h-[300px] sm:min-h-[340px] flex flex-col justify-end p-6 sm:p-10">
        {/* Background Image with Scrim */}
        <img
          src="/src/assets/images/bible_hero_parchment_1790876621384.jpg"
          alt="Bíblia Sagrada aberta sob iluminação acolhedora"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Versículo do Dia · {capitalizedDate}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono bg-amber-400/20 px-1.5 py-0.5 rounded text-[11px] text-amber-200">
              BKJ 1611
            </span>
          </div>

          <h1 className="font-display-bible text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 text-balance">
            "{dailyVerse.text}"
          </h1>

          <div className="flex items-center gap-3 text-sm text-amber-200/90 font-medium mb-4">
            <span className="font-semibold text-amber-300 text-base">{dailyVerse.reference}</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span>{dailyVerse.theme}</span>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 mb-6 leading-relaxed max-w-xl">
            {dailyVerse.devotional}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openChapter(dailyVerse.bookId, dailyVerse.chapter)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ler Capítulo Inteiro</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleShareDailyVerse}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-xs sm:text-sm font-medium transition-colors border border-white/20"
            >
              <Share2 className="w-4 h-4" />
              <span>Criar Card</span>
            </button>

            <button
              onClick={handleCopyDailyVerse}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-xs sm:text-sm font-medium transition-colors border border-white/20"
              title="Copiar texto"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Continue Reading Card (if history exists) */}
      {lastRead && (
        <section
          className={`p-5 sm:p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xs font-semibold uppercase tracking-wider block ${theme.textMuted}`}>
                Continuar Leitura
              </span>
              <h3 className={`font-display-bible text-lg sm:text-xl font-bold ${theme.textPrimary}`}>
                {lastRead.bookName} · Capítulo {lastRead.chapter}
              </h3>
              <p className={`text-xs ${theme.textSecondary}`}>
                Último acesso registrado na sua jornada bíblica
              </p>
            </div>
          </div>

          <button
            onClick={() => openChapter(lastRead.bookId, lastRead.chapter)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs shrink-0"
          >
            <span>Retomar Leitura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* Quick Navigation Cards: Antigo & Novo Testamento */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display-bible text-xl font-bold ${theme.textPrimary}`}>
            Explorar as Escrituras
          </h2>
          <button
            onClick={() => setActiveTab('books')}
            className={`text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1`}
          >
            <span>Ver todos os 66 livros</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Antigo Testamento */}
          <div
            onClick={() => setActiveTab('books')}
            className={`cursor-pointer p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} hover:border-amber-500/50 hover:shadow-md transition-all group relative overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                  39 Livros Sagrados
                </span>
                <h3 className={`font-display-bible text-xl font-bold ${theme.textPrimary} group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors`}>
                  Antigo Testamento
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <p className={`text-xs sm:text-sm ${theme.textSecondary} mb-4 leading-relaxed`}>
              Da criação em Gênesis aos profetas, a história da aliança, as leis sagradas, os salmos de adoração e a sabedoria eterna.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <span>Gênesis a Malaquias</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Novo Testamento */}
          <div
            onClick={() => setActiveTab('books')}
            className={`cursor-pointer p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} hover:border-amber-500/50 hover:shadow-md transition-all group relative overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                  27 Livros Sagrados
                </span>
                <h3 className={`font-display-bible text-xl font-bold ${theme.textPrimary} group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors`}>
                  Novo Testamento
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <p className={`text-xs sm:text-sm ${theme.textSecondary} mb-4 leading-relaxed`}>
              A vida, morte e ressurreição de Jesus Cristo nos Evangelhos, a expansão da fé cristã em Atos, as cartas apostólicas e a Revelação.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <span>Mateus a Apocalipse</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Chapters Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display-bible text-xl font-bold ${theme.textPrimary}`}>
            Passagens Mais Amadas
          </h2>
          <span className={`text-xs ${theme.textMuted}`}>Acesso rápido aos capítulos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Salmos 23', bookId: 'sl', ch: 23, subtitle: 'O Bom Pastor' },
            { name: 'Salmos 91', bookId: 'sl', ch: 91, subtitle: 'Refúgio e Proteção' },
            { name: 'João 3', bookId: 'jo', ch: 3, subtitle: 'O Amor de Deus' },
            { name: 'Mateus 5', bookId: 'mt', ch: 5, subtitle: 'Sermão da Montanha' },
            { name: '1 Coríntios 13', bookId: '1co', ch: 13, subtitle: 'Hino ao Amor' },
            { name: 'Filipenses 4', bookId: 'fp', ch: 4, subtitle: 'Paz e Alegria' },
          ].map((item) => (
            <button
              key={`${item.bookId}-${item.ch}`}
              onClick={() => openChapter(item.bookId, item.ch)}
              className={`p-3.5 rounded-xl border text-left transition-all ${theme.cardBg} ${theme.cardBorder} hover:border-amber-500 hover:shadow-xs group`}
            >
              <span className={`block font-display-bible font-bold text-sm ${theme.textPrimary} group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors`}>
                {item.name}
              </span>
              <span className={`block text-[11px] ${theme.textMuted} mt-0.5 truncate`}>
                {item.subtitle}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Authentic BKJ Fiel 1611 Heritage Banner */}
      <section className={`p-6 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                BKJ FIEL 1611
              </span>
              <h3 className={`font-display-bible text-base font-bold ${theme.textPrimary}`}>
                A Herança da Bíblia King James 1611
              </h3>
            </div>
            <p className={`text-xs sm:text-sm ${theme.textSecondary} leading-relaxed`}>
              Traduzida com rigorosa fidelidade a partir dos textos originais (Texto Massorético Hebraico e Textus Receptus Grego), a Bíblia King James Fiel 1611 preserva a reverência histórica, a nobreza poética dos Salmos e a exatidão teológica consagrada mundialmente há mais de quatro séculos.
            </p>
          </div>
        </div>
      </section>

      {/* User Stats & Highlights Summary */}
      <section className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder}`}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
          <h2 className={`font-display-bible text-base font-bold ${theme.textPrimary}`}>
            Sua Jornada com a Palavra
          </h2>
          <button
            onClick={() => setActiveTab('space')}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Abrir Meu Espaço
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div
            onClick={() => setActiveTab('space')}
            className="cursor-pointer p-3 rounded-xl hover:bg-stone-500/5 transition-colors"
          >
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <span className={`font-display-bible text-2xl font-bold tabular-nums ${theme.textPrimary}`}>
              {bookmarks.length}
            </span>
            <span className={`block text-xs ${theme.textMuted}`}>Favoritos</span>
          </div>

          <div
            onClick={() => setActiveTab('space')}
            className="cursor-pointer p-3 rounded-xl hover:bg-stone-500/5 transition-colors"
          >
            <div className="flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className={`font-display-bible text-2xl font-bold tabular-nums ${theme.textPrimary}`}>
              {Object.keys(notes).length}
            </span>
            <span className={`block text-xs ${theme.textMuted}`}>Anotações</span>
          </div>

          <div
            onClick={() => setActiveTab('space')}
            className="cursor-pointer p-3 rounded-xl hover:bg-stone-500/5 transition-colors"
          >
            <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className={`font-display-bible text-2xl font-bold tabular-nums ${theme.textPrimary}`}>
              {history.length}
            </span>
            <span className={`block text-xs ${theme.textMuted}`}>Capítulos Lidos</span>
          </div>
        </div>
      </section>
    </div>
  );
};
