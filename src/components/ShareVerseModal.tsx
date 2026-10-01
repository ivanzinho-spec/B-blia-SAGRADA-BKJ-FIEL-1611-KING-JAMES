import React, { useState, useRef } from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { X, Copy, Check, Share2, Download, Image as ImageIcon, Sparkles } from 'lucide-react';

interface CardThemeOption {
  id: string;
  name: string;
  bgGradient: string;
  textColor: string;
  refColor: string;
  borderColor: string;
  canvasBg: string[];
}

const CARD_THEMES: CardThemeOption[] = [
  {
    id: 'gold',
    name: 'Amanhecer Dourado',
    bgGradient: 'from-amber-900 via-stone-900 to-amber-950',
    textColor: 'text-amber-100',
    refColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    canvasBg: ['#451a03', '#1c1917', '#292524'],
  },
  {
    id: 'night',
    name: 'Noite Celestial',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    textColor: 'text-slate-100',
    refColor: 'text-sky-300',
    borderColor: 'border-indigo-500/30',
    canvasBg: ['#020617', '#0f172a', '#1e1b4b'],
  },
  {
    id: 'parchment',
    name: 'Pergaminho Nobre',
    bgGradient: 'from-[#F5EFE6] via-[#E8DFD1] to-[#D6C4AD]',
    textColor: 'text-stone-900',
    refColor: 'text-amber-800',
    borderColor: 'border-stone-400/40',
    canvasBg: ['#F5EFE6', '#E8DFD1', '#D6C4AD'],
  },
  {
    id: 'emerald',
    name: 'Pastos Verdejantes',
    bgGradient: 'from-emerald-950 via-teal-950 to-stone-900',
    textColor: 'text-emerald-100',
    refColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/30',
    canvasBg: ['#022c22', '#042f2e', '#134e4a'],
  },
];

export const ShareVerseModal: React.FC = () => {
  const { verseToShare, setVerseToShare, settings } = useBible();
  const theme = getThemeStyles(settings.theme);

  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardThemeOption>(CARD_THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  if (!verseToShare) return null;

  const translationName = settings.translation || 'BKJ 1611';
  const fullQuoteText = `"${verseToShare.text}"\n— ${verseToShare.bookName} ${verseToShare.chapter}:${verseToShare.verse} (${translationName})`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullQuoteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${verseToShare.bookName} ${verseToShare.chapter}:${verseToShare.verse}`,
          text: fullQuoteText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyText();
        }
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      // Draw canvas in high-definition
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, selectedTheme.canvasBg[0]);
      gradient.addColorStop(0.5, selectedTheme.canvasBg[1]);
      gradient.addColorStop(1, selectedTheme.canvasBg[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle ornamental border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(76, 76, width - 152, height - 152);

      // Title header
      ctx.textAlign = 'center';
      ctx.fillStyle = selectedTheme.id === 'parchment' ? '#78350f' : '#fbbf24';
      ctx.font = '600 28px serif';
      ctx.fillText('B Í B L I A   K I N G   J A M E S   1 6 1 1', width / 2, 160);

      // Divider line
      ctx.beginPath();
      ctx.moveTo(width / 2 - 100, 195);
      ctx.lineTo(width / 2 + 100, 195);
      ctx.strokeStyle = selectedTheme.id === 'parchment' ? '#b45309' : '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Word wrapping for verse text
      const maxTextWidth = 840;
      ctx.fillStyle = selectedTheme.id === 'parchment' ? '#1c1917' : '#f8fafc';
      ctx.font = 'italic 42px serif';
      const words = `"${verseToShare.text}"`.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      // Calculate vertical centering
      const lineHeight = 64;
      const totalTextHeight = lines.length * lineHeight;
      let startY = height / 2 - totalTextHeight / 2 - 20;

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], width / 2, startY + i * lineHeight);
      }

      // Reference footer
      ctx.font = '600 32px sans-serif';
      ctx.fillStyle = selectedTheme.id === 'parchment' ? '#92400e' : '#f59e0b';
      ctx.fillText(
        `— ${verseToShare.bookName} ${verseToShare.chapter}:${verseToShare.verse} (${translationName}) —`,
        width / 2,
        startY + totalTextHeight + 80
      );

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `versiculo_${verseToShare.bookName.toLowerCase()}_${verseToShare.chapter}_${verseToShare.verse}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsGenerating(false);
      }, 'image/png');
    } catch (e) {
      console.error('Image creation failed', e);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${theme.cardBg} ${theme.cardBorder} transition-colors duration-200 animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme.cardBorder} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Share2 className={`w-5 h-5 ${theme.accent}`} />
            <h2 className={`font-display-bible text-lg font-bold ${theme.textPrimary}`}>
              Compartilhar Palavra
            </h2>
          </div>
          <button
            onClick={() => setVerseToShare(null)}
            className={`p-1.5 rounded-lg text-stone-400 hover:${theme.textPrimary} transition-colors`}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          {/* Card Preview */}
          <div
            ref={cardPreviewRef}
            className={`relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${selectedTheme.bgGradient} border ${selectedTheme.borderColor} shadow-lg text-center transition-all duration-300 min-h-[190px] flex flex-col items-center justify-center`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-400/80 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bíblia King James 1611 · BKJ</span>
            </div>

            <p
              className={`font-serif-bible italic text-base sm:text-lg leading-relaxed ${selectedTheme.textColor} mb-4`}
            >
              "{verseToShare.text}"
            </p>

            <span
              className={`text-xs sm:text-sm font-semibold tracking-wide ${selectedTheme.refColor}`}
            >
              — {verseToShare.bookName} {verseToShare.chapter}:{verseToShare.verse} ({translationName})
            </span>
          </div>

          {/* Theme Selector for Image Card */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
              Estilo Visual do Card
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CARD_THEMES.map((ct) => {
                const isSelected = selectedTheme.id === ct.id;
                return (
                  <button
                    key={ct.id}
                    onClick={() => setSelectedTheme(ct)}
                    className={`p-2 rounded-xl border text-center transition-all text-xs font-medium ${
                      isSelected
                        ? `border-amber-600 bg-amber-500/10 font-bold ${theme.textPrimary} ring-1 ring-amber-600/30`
                        : `${theme.cardBorder} ${theme.textSecondary} hover:bg-stone-500/5`
                    }`}
                  >
                    <span className="block truncate">{ct.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={handleCopyText}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border ${theme.cardBorder} ${theme.cardBg} ${theme.textPrimary} hover:bg-stone-500/10 text-xs sm:text-sm font-medium transition-colors`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-400" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border ${theme.cardBorder} ${theme.cardBg} ${theme.textPrimary} hover:bg-stone-500/10 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50`}
            >
              <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{isGenerating ? 'Criando...' : 'Baixar Imagem'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
