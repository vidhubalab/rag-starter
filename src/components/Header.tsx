import React, { useState } from 'react';
import { Search, Globe, User, Moon, Sun, Bookmark, Menu, X, ChevronDown, TrendingUp } from 'lucide-react';
import { MainNavTab } from '../types/market';

interface HeaderProps {
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isDarkMode,
  onToggleDarkMode,
  onGetStarted,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const navItems: MainNavTab[] = ['Products', 'Community', 'Markets', 'Brokers', 'Screeners'];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'JA', name: '日本語' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#131722] border-b border-[#E0E3EB] dark:border-[#2A2E39] h-16 px-4 lg:px-6 flex items-center justify-between transition-colors duration-150">
      {/* Left: Brand Logo & Global Search */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* TradingView Iconic Monogram Logo */}
        <button
          onClick={() => onTabChange('Markets')}
          aria-label="TradingView Logo"
          className="flex items-center text-black dark:text-white hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
          title="TradingView"
        >
          <svg
            className="fill-current"
            fill="none"
            height="28"
            viewBox="0 0 36 28"
            width="36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 4C0 1.79086 1.79086 0 4 0H9.5C11.7091 0 13.5 1.79086 13.5 4V16C13.5 18.2091 11.7091 20 9.5 20H4C1.79086 20 0 18.2091 0 16V4Z"
              fill="currentColor"
            />
            <path
              d="M15 4C15 1.79086 16.7909 0 19 0H29C31.2091 0 33 1.79086 33 4V8.5C33 10.7091 31.2091 12.5 29 12.5H23V24C23 26.2091 21.2091 28 19 28H15V4Z"
              fill="currentColor"
            />
            <rect fill="currentColor" height="8.5" rx="4" width="8" x="25.5" y="15.5" />
          </svg>
        </button>

        {/* Search Input Pill */}
        <div className="relative w-44 sm:w-56 md:w-64">
          <button
            onClick={onOpenSearch}
            className="w-full bg-[#f0f3fa] dark:bg-[#1E222D] hover:bg-[#e4e7ef] dark:hover:bg-[#282d3c] text-sm rounded-full pl-10 pr-4 py-2 border-0 outline-none transition-colors duration-150 text-[#787B86] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Search className="w-4 h-4 text-[#787B86] shrink-0" />
              <span className="truncate text-xs sm:text-sm font-normal">Search</span>
            </div>
            <kbd className="hidden sm:inline-block text-[11px] bg-white dark:bg-[#2A2E39] text-[#787B86] px-1.5 py-0.5 rounded border border-[#E0E3EB] dark:border-[#363A45] font-sans font-medium">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden md:flex items-center space-x-7 text-sm font-semibold tracking-tight">
        {navItems.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative py-1 font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#2962FF] font-bold'
                  : 'text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] dark:hover:text-[#2962FF]'
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#2962FF] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2.5">
        {/* Watchlist Toggle */}
        <button
          onClick={onOpenWatchlist}
          title="Open Watchlist"
          className="relative p-2 text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] rounded-full hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] transition-colors cursor-pointer"
        >
          <Bookmark className="w-5 h-5" />
          {watchlistCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#2962FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] rounded-full hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            aria-label="Select Language"
            className="flex items-center gap-1 text-xs md:text-sm font-semibold text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] px-2 py-1.5 rounded transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            <span className="hidden sm:inline">{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-[#787B86]" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setCurrentLang(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] ${
                    currentLang === l.code ? 'text-[#2962FF] font-bold' : 'text-[#131722] dark:text-[#D1D4DC]'
                  }`}
                >
                  <span>{l.name}</span>
                  <span className="text-[11px] text-[#787B86]">{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Account Icon */}
        <button
          onClick={onGetStarted}
          aria-label="User Profile"
          className="p-1.5 text-[#131722] dark:text-[#D1D4DC] hover:text-[#2962FF] rounded-full hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] transition-colors cursor-pointer"
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
        </button>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="tv-btn-gradient text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-sm cursor-pointer whitespace-nowrap"
        >
          Get started
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#131722] dark:text-[#D1D4DC] hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] rounded-full"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#131722] border-b border-[#E0E3EB] dark:border-[#2A2E39] px-4 py-4 space-y-2 shadow-2xl z-50">
          {navItems.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                onTabChange(tab);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                activeTab === tab
                  ? 'bg-[#2962FF]/10 text-[#2962FF]'
                  : 'text-[#131722] dark:text-[#D1D4DC] hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
