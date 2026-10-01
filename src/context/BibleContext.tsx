import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  Bookmark,
  Highlight,
  HighlightColor,
  HistoryItem,
  Note,
  ReaderSettings,
  Verse,
} from '../types/bible';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { getChapterVerses } from '../data/bibleVerses';

interface BibleContextType {
  activeTab: 'home' | 'books' | 'reader' | 'search' | 'space';
  setActiveTab: (tab: 'home' | 'books' | 'reader' | 'search' | 'space') => void;
  activeBook: Book;
  activeChapter: number;
  openChapter: (bookId: string, chapter: number) => void;
  currentVerses: Verse[];
  goToPreviousChapter: () => void;
  goToNextChapter: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;

  // Bookmarks
  bookmarks: Bookmark[];
  toggleBookmark: (bookId: string, chapter: number, verse: number, text: string) => void;
  isBookmarked: (bookId: string, chapter: number, verse: number) => boolean;

  // Highlights
  highlights: Record<string, Highlight>; // key is `${bookId}-${chapter}-${verse}`
  setHighlightColor: (bookId: string, chapter: number, verse: number, color: HighlightColor | null) => void;
  getHighlight: (bookId: string, chapter: number, verse: number) => Highlight | undefined;

  // Notes
  notes: Record<string, Note>; // key is `${bookId}-${chapter}-${verse}`
  saveNote: (bookId: string, chapter: number, verse: number, verseText: string, noteText: string) => void;
  deleteNote: (bookId: string, chapter: number, verse: number) => void;
  getNote: (bookId: string, chapter: number, verse: number) => Note | undefined;

  // History
  history: HistoryItem[];
  clearHistory: () => void;

  // Reader Settings
  settings: ReaderSettings;
  updateSettings: (newSettings: Partial<ReaderSettings>) => void;

  // Share / Image Modal State
  verseToShare: { bookName: string; chapter: number; verse: number; text: string } | null;
  setVerseToShare: (v: { bookName: string; chapter: number; verse: number; text: string } | null) => void;
}

