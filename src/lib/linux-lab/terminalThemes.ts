import { ITheme } from '@xterm/xterm';

export type TerminalThemeId = 'classic-dark' | 'solarized' | 'gruvbox';

export interface TerminalThemeConfig {
  id: TerminalThemeId;
  name: string;
  tagline: string;
  previewColors: {
    bg: string;
    fg: string;
    accent: string;
  };
  terminalTheme: ITheme;
  containerBg: string;
  titleBarBg: string;
  quickBarBg: string;
  statusBarBg: string;
  borderColor: string;
  textColor: string;
  accentBadge: string;
}

export const TERMINAL_THEMES: Record<TerminalThemeId, TerminalThemeConfig> = {
  'classic-dark': {
    id: 'classic-dark',
    name: 'Classic Dark',
    tagline: 'Standard DevOps Charcoal & Blue',
    previewColors: {
      bg: '#0d1117',
      fg: '#c9d1d9',
      accent: '#58a6ff',
    },
    terminalTheme: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      cursor: '#58a6ff',
      cursorAccent: '#0d1117',
      selectionBackground: 'rgba(56, 139, 253, 0.35)',
      black: '#161b22',
      red: '#ff7b72',
      green: '#7ee787',
      yellow: '#d29922',
      blue: '#58a6ff',
      magenta: '#bc8cff',
      cyan: '#39c5cf',
      white: '#d0d7de',
      brightBlack: '#484f58',
      brightRed: '#ffa198',
      brightGreen: '#56d364',
      brightYellow: '#e3b341',
      brightBlue: '#79c0ff',
      brightMagenta: '#d2a8ff',
      brightCyan: '#56d4dd',
      brightWhite: '#ffffff',
    },
    containerBg: 'bg-[#090d13]',
    titleBarBg: 'bg-[#161b22]',
    quickBarBg: 'bg-[#12161f]',
    statusBarBg: 'bg-[#11161d]',
    borderColor: 'border-neutral-800',
    textColor: 'text-neutral-300',
    accentBadge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  'solarized': {
    id: 'solarized',
    name: 'Solarized',
    tagline: 'Ethan Schoonover Deep Cyan & Yellow',
    previewColors: {
      bg: '#002b36',
      fg: '#839496',
      accent: '#268bd2',
    },
    terminalTheme: {
      background: '#002b36',
      foreground: '#839496',
      cursor: '#93a1a1',
      cursorAccent: '#002b36',
      selectionBackground: 'rgba(7, 54, 66, 0.85)',
      black: '#073642',
      red: '#dc322f',
      green: '#859900',
      yellow: '#b58900',
      blue: '#268bd2',
      magenta: '#d33682',
      cyan: '#2aa198',
      white: '#eee8d5',
      brightBlack: '#002b36',
      brightRed: '#cb4b16',
      brightGreen: '#586e75',
      brightYellow: '#657b83',
      brightBlue: '#839496',
      brightMagenta: '#6c71c4',
      brightCyan: '#93a1a1',
      brightWhite: '#fdf6e3',
    },
    containerBg: 'bg-[#001f27]',
    titleBarBg: 'bg-[#073642]',
    quickBarBg: 'bg-[#002833]',
    statusBarBg: 'bg-[#001f27]',
    borderColor: 'border-[#0a4654]',
    textColor: 'text-[#93a1a1]',
    accentBadge: 'text-[#2aa198] bg-[#2aa198]/10 border-[#2aa198]/20',
  },
  'gruvbox': {
    id: 'gruvbox',
    name: 'Gruvbox',
    tagline: 'Retro Warm Amber & Forest Tone',
    previewColors: {
      bg: '#282828',
      fg: '#ebdbb2',
      accent: '#fe8019',
    },
    terminalTheme: {
      background: '#282828',
      foreground: '#ebdbb2',
      cursor: '#fe8019',
      cursorAccent: '#282828',
      selectionBackground: 'rgba(80, 73, 69, 0.8)',
      black: '#282828',
      red: '#cc241d',
      green: '#98971a',
      yellow: '#d79921',
      blue: '#458588',
      magenta: '#b16286',
      cyan: '#689d6a',
      white: '#a89984',
      brightBlack: '#928374',
      brightRed: '#fb4934',
      brightGreen: '#b8bb26',
      brightYellow: '#fabd2f',
      brightBlue: '#83a598',
      brightMagenta: '#d3869b',
      brightCyan: '#8ec07c',
      brightWhite: '#ebdbb2',
    },
    containerBg: 'bg-[#1d2021]',
    titleBarBg: 'bg-[#32302f]',
    quickBarBg: 'bg-[#282828]',
    statusBarBg: 'bg-[#1d2021]',
    borderColor: 'border-[#3c3836]',
    textColor: 'text-[#ebdbb2]',
    accentBadge: 'text-[#fabd2f] bg-[#fabd2f]/10 border-[#fabd2f]/20',
  },
};

export const TERMINAL_THEME_LIST: TerminalThemeConfig[] = [
  TERMINAL_THEMES['classic-dark'],
  TERMINAL_THEMES['solarized'],
  TERMINAL_THEMES['gruvbox'],
];
