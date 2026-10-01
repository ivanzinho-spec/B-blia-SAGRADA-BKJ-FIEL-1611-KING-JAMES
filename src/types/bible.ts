export type Testament = 'AT' | 'NT';

export type BookCategory =
  | 'Pentateuco'
  | 'Históricos'
  | 'Poéticos'
  | 'Profetas Maiores'
  | 'Profetas Menores'
  | 'Evangelhos'
  | 'Histórico'
  | 'Epístolas Paulinas'
  | 'Epístolas Gerais'
  | 'Revelação';

export interface Book {
  id: string;
  name: string;
  abbrev: string;
  testament: Testament;
  category: BookCategory;
  chaptersCount: number;
  description: string;
}

export interface Verse {
  number: number;
  text: string;
}

export interface ChapterData {
  bookId: string;
  bookName: string;
  chapter: number;
  verses: Verse[];
}

export interface Bookmark {
  id: string; // e.g., 'jo-3-16'
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: number;
}

export type HighlightColor = 'gold' | 'green' | 'blue' | 'rose' | 'purple';

export interface Highlight {
  id: string; // verse id 'jo-3-16'
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  createdAt: number;
}

export interface Note {
  id: string; // verse id 'jo-3-16'
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  noteText: string;
  createdAt: number;
  updatedAt: number;
}

export interface HistoryItem {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  timestamp: number;
}

export interface DailyVerse {
  id: string;
  reference: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  theme: string;
  devotional: string;
}

export type ThemeMode = 'light' | 'dark' | 'sepia';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type FontFamily = 'serif' | 'sans';
export type LineHeight = 'normal' | 'relaxed' | 'loose';

export type BibleTranslation = 'BKJ' | 'ARA' | 'NVI';

export interface TranslationInfo {
  id: BibleTranslation;
  name: string;
  shortName: string;
  description: string;
  tag: string;
}

export interface ReaderSettings {
  theme: ThemeMode;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  verseNumbersVisible: boolean;
  translation: BibleTranslation;
}