const defaultSettings: ReaderSettings = {
  theme: 'light',
  fontSize: 'lg',
  fontFamily: 'serif',
  lineHeight: 'relaxed',
  verseNumbersVisible: true,
  translation: 'BKJ',
};

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'books' | 'reader' | 'search' | 'space'>('home');
  const [activeBookId, setActiveBookId] = useState<string>('sl'); // Default to Salmos
  const [activeChapter, setActiveChapter] = useState<number>(23); // Default to Salmo 23
  const [verseToShare, setVerseToShare] = useState<{ bookName: string; chapter: number; verse: number; text: string } | null>(null);

  // Settings
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const saved = localStorage.getItem('biblia_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('biblia_bookmarks');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sl-23-1',
          bookId: 'sl',
          bookName: 'Salmos',
          chapter: 23,
          verse: 1,
          text: 'O SENHOR é o meu pastor; nada me faltará.',
          createdAt: Date.now(),
        },
      ];
    } catch {
      return [];
    }
  });

  // Highlights
  const [highlights, setHighlights] = useState<Record<string, Highlight>>(() => {
    try {
      const saved = localStorage.getItem('biblia_highlights');
      return saved ? JSON.parse(saved) : {
        'sl-23-1': {
          id: 'sl-23-1',
          bookId: 'sl',
          bookName: 'Salmos',
          chapter: 23,
          verse: 1,
          color: 'gold',
          createdAt: Date.now(),
        },
      };
    } catch {
      return {};
    }
  });

  // Notes
  const [notes, setNotes] = useState<Record<string, Note>>(() => {
    try {
      const saved = localStorage.getItem('biblia_notes');
      return saved ? JSON.parse(saved) : {
        'sl-23-1': {
          id: 'sl-23-1',
          bookId: 'sl',
          bookName: 'Salmos',
          chapter: 23,
          verse: 1,
          verseText: 'O SENHOR é o meu pastor; nada me faltará.',
          noteText: 'Lembrar de agradecer a Deus diariamente pela provisão e cuidado constante.',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };
    } catch {
      return {};
    }
  });

  // History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('biblia_history');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sl-23',
          bookId: 'sl',
          bookName: 'Salmos',
          chapter: 23,
          timestamp: Date.now(),
        },
      ];
    } catch {
      return [];
    }
  });

  // Save settings to local storage
  useEffect(() => {
    try {
      localStorage.setItem('biblia_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [settings]);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('biblia_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [bookmarks]);

  // Save highlights
  useEffect(() => {
    try {
      localStorage.setItem('biblia_highlights', JSON.stringify(highlights));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [highlights]);

  // Save notes
  useEffect(() => {
    try {
      localStorage.setItem('biblia_notes', JSON.stringify(notes));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [notes]);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem('biblia_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [history]);

  const activeBook = BIBLE_BOOKS.find((b) => b.id === activeBookId) || BIBLE_BOOKS[0];

  const currentVerses = getChapterVerses(activeBook.id, activeChapter, settings.translation || 'BKJ');

  const openChapter = (bookId: string, chapter: number) => {
    const book = BIBLE_BOOKS.find((b) => b.id === bookId);
    if (!book) return;

    const safeChapter = Math.min(Math.max(1, chapter), book.chaptersCount);
    setActiveBookId(book.id);
    setActiveChapter(safeChapter);
    setActiveTab('reader');

    // Add to history
    setHistory((prev) => {
      const filtered = prev.filter((item) => !(item.bookId === book.id && item.chapter === safeChapter));
      const newItem: HistoryItem = {
        id: `${book.id}-${safeChapter}`,
        bookId: book.id,
        bookName: book.name,
        chapter: safeChapter,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, 50);
    });

    // Scroll reader to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentBookIndex = BIBLE_BOOKS.findIndex((b) => b.id === activeBook.id);

  const canGoPrevious = activeChapter > 1 || currentBookIndex > 0;
  const canGoNext = activeChapter < activeBook.chaptersCount || currentBookIndex < BIBLE_BOOKS.length - 1;

  const goToPreviousChapter = () => {
    if (activeChapter > 1) {
      openChapter(activeBook.id, activeChapter - 1);
    } else if (currentBookIndex > 0) {
      const prevBook = BIBLE_BOOKS[currentBookIndex - 1];
      openChapter(prevBook.id, prevBook.chaptersCount);
    }
  };

  const goToNextChapter = () => {
    if (activeChapter < activeBook.chaptersCount) {
      openChapter(activeBook.id, activeChapter + 1);
    } else if (currentBookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[currentBookIndex + 1];
      openChapter(nextBook.id, 1);
    }
  };

  const toggleBookmark = (bookId: string, chapter: number, verse: number, text: string) => {
    const id = `${bookId}-${chapter}-${verse}`;
    const exists = bookmarks.some((b) => b.id === id);
    const book = BIBLE_BOOKS.find((b) => b.id === bookId);

    if (exists) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } else {
      const newBookmark: Bookmark = {
        id,
        bookId,
        bookName: book ? book.name : 'Livro',
        chapter,
        verse,
        text,
        createdAt: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    }
  };

  const isBookmarked = (bookId: string, chapter: number, verse: number) => {
    const id = `${bookId}-${chapter}-${verse}`;
    return bookmarks.some((b) => b.id === id);
  };

  const setHighlightColor = (
    bookId: string,
    chapter: number,
    verse: number,
    color: HighlightColor | null
  ) => {
    const id = `${bookId}-${chapter}-${verse}`;
    const book = BIBLE_BOOKS.find((b) => b.id === bookId);
    setHighlights((prev) => {
      const next = { ...prev };
      if (!color) {
        delete next[id];
      } else {
        next[id] = {
          id,
          bookId,
          bookName: book ? book.name : 'Livro',
          chapter,
          verse,
          color,
          createdAt: Date.now(),
        };
      }
      return next;
    });
  };

  const getHighlight = (bookId: string, chapter: number, verse: number) => {
    const id = `${bookId}-${chapter}-${verse}`;
    return highlights[id];
  };

  const saveNote = (
    bookId: string,
    chapter: number,
    verse: number,
    verseText: string,
    noteText: string
  ) => {
    const id = `${bookId}-${chapter}-${verse}`;
    const book = BIBLE_BOOKS.find((b) => b.id === bookId);
    setNotes((prev) => {
      const existing = prev[id];
      return {
        ...prev,
        [id]: {
          id,
          bookId,
          bookName: book ? book.name : 'Livro',
          chapter,
          verse,
          verseText,
          noteText,
          createdAt: existing ? existing.createdAt : Date.now(),
          updatedAt: Date.now(),
        },
      };
    });
  };

  const deleteNote = (bookId: string, chapter: number, verse: number) => {
    const id = `${bookId}-${chapter}-${verse}`;
    setNotes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const getNote = (bookId: string, chapter: number, verse: number) => {
    const id = `${bookId}-${chapter}-${verse}`;
    return notes[id];
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <BibleContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeBook,
        activeChapter,
        openChapter,
        currentVerses,
        goToPreviousChapter,
        goToNextChapter,
        canGoPrevious,
        canGoNext,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        highlights,
        setHighlightColor,
        getHighlight,
        notes,
        saveNote,
        deleteNote,
        getNote,
        history,
        clearHistory,
        settings,
        updateSettings,
        verseToShare,
        setVerseToShare,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};
