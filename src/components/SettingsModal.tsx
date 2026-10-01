import React from 'react';
import { useBible } from '../context/BibleContext';
import { getThemeStyles } from '../utils/theme';
import { X, Check, Sun, Moon, Coffee, Type, BookOpen } from 'lucide-react';
import { FontSize, FontFamily, LineHeight, ThemeMode, BibleTranslation } from '../types/bible';
import { BIBLE_TRANSLATIONS } from '../data/bibleVerses';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useBible();
  const theme = getThemeStyles(settings.theme);

  if (!isOpen) return null;

  const themes: { id: ThemeMode; label: string; icon: typeof Sun; desc: string }[] = [
    { id: 'light', label: 'Papiro Claro', icon: Sun, desc: 'Fundo suave alabastro' },
    { id: 'dark', label: 'Noturno Escuro', icon: Moon, desc: 'Confortável para a noite' },
    { id: 'sepia', label: 'Sépia Clássico', icon: Coffee, desc: 'Tom pergaminho acolhedor' },
  ];

  const fontSizes: { id: FontSize; label: string; px: string }[] = [
    { id: 'sm', label: 'Pequena', px: '16px' },
    { id: 'base', label: 'Média', px: '18px' },
    { id: 'lg', label: 'Grande', px: '21px' },
    { id: 'xl', label: 'Muito Grande', px: '24px' },
  ];

  const fontFamilies: { id: FontFamily; label: string; preview: string }[] = [
    { id: 'serif', label: 'Serifada Clássica', preview: 'Merriweather Sagrada' },
    { id: 'sans', label: 'Sem Serifa', preview: 'Moderna e Nítida' },
  ];

  const lineHeights: { id: LineHeight; label: string }[] = [
    { id: 'normal', label: 'Padrão' },
    { id: 'relaxed', label: 'Confortável' },
    { id: 'loose', label: 'Espaçada' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${theme.cardBg} ${theme.cardBorder} transition-colors duration-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Type className={`w-5 h-5 ${theme.accent}`} />
            <h2 className={`font-display-bible text-lg font-bold ${theme.textPrimary}`}>
              Ajustes & Tradução
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg text-stone-400 hover:${theme.textPrimary} transition-colors`}
            aria-label="Fechar configurações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Translation Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${theme.textMuted}`}>
                <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Versão Bíblica</span>
              </label>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {settings.translation || 'BKJ'}
              </span>
            </div>
            <div className="space-y-2">
              {BIBLE_TRANSLATIONS.map((tr) => {
                const isSelected = (settings.translation || 'BKJ') === tr.id;
                return (
                  <button
                    key={tr.id}
                    onClick={() => updateSettings({ translation: tr.id })}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `border-amber-600 bg-amber-500/10 font-medium ${theme.textPrimary} ring-1 ring-amber-600/30`
                        : `${theme.cardBorder} ${theme.textSecondary} hover:bg-stone-500/5`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-amber-700 dark:text-amber-400">
                          {tr.shortName}
                        </span>
                        <span className="text-xs font-semibold">{tr.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className={`text-[11px] ${theme.textMuted} mt-1.5 leading-relaxed`}>
                      {tr.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${theme.textMuted}`}>
              Tema de Fundo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => {
                const Icon = t.icon;
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ theme: t.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? `border-amber-600 bg-amber-500/10 font-medium ${theme.textPrimary} ring-1 ring-amber-600/30`
                        : `${theme.cardBorder} ${theme.textSecondary} hover:bg-stone-500/5`
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                Tamanho da Fonte
              </label>
              <span className={`text-xs font-mono ${theme.textSecondary}`}>
                {fontSizes.find((f) => f.id === settings.fontSize)?.px}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {fontSizes.map((fs) => {
                const isSelected = settings.fontSize === fs.id;
                return (
                  <button
                    key={fs.id}
                    onClick={() => updateSettings({ fontSize: fs.id })}
                    className={`py-2 px-2 text-xs rounded-xl border font-medium text-center transition-all ${
                      isSelected
                        ? `border-amber-600 bg-amber-500/10 font-bold ${theme.textPrimary} ring-1 ring-amber-600/30`
                        : `${theme.cardBorder} ${theme.textSecondary} hover:bg-stone-500/5`
                    }`}
                  >
                    <span className="text-sm block mb-0.5">{fs.id.toUpperCase()}</span>
                    <span className="text-[10px] opacity-75">{fs.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Family Selector */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${theme.textMuted}`}>
              Família Tipográfica
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fontFamilies.map((ff) => {
                const isSelected = settings.fontFamily === ff.id;
                return (
                  <button
                    key={ff.id}
                    onClick={() => updateSettings({ fontFamily: ff.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `border-amber-600 bg-amber-500/10 font-medium ${theme.textPrimary} ring-1 ring-amber-600/30`
                        : `${theme.cardBorder} ${theme.textSecondary} hover:bg-stone-500/5`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{ff.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <span
                      className={`text-xs mt-1 block opacity-80 ${
                        ff.id === 'serif' ? 'font-serif-bible italic' : 'font-sans-bible'
                      }`}
                    >
                      {ff.preview}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line Spacing */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${theme.textMuted}`}>
              Espaçamento entre Linhas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {lineHeights.map((lh) => {
                const isSelected = settings.lineHeight === lh.id;
                return (
                  <button
                    key={lh.id}
                    onClick={() => updateSettings({ lineHeight: lh.id })}
                    className={`py-2 px-3 text-xs rounded-xl border font-medium text-center transition-all ${
                      isSelected
                        ? `border-amber-600 bg-amber-500/10 font-bold ${theme.textPrimary} ring-1 ring-amber-600/30`
                        : `${theme.cardBorder} ${theme.textSecondary} hover:bg-stone-500/5`
                    }`}
                  >
                    {lh.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Box with BKJ 1611 text */}
          <div
            className={`p-3.5 rounded-xl border text-sm ${
              settings.fontFamily === 'serif' ? 'font-serif-bible' : 'font-sans-bible'
            } ${
              settings.fontSize === 'sm'
                ? 'text-sm'
                : settings.fontSize === 'base'
                ? 'text-base'
                : settings.fontSize === 'lg'
                ? 'text-lg'
                : 'text-xl'
            } ${
              settings.lineHeight === 'normal'
                ? 'leading-normal'
                : settings.lineHeight === 'relaxed'
                ? 'leading-relaxed'
                : 'leading-loose'
            } ${theme.cardBorder} bg-black/5 dark:bg-white/5 ${theme.textPrimary}`}
          >
            <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">
              Salmos 23:1 ({settings.translation || 'BKJ 1611'})
            </div>
            <span className="font-semibold text-amber-600 dark:text-amber-400 mr-2">1</span>
            O SENHOR é meu pastor, nada me faltará.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl text-sm transition-colors shadow-xs"
          >
            Concluir Ajustes
          </button>
        </div>
      </div>
    </div>
  );
};

